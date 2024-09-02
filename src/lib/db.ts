const dbUrl = process.env.ATLASDB_URL;
import mongoose from "mongoose";
const connect = async () => {
  const connectionState = mongoose.connection.readyState;
  if (connectionState === 1) {
    // Already connected
    return;
  }
  if (connectionState === 2) {
    console.log("Connecting to MongoDB..");
    return;
  }
  try {
    await mongoose.connect(dbUrl!, {
      dbName: "QbonNew",
      bufferCommands: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connect;
