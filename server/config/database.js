const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = async () => {
  try {
   // console.log("Mongo URI:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB Error:");
    console.error(err);
    console.error(err.stack);

  }
};