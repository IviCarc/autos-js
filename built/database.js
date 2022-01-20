var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var sqlite3 = require("sqlite3");
sqlite3.verbose();
var open = require("sqlite").open;
var nodemon = require("nodemon");
var model = require("mongoose").model;
[];
var controller = {};
controller.getByClient = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var cliente, db, cliente_id, e_1, autos_cliente, finalData, _i, autos_cliente_1, auto_cliente, id, auto_id, patente, modelo, reparaciones, _a, reparaciones_1, reparacion, trabajo, kilometraje, fecha;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cliente = req.params.cliente;
                return [4 /*yield*/, open({
                        filename: "./db_autos",
                        driver: sqlite3.Database,
                    })];
            case 1:
                db = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, db.get("SELECT id FROM Cliente WHERE cliente = ?", [cliente])];
            case 3:
                cliente_id = (_b.sent()).id;
                return [3 /*break*/, 5];
            case 4:
                e_1 = _b.sent();
                console.log(e_1);
                res.sendStatus(400);
                db.close();
                return [2 /*return*/];
            case 5: return [4 /*yield*/, db.all("SELECT id, auto_id, patente FROM Auto_Cliente WHERE cliente_id = ?", [cliente_id])];
            case 6:
                autos_cliente = _b.sent();
                _i = 0, autos_cliente_1 = autos_cliente;
                _b.label = 7;
            case 7:
                if (!(_i < autos_cliente_1.length)) return [3 /*break*/, 11];
                auto_cliente = autos_cliente_1[_i];
                id = auto_cliente.id, auto_id = auto_cliente.auto_id, patente = auto_cliente.patente;
                return [4 /*yield*/, db.get("SELECT modelo FROM Auto WHERE id = ?", [
                        auto_id,
                    ])];
            case 8:
                modelo = (_b.sent()).modelo;
                return [4 /*yield*/, db.all("SELECT trabajo, kilometraje, fecha FROM Reparacion WHERE auto_cliente_id = ?", id)];
            case 9:
                reparaciones = _b.sent();
                for (_a = 0, reparaciones_1 = reparaciones; _a < reparaciones_1.length; _a++) {
                    reparacion = reparaciones_1[_a];
                    trabajo = reparacion.trabajo, kilometraje = reparacion.kilometraje, fecha = reparacion.fecha;
                    finalData.push({
                        cliente: cliente,
                        auto: modelo,
                        trabajo: trabajo,
                        km: kilometraje,
                        fecha: fecha,
                        patente: patente,
                    });
                }
                _b.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 7];
            case 11:
                res.send(finalData);
                db.close();
                return [2 /*return*/];
        }
    });
}); };
controller.getByPatent = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var patente, db, autos_cliente, finalData, _i, autos_cliente_2, auto_cliente, id, cliente_id, auto_id, modelo, clientes, _a, clientes_1, clienteArr, cliente, reparaciones, _b, reparaciones_2, reparacion, trabajo, kilometraje, fecha;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                patente = req.params.patente;
                return [4 /*yield*/, open({
                        filename: "./db_autos",
                        driver: sqlite3.Database,
                    })];
            case 1:
                db = _c.sent();
                return [4 /*yield*/, db.all("SELECT id, cliente_id, auto_id FROM Auto_Cliente WHERE patente = ?", [patente])];
            case 2:
                autos_cliente = _c.sent();
                if (autos_cliente.length === 0) {
                    res.sendStatus(400);
                    db.close();
                    return [2 /*return*/];
                }
                _i = 0, autos_cliente_2 = autos_cliente;
                _c.label = 3;
            case 3:
                if (!(_i < autos_cliente_2.length)) return [3 /*break*/, 10];
                auto_cliente = autos_cliente_2[_i];
                id = auto_cliente.id, cliente_id = auto_cliente.cliente_id, auto_id = auto_cliente.auto_id;
                return [4 /*yield*/, db.get("SELECT modelo FROM Auto WHERE id = ?", [
                        auto_id,
                    ])];
            case 4:
                modelo = (_c.sent()).modelo;
                return [4 /*yield*/, db.all("SELECT cliente FROM Cliente WHERE id = ?", [
                        cliente_id,
                    ])];
            case 5:
                clientes = _c.sent();
                _a = 0, clientes_1 = clientes;
                _c.label = 6;
            case 6:
                if (!(_a < clientes_1.length)) return [3 /*break*/, 9];
                clienteArr = clientes_1[_a];
                cliente = clienteArr.cliente;
                return [4 /*yield*/, db.all("SELECT trabajo, kilometraje, fecha FROM Reparacion WHERE auto_cliente_id = ?", id)];
            case 7:
                reparaciones = _c.sent();
                for (_b = 0, reparaciones_2 = reparaciones; _b < reparaciones_2.length; _b++) {
                    reparacion = reparaciones_2[_b];
                    trabajo = reparacion.trabajo, kilometraje = reparacion.kilometraje, fecha = reparacion.fecha;
                    finalData.push({
                        cliente: cliente,
                        auto: modelo,
                        trabajo: trabajo,
                        km: kilometraje,
                        fecha: fecha,
                        patente: patente,
                    });
                }
                _c.label = 8;
            case 8:
                _a++;
                return [3 /*break*/, 6];
            case 9:
                _i++;
                return [3 /*break*/, 3];
            case 10:
                res.send(finalData);
                db.close();
                return [2 /*return*/];
        }
    });
}); };
controller.getPatentsList = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var db, data, lista;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, open({
                    filename: "./db_autos",
                    driver: sqlite3.Database,
                })];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.all("SELECT patente FROM Auto_Cliente")];
            case 2:
                data = _a.sent();
                lista = data.map(function (obj) {
                    return obj.patente;
                });
                res.send(lista);
                db.close();
                return [2 /*return*/];
        }
    });
}); };
controller.getClientsList = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var db, data, lista;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, open({
                    filename: "./db_autos",
                    driver: sqlite3.Database,
                })];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.all("SELECT cliente FROM Cliente")];
            case 2:
                data = _a.sent();
                lista = data.map(function (obj) {
                    return obj.cliente;
                });
                res.send(lista);
                db.close();
                return [2 /*return*/];
        }
    });
}); };
controller.getAutosList = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var db, data, lista;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, open({
                    filename: "./db_autos",
                    driver: sqlite3.Database,
                })];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.all("SELECT modelo FROM Auto")];
            case 2:
                data = _a.sent();
                lista = data.map(function (obj) { return obj.modelo; });
                res.send(lista);
                db.close();
                return [2 /*return*/];
        }
    });
}); };
controller.newRecord = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var db, _a, cliente, auto, trabajo, km, fecha, patente, cliente_id, auto_id, auto_cliente_id;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, open({
                    filename: "./db_autos",
                    driver: sqlite3.Database,
                })];
            case 1:
                db = _b.sent();
                _a = req.body, cliente = _a.cliente, auto = _a.auto, trabajo = _a.trabajo, km = _a.km, fecha = _a.fecha, patente = _a.patente;
                if (typeof km === "string") {
                    km = parseInt(km);
                }
                if (km < 0) {
                    res.sendStatus(400);
                    db.close();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db.run("INSERT OR IGNORE INTO Cliente (cliente) VALUES (?)", [cliente])];
            case 2:
                _b.sent();
                return [4 /*yield*/, db.run("INSERT OR IGNORE INTO Auto (modelo) VALUES (?)", [auto])];
            case 3:
                _b.sent();
                return [4 /*yield*/, db.get("SELECT id FROM Cliente WHERE cliente = ?", [
                        cliente,
                    ])];
            case 4:
                cliente_id = (_b.sent()).id;
                return [4 /*yield*/, db.get("SELECT id FROM Auto WHERE modelo = ?", [auto])];
            case 5:
                auto_id = (_b.sent()).id;
                return [4 /*yield*/, db.run("INSERT OR IGNORE INTO Auto_Cliente (cliente_id, auto_id, patente) VALUES (?,?,?)", [
                        cliente_id,
                        auto_id,
                        patente,
                    ])];
            case 6:
                _b.sent();
                return [4 /*yield*/, db.get("SELECT id FROM Auto_Cliente WHERE cliente_id = ? AND auto_id = ? AND patente = ?", [cliente_id, auto_id, patente])];
            case 7:
                auto_cliente_id = (_b.sent()).id;
                return [4 /*yield*/, db.run("INSERT OR IGNORE INTO Reparacion (auto_cliente_id, trabajo, kilometraje, fecha) VALUES (?, ?, ?, ?)", [auto_cliente_id, trabajo, km, fecha])];
            case 8:
                _b.sent();
                db.close();
                return [2 /*return*/];
        }
    });
}); };
module.exports = controller;
