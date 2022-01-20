const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const {
	getByClient,
	getClientsList,
	getByPatent,
	getByRegex,
	newRecord,
	getPatentsList,
	getAutosList,
} = require("./database");

app.use(cors());

app.use(express.json());

const URL = process.env.URL || "http://localhost:5000";

app.get("/lista/clientes", getClientsList);

app.get("/lista/patentes", getPatentsList);

app.get("/lista/autos", getAutosList);

app.get("/cliente/:cliente", getByClient);

app.get("/patente/:patente", getByPatent);

app.post("/nuevo", newRecord);

app.listen(process.env.PORT | 5000, () => {
	console.log("Server listening on port", process.env.PORT || 5000);
});