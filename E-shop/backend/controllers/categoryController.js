import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;

  const exists = await Category.findOne({ name });
  if (exists) return res.status(400).json({ message: "Category exists" });

  const category = await Category.create({ name });
  res.json(category);
};

export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};
