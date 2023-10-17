var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mysql from "mysql2";
var connection = null;
const initConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB,
    insecureAuth: true
});
const getConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!connection)
        connection = initConnection;
    return connection;
});
const query = (sql, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conn = yield getConnection();
        if (params) {
            const [rows, _fields] = yield conn.promise().query(sql, params);
            return rows;
        }
        else {
            const [rows, _fields] = yield conn.promise().query(sql);
            return rows;
        }
    }
    catch (error) {
        throw error;
    }
});
const findAll = (table) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield query(`SELECT * FROM ${table}`, ``);
    }
    catch (error) {
        throw error;
    }
});
const findByColumn = (params = "*", table, column, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield query(`SELECT ${params} FROM ${table} WHERE ${column} = '${value}'`, ``);
    }
    catch (error) {
        throw error;
    }
});
const save = (table, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const row = yield query(`INSERT INTO ${table} SET ?`, data);
        return row.affectedRows > 0;
    }
    catch (error) {
        throw error;
    }
});
const exist = (table, column, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield query(`SELECT * FROM ${table} WHERE ${column} = '${value}'`, ``);
        return rows.length > 0;
    }
    catch (error) {
        throw error;
    }
});
const update = (table, updateFiels, column, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const row = yield query(`UPDATE ${table} SET ? WHERE ${column} = '${value}'`, updateFiels);
        return row.affectedRows > 0;
    }
    catch (error) {
        throw error;
    }
});
const removeOneField = (table, column, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield query(`DELETE FROM ${table} WHERE ${column} = ${value}`, ``);
        return rows.affectedRows > 0;
    }
    catch (error) {
        throw error;
    }
});
export const db = {
    query,
    findAll,
    findByColumn,
    save,
    exist,
    update,
    removeOneField
};
