const mongoose = require("mongoose");
const { readConn, writeConn } = require("../db");

const bookSchema = new mongoose.Schema(
  {
    maSP: { type: String, required: true },
    tenSach: { type: String, required: true },
    giaGoc: Number,
    giaSauThue: Number,
  },
  { timestamps: true },
);

const BookRead = readConn.model("Book", bookSchema, "books");
const BookWrite = writeConn.model("Book", bookSchema, "books");

module.exports = { BookRead, BookWrite };
