const express = require("express");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const { engine } = require("express-handlebars");
require("dotenv").config();

const { BookRead, BookWrite } = require("./models/Book");

const app = express();

const MSSV = process.env.MSSV;
const PREFIX = MSSV.slice(-3);
const LAST_DIGIT = parseInt(MSSV.slice(-1));
const VAT = (LAST_DIGIT + 4) / 100;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: "views/layouts",
  }),
);
app.set("view engine", "hbs");
app.set("views", "./views");

function validateMaSP(req, res, next) {
  const { maSP } = req.body;

  if (!maSP || maSP.trim() === "") {
    return res.status(400).send("Thiếu mã sản phẩm!");
  }

  if (!maSP.startsWith(PREFIX)) {
    return res
      .status(400)
      .send(`Mã sản phẩm phải bắt đầu bằng "${PREFIX}". Bạn nhập: "${maSP}"`);
  }

  next();
}

// Routes

app.get("/", async (req, res) => {
  try {
    const books = await BookRead.find().lean();
    res.render("home", {
      books,
      hoTen: "Nguyễn Văn Triều",
      mssv: MSSV,
      vat: (VAT * 100).toFixed(0),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi đọc dữ liệu");
  }
});

app.get("/books/add", (req, res) => {
  res.render("add");
});

app.post("/books", validateMaSP, async (req, res) => {
  try {
    const { maSP, tenSach, giaGoc } = req.body;
    const giaSauThue = Number(giaGoc) * (1 + VAT);
    await BookWrite.create({
      maSP,
      tenSach,
      giaGoc: Number(giaGoc),
      giaSauThue,
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi ghi dữ liệu");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
  console.log(`Prefix mã SP: ${PREFIX} | VAT: ${VAT * 100}%`);
});
