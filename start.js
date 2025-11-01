// const { connectToMongoDB } = require("./db");
// const createServer = require("./server");

import { connectToMongoDB } from "./db.js";
import createServer from "./server.js";
const port = process.env.PORT || 5050;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectToMongoDB();
    console.log("MongoDB connection established.");

    // Create and start the HTTP server
    const httpServer = await createServer();

    // Start the server after MongoDB is connected
    httpServer.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start the server:", err);
    process.exit(1); // Exit if the server cannot start
  }
};

startServer();
