const express = require("express");
const connectDB = require("./db");
const questionsRoute = require("./routes/questions");
const cors = require("cors");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const { getQuestionsGrpc } = require("./controllers/questionsController");

// Database connection
connectDB();

// Express setup
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/questions", questionsRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Express server
app.listen(5000, () => {
  console.log("REST server running on port 5000 🚀🚀");
});

// gRPC Server Setup
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "questions.proto")
);
const questionsProto = grpc.loadPackageDefinition(packageDefinition).questions;

function main() {
  const grpcServer = new grpc.Server();

  grpcServer.addService(questionsProto.QuestionsService.service, {
    getQuestions: getQuestionsGrpc,
  });

  grpcServer.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        console.error("gRPC server failed to bind:", err);
        return;
      }
      console.log("gRPC server running on port 50051 🚀🚀");
      grpcServer.start();
    }
  );
}

main();
