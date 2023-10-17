import mysql from "mysql2"

var connection: any = null

const initConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB,
    insecureAuth: true
});

const getConnection = async () => {
    if(!connection) connection = initConnection
    return connection
}

const query = async (sql: string, params: string | JSON) => {
    try {
        
        let conn = await getConnection();

        if(params){
            const [rows, _fields] = await conn.promise().query(sql, params);
            return rows;
        }
        else {
            const [rows, _fields] = await conn.promise().query(sql);
            return rows;
        }

    } catch (error) {
        throw error
    }
}

const findAll = async (table: string) => {
    try {
        return await query(`SELECT * FROM ${table}`, ``)
    } catch (error) {
        throw error
    }
}

const findByColumn = async (params: string = "*", table: string, column: string, value: string | number) => {
    try {
        return await query(`SELECT ${params} FROM ${table} WHERE ${column} = '${value}'`, ``);
    } catch (error) {
        throw error
    }
}

const save = async (table: string, data: any) => {
    try {
        const row = await query(`INSERT INTO ${table} SET ?`, data);
        return row.affectedRows > 0
    } catch (error) {
        throw error
    }
}

const exist = async (table: string, column: string, value: string | number) => {
    try {

        const rows = await query(`SELECT * FROM ${table} WHERE ${column} = '${value}'`, ``);
        return rows.length > 0
        
    } catch (error) {
        throw error
    }
}

const update = async (table: string, updateFiels: any, column: string, value: string | number) => {
    try {
        const row = await query(`UPDATE ${table} SET ? WHERE ${column} = '${value}'`, updateFiels)
        return row.affectedRows > 0
    } catch (error) {
        throw error
    }
}

const removeOneField = async (table: string, column: string, value: string | number) => {
    try {
        const rows = await query(`DELETE FROM ${table} WHERE ${column} = ${value}`, ``);
        return rows.affectedRows > 0;
    } catch(error){
        throw error;
    }
}

export const db = {
    query,
    findAll,
    findByColumn,
    save,
    exist,
    update,
    removeOneField
}