const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const Question = require("../models/Questions");

// gRPC Client Setup
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../questions.proto")
);
const questionsProto = grpc.loadPackageDefinition(packageDefinition).questions;

const client = new questionsProto.QuestionsService(
  "localhost:50051",
  grpc.credentials.createInsecure(),
  {
    "grpc.max_receive_message_length": 1024 * 1024 * 10, // 10MB
    "grpc.max_send_message_length": 1024 * 1024 * 10, // 10MB
  }
);

// REST Controller (acts as gRPC client)
function getQuestions(req, res) {
  client.getQuestions({}, (err, response) => {
    if (err) {
      console.error("gRPC Error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(response.questions);
  });
}

// gRPC Server Implementation
async function getQuestionsGrpc(call, callback) {
  try {
    const questions = await Question.find().lean();
    callback(null, { questions });
  } catch (err) {
    console.error("Database Error:", err);
    callback({
      code: grpc.status.INTERNAL,
      message: "Failed to fetch questions",
    });
  }
}

module.exports = { getQuestions, getQuestionsGrpc };
