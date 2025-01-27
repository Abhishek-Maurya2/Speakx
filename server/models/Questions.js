const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["ANAGRAM", "MCQ", "READ_ALONG"],
  },
  siblingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: false,
  },
  // Conditional fields for ANAGRAM
  anagramType: {
    type: String,
    required: function () {
      return this.type === "ANAGRAM";
    },
  },
  blocks: {
    type: [
      {
        text: {
          type: String,
          required: true,
        },
        showInOption: {
          type: Boolean,
          required: true,
          default: true,
        },
        isAnswer: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
    required: function () {
      return this.type === "ANAGRAM";
    },
  },
  solutions: {
    type: [
      {
        text: String,
      },
    ], // Changed from String to [String]
    required: function () {
      return this.type === "ANAGRAM";
    },
  },
  // Conditional fields for MCQ
  options: {
    type: [
      {
        text: String,
        isCorrectAnswer: Boolean,
      },
    ],
    required: function () {
      return this.type === "MCQ";
    },
  },
  // READ_ALONG has no additional fields
});

module.exports = mongoose.model("Question", questionSchema);
