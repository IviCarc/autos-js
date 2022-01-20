var express = require("express");
var app = express();
require("dotenv").config();
var cors = require("cors");
// PROXIMO A REALIZAR DAR FORMATO A LA FECHA COMO AÑO/MES/DIA PARA ASI ORDENARLO MEJOR //
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!/
var _a = require("./database"), getByClient = _a.getByClient, getClientsList = _a.getClientsList, getByPatent = _a.getByPatent, getByRegex = _a.getByRegex, newRecord = _a.newRecord, getPatentsList = _a.getPatentsList, getAutosList = _a.getAutosList, getList = _a.getList;
app.use(cors());
app.use(express.json());
app.get("/lista", getList);
app.get("/cliente/:cliente", getByClient);
app.get("/patente/:patente", getByPatent);
app.post("/nuevo", newRecord);
app.listen(process.env.PORT || 5000, function () {
    console.log("Server listening on port", process.env.PORT || 5000);
});
