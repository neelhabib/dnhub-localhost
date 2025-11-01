import express from "express";
import next from "next";
import http from "http"; // Required for socket.io integration
import { Server } from "socket.io";
import cors from "cors";
import GenerateToken from "./ServerFunctions/Google/GenerateToken.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

export default async function createServer() {
  await app.prepare();

  const server = express();
  server.use(express.static("public"));
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  server.use(cors(corsOptions));
  server.use(express.json({ limit: "5000mb" }));
  server.use(
    express.urlencoded({
      extended: false,
      limit: "5000mb",
      parameterLimit: 50000000,
    })
  );
  server.use(express.static("public"));
  /* ------Generate Google Ads Refresh Token Function---------*/
  GenerateToken();
  /* ------Generate Google Ads Refresh Token Function---------*/
  io.on("connection", (socket) => {
    console.log("connected", socket.id);

    socket.on("disconnect", () => {
      console.log("disconnected:", socket.id);
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  return httpServer;
}

// module.exports = createServer;
