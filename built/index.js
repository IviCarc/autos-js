var express = require("express");
var app = express();
require("dotenv").config();
var cors = require("cors");
var _a = require("./database"), getByClient = _a.getByClient, getByPatent = _a.getByPatent, newRecord = _a.newRecord, getList = _a.getList;
app.use(cors());
app.use(express.json());
app.get("/lista", getList);
app.get("/cliente/:cliente", getByClient);
app.get("/patente/:patente", getByPatent);
app.post("/nuevo", newRecord);
app.listen(process.env.PORT || 5000, function () {
    console.log("Server listening on port", process.env.PORT || 5000);
});
