var express = require("express");
var app = express();
require("dotenv").config();
var cors = require("cors");
var _a = require("./database"), getByClient = _a.getByClient, getClientsList = _a.getClientsList, getByPatent = _a.getByPatent, getByRegex = _a.getByRegex, newRecord = _a.newRecord, getPatentsList = _a.getPatentsList, getAutosList = _a.getAutosList;
app.use(cors());
app.use(express.json());
var URL = process.env.URL || "http://localhost:5000";
app.get("/lista/clientes", getClientsList);
app.get("/lista/patentes", getPatentsList);
app.get("/lista/autos", getAutosList);
app.get("/cliente/:cliente", getByClient);
app.get("/patente/:patente", getByPatent);
app.post("/nuevo", newRecord);
app.listen(process.env.PORT | 5000, function () {
    console.log("Server listening on port", process.env.PORT || 5000);
});
