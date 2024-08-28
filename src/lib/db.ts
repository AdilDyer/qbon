const dbUrl = process.env.ATLASDB_URL;
import mongoose from "mongoose";
const connect = async () => {
  const connectionState = mongoose.connection.readyState;
  if (connectionState === 1) {
    console.log("Already Connected to MongoDB");
    return;
  }
  if (connectionState === 2) {
    console.log("Connecting..");
    return;
  }
  try {
    mongoose.connect(dbUrl!, {
      dbName: "QbonNew",
      bufferCommands: false,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connect;
