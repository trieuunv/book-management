const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const readConn = mongoose.createConnection(process.env.READ_URI);
const writeConn = mongoose.createConnection(process.env.WRITE_URI);

module.exports = { readConn, writeConn };
