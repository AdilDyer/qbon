const mongoose = require("mongoose");

// Define a schema for password reset tokens
const PasswordResetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiryTime: { type: Date, required: true },
});

// Create a model based on the schema
const PasswordResetToken = mongoose.model(
  "PasswordResetToken",
  PasswordResetTokenSchema
);

module.exports = PasswordResetToken;
