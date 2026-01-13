import Order from "../models/Order.js";
import Product from "../models/Product.js"; // make sure you have Product model
import Notification from "../models/Notification.js"; // 🔔 NEW

/* ================= CREATE ORDER ================= */
export const createOrder = async (req, res) => {
  try {
    const data = req.body;

    // ✅ Validate cart
    if (!data.items || !data.items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // ✅ Build fullName for mobile users
    if (data.shippingAddress?.firstName && data.shippingAddress?.lastName) {
      data.shippingAddress.fullName =
        data.shippingAddress.firstName + " " + data.shippingAddress.lastName;
    }

    // ✅ Enrich items: ensure title, price, image exist (snapshot)
    const enrichedItems = await Promise.all(
      data.items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Product not found: " + item.product);

        return {
          product: product._id,
          title: item.title || product.title,
          price: item.price || product.price,
          image: item.image || product.images[0], // take first image
          qty: item.qty,
          color: item.color || "",
          size: item.size || "",
        };
      })
    );

    // ✅ Calculate totals server-side
    const subTotal = enrichedItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const deliveryFee =
      data.deliveryMethod === "addis"
        ? 150
        : data.deliveryMethod === "region"
        ? 250
        : 0;
    const totalAmount = subTotal + deliveryFee;

    const newOrder = new Order({
      ...data,
      items: enrichedItems,
      totalAmount,
      deliveryFee,
      expectedDelivery: data.expectedDelivery || "N/A",
    });

    const savedOrder = await newOrder.save();

    // 🔔 Create notification for new order
    await Notification.create({
      user: savedOrder.user,
      title: "Order placed",
      message: `Your order #${savedOrder._id} was placed successfully.`,
      type: "order",
      link: `/orders/${savedOrder._id}`,
    });

    // 🔔 Emit Socket.IO event
    const io = req.app.get("io");
    if (io) {
      io.to(savedOrder.user.toString()).emit("new-notification");
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/* ================= GET ALL ORDERS (ADMIN) ================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= GET ORDER BY ID ================= */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= GET USER ORDERS ================= */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= UPDATE ORDER STATUS ================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔔 Notification for order status update
    let title = "Order update";
    let message = `Your order #${order._id} status updated to ${status}.`;

    if (status === "shipped") {
      title = "Order shipped 🚚";
      message = `Your order #${order._id} has been shipped.`;
    }

    if (status === "delivered") {
      title = "Order delivered 🎉";
      message = `Your order #${order._id} has been delivered successfully.`;
    }

    if (status === "cancelled") {
      title = "Order cancelled ❌";
      message = `Your order #${order._id} was cancelled.`;
    }

    // 🔔 Save notification
    await Notification.create({
      user: order.user,
      title,
      message,
      type: "order",
      link: `/orders/${order._id}`,
    });

    // 🔔 Emit Socket.IO event
    const io = req.app.get("io");
    if (io) {
      io.to(order.user.toString()).emit("new-notification");
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= DELETE ORDER ================= */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
