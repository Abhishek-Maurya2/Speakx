const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const Question = require("../models/Questions");

// gRPC setup
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../questions.proto")
);
const questionsProto = grpc.loadPackageDefinition(packageDefinition).questions;

const client = new questionsProto.QuestionsService(
  "localhost:50051",
  grpc.credentials.createInsecure(),
  {
    "grpc.max_receive_message_length": 1024 * 1024 * 50,
    "grpc.max_send_message_length": 1024 * 1024 * 50,
  }
);

// REST Controller
var recived = {};

function getQuestions(req, res) {
  recived = {
    title: req.body.title || "",
    type: req.body.type || "",
    anagramType: req.body.anagramType || "",
  };

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
    const { title, type, anagramType } = recived;
    const query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (type) {
      query.type = type;
    }
    if (anagramType) {
      query.anagramType = anagramType;
    }
    console.log("Query:", query);

    const questions = await Question.find(query);
    callback(null, { questions });
  } catch (err) {
    console.error("Database Error:", err);
    callback({
      code: grpc.status.INTERNAL,
      message: "Database error",
    });
  }
}

module.exports = { getQuestions, getQuestionsGrpc };
