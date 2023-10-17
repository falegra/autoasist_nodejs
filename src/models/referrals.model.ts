import { db } from "../database/connectMysql.js"

const table: string = "referrals"

const saveIds = async (ids: any) => {
    try {
        return await db.save(table, ids)
    } catch (error) {
        throw error
    }
}

export const referralsModel = {
    saveIds
}