const sqlite3 = require("sqlite3");
sqlite3.verbose();
const { open } = require("sqlite");
const nodemon = require("nodemon");
const { model } = require("mongoose");

interface Controller {
	[key: string]: Function;
}

interface FinalData {
	cliente: string;
	auto: string;
	trabajo: string;
	km: number;
	fecha: string;
	patente: string;
	push: Function;
}
[];

const controller: Controller = {};

controller.getByClient = async (req, res) => {
	const { cliente }: { cliente: string } = req.params; // IMPORTANT SYNTAX

	const db: any = await open({
		filename: "./db_autos",
		driver: sqlite3.Database,
	});
	let cliente_id: number;

	try {
		cliente_id = (await db.get("SELECT id FROM Cliente WHERE cliente = ?", [cliente])).id;
	} catch (e) {
		console.log(e);
		res.sendStatus(400);
		db.close();
		return;
	}
	const autos_cliente: [{ id: number; auto_id: number; patente: string }] = await db.all(
		"SELECT id, auto_id, patente FROM Auto_Cliente WHERE cliente_id = ?",
		[cliente_id]
	);

	let finalData: FinalData;

	for (const auto_cliente of autos_cliente) {
		const { id, auto_id, patente } = auto_cliente;
		const { modelo }: { modelo: string } = await db.get("SELECT modelo FROM Auto WHERE id = ?", [
			auto_id,
		]);

		const reparaciones: [{ trabajo: string; kilometraje: number; fecha: string }] = await db.all(
			"SELECT trabajo, kilometraje, fecha FROM Reparacion WHERE auto_cliente_id = ?",
			id
		);

		for (const reparacion of reparaciones) {
			const { trabajo, kilometraje, fecha } = reparacion;
			finalData.push({
				cliente: cliente,
				auto: modelo,
				trabajo: trabajo,
				km: kilometraje,
				fecha: fecha,
				patente: patente,
			});
		}
	}

	res.send(finalData);
	db.close();
};

controller.getByPatent = async (req, res) => {
	const { patente }: { patente: string } = req.params;

	const db: any = await open({
		filename: "./db_autos",
		driver: sqlite3.Database,
	});

	const autos_cliente: { id: number; cliente_id: number; auto_id: number }[] = await db.all(
		"SELECT id, cliente_id, auto_id FROM Auto_Cliente WHERE patente = ?",
		[patente]
	);

	if (autos_cliente.length === 0) {
		res.sendStatus(400);
		db.close();
		return;
	}

	let finalData: FinalData;

	for (const auto_cliente of autos_cliente) {
		const { id, cliente_id, auto_id } = auto_cliente;
		const { modelo }: { modelo: string } = await db.get("SELECT modelo FROM Auto WHERE id = ?", [
			auto_id,
		]);

		const clientes: { cliente: string }[] = await db.all("SELECT cliente FROM Cliente WHERE id = ?", [
			cliente_id,
		]);
		for (const clienteArr of clientes) {
			const { cliente } = clienteArr;
			const reparaciones: { trabajo: string; kilometraje: number; fecha: string }[] = await db.all(
				"SELECT trabajo, kilometraje, fecha FROM Reparacion WHERE auto_cliente_id = ?",
				id
			);
			for (const reparacion of reparaciones) {
				const { trabajo, kilometraje, fecha } = reparacion;
				finalData.push({
					cliente: cliente,
					auto: modelo,
					trabajo: trabajo,
					km: kilometraje,
					fecha: fecha,
					patente: patente,
				});
			}
		}
	}

	res.send(finalData);
	db.close();
};

controller.getPatentsList = async (req, res) => {
	const db: any = await open({
		filename: "./db_autos",
		driver: sqlite3.Database,
	});

	const data = await db.all("SELECT patente FROM Auto_Cliente");

	const lista = data.map((obj) => {
		return obj.patente;
	});
	res.send(lista);
	db.close();
};

controller.getClientsList = async (req, res) => {
	const db: any = await open({
		filename: "./db_autos",
		driver: sqlite3.Database,
	});

	const data = await db.all("SELECT cliente FROM Cliente");

	const lista = data.map((obj) => {
		return obj.cliente;
	});
	res.send(lista);
	db.close();
};

controller.getAutosList = async (req, res) => {
	const db: any = await open({
		filename: "./db_autos",
		driver: sqlite3.Database,
	});

	const data = await db.all("SELECT modelo FROM Auto");

	const lista = data.map((obj) => obj.modelo);

	res.send(lista);
	db.close();
};

controller.newRecord = async (req, res) => {
	const db: any = await open({
		filename: "./db_autos",
		driver: sqlite3.Database,
	});

	let {
		cliente,
		auto,
		trabajo,
		km,
		fecha,
		patente,
	}: { cliente: string; auto: string; trabajo: string; km: number; fecha: string; patente: string } =
		req.body;

	if (typeof km === "string") {
		km = parseInt(km);
	}

	if (km < 0) {
		res.sendStatus(400);
		db.close();
		return;
	}

	await db.run("INSERT OR IGNORE INTO Cliente (cliente) VALUES (?)", [cliente]);
	await db.run("INSERT OR IGNORE INTO Auto (modelo) VALUES (?)", [auto]);

	// const cliente_id = (await db.get("SELECT id FROM Cliente WHERE cliente = ?", [cliente])).id;
	const { id: cliente_id }: { id: number } = await db.get("SELECT id FROM Cliente WHERE cliente = ?", [
		cliente,
	]);
	const { id: auto_id }: { id: number } = await db.get("SELECT id FROM Auto WHERE modelo = ?", [auto]);

	await db.run("INSERT OR IGNORE INTO Auto_Cliente (cliente_id, auto_id, patente) VALUES (?,?,?)", [
		cliente_id,
		auto_id,
		patente,
	]);

	const { id: auto_cliente_id }: { id: number } = await db.get(
		"SELECT id FROM Auto_Cliente WHERE cliente_id = ? AND auto_id = ? AND patente = ?",
		[cliente_id, auto_id, patente]
	);

	await db.run(
		"INSERT OR IGNORE INTO Reparacion (auto_cliente_id, trabajo, kilometraje, fecha) VALUES (?, ?, ?, ?)",
		[auto_cliente_id, trabajo, km, fecha]
	);

	db.close();
};

module.exports = controller;
