import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY,
);

const sendEmail = async ({ to, subject, html }) => {
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAIL_FROM,
            Name: "FERA",
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    });

    console.log("Mailjet email sent");
  } catch (error) {
    console.error("Mailjet error:", error.response?.body || error.message);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;
