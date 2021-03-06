export {};
const sqlite3 = require("sqlite3");
sqlite3.verbose();
const { open } = require("sqlite");

interface FinalData {
	cliente: string;
	auto: string;
	trabajo: string;
	km: number;
	fecha: string;
	patente: string;
}
[];

const SortArray = (x, y) => {
	// Esta funcion ordena el auto_cliente por fecha, de la más reciente a la más antigua
	if (x.fecha < y.fecha) {
		return 1;
	}
	if (x.fecha > y.fecha) {
		return -1;
	}
	return 0;
};

const getByClient = async (req, res) => {
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

	let finalData: FinalData[] = [];

	for (const auto_cliente of autos_cliente) {
		const { id, auto_id, patente } = auto_cliente;
		const { modelo }: { modelo: string } = await db.get("SELECT modelo FROM Auto WHERE id = ?", [
			auto_id,
		]);

		const reparaciones: [{ trabajo: string; kilometraje: number; fecha: string }] = (
			await db.all("SELECT trabajo, kilometraje, fecha FROM Reparacion WHERE auto_cliente_id = ?", id)
		).sort(SortArray);

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

const getByPatent = async (req, res) => {
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

	let finalData: FinalData[] = [];

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

	res.send(finalData.sort(SortArray));
	db.close();
};

const getList = async (req, res) => {
	const db: any = await open({
		filename: "./db_autos",
		driver: sqlite3.Database,
	});

	const clientes: string[] = (await db.all("SELECT cliente FROM Cliente")).map((obj) => obj.cliente);
	const autos: string[] = (await db.all("SELECT modelo FROM  Auto")).map((obj) => obj.modelo);
	const patentes: string[] = (await db.all("SELECT patente FROM  Auto_Cliente")).map((obj) => obj.patente);

	res.send({ clientes: clientes, autos: autos, patentes: patentes });
};

const newRecord = async (req, res) => {
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

export { getList, getByClient, getByPatent, newRecord };
