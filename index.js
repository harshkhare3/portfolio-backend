const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.PASS,
  },
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/email", (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const name = req.body.name;

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: process.env.RECIPIENT_EMAIL,
    subject: "Employer name - " + name + " & email - " + email,
    html: req.body.message,
  };

  transporter.sendMail(mailOptions, function(err) {
    if (err) {
      console.log("Error ", err);
      res.sendStatus(400);
    } else {
      res.send("success");
    }
  });
});

exports.app = functions.https.onRequest(app);
