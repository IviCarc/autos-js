const sqlite3 = require('sqlite3');
sqlite3.verbose()
const {open} = require('sqlite');

const controller = {}

controller.getByClient = async (req, res) => {
	const {cliente} = req.params
	const db = await open({
		filename: './db_autos',
		driver: sqlite3.Database
    })
	const cliente_id = (await db.get('SELECT id FROM Cliente WHERE cliente = ?', [cliente])).id;
	console.log(cliente_id)
	const autos_cliente = await db.all('SELECT id, auto_id, patente FROM Auto_Cliente WHERE cliente_id = ?', [cliente_id])

	let reparaciones = []

	db.each('SELECT id, auto_id, patente FROM Auto_Cliente WHERE cliente_id = ?', [cliente_id], async (err, auto_cliente) => {
		const {id, auto_id, patente} = auto_cliente
		const {auto} = await db.get('SELECT modelo FROM Auto WHERE id = ?', [auto_id]);

		db.each('SELECT trabajo ,kilometraje, fecha FROM Reparacion WHERE auto_cliente_id = ?', id, (err, reparacion) => {
			const {trabajo, kilometraje, fecha} = reparacion
			reparaciones.push({cliente:cliente, auto:auto, trabajo:trabajo, km:kilometraje, fecha:fecha, patente:patente})
		});
	})
	// setTimeout(() => {
	// 	console.log(reparaciones)
	// }, 1000)
	console.log(reparaciones)
}

controller.getPatentsList = (req, res) => {
    console.log("HI")
}

controller.getClientsList = (req, res) => {
    console.log("HI")
}

controller.getByPatent = (req, res) => {
    console.log("HI")
}

controller.getByRegex = (req, res) => {
    console.log("HI")
}

controller.newRecord = (req, res) => {
    console.log("HI")
}


module.exports = controller; 