const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const { getQuestionsGrpc } = require("./controllers/questionsController");

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "questions.proto")
);
const questionsProto = grpc.loadPackageDefinition(packageDefinition).questions;

const server = new grpc.Server();

server.addService(questionsProto.QuestionsService.service, {
  getQuestions: getQuestionsGrpc,
});

async function startGrpcServer() {
  return new Promise((resolve, reject) => {
    server.bindAsync(
      "0.0.0.0:50051",
      grpc.ServerCredentials.createInsecure(),
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        server.start();
        resolve();
      }
    );
  });
}

module.exports = { startGrpcServer };
