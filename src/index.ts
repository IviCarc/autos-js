const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const { getByClient, getByPatent, newRecord, getList } = require("./database");

app.use(cors());

app.use(express.json());

app.get("/lista", getList);

app.get("/cliente/:cliente", getByClient);

app.get("/patente/:patente", getByPatent);

app.post("/nuevo", newRecord);

app.listen(process.env.PORT || 5000, () => {
	console.log("Server listening on port", process.env.PORT || 5000);
});
