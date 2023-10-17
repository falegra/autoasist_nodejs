import { db } from "../database/connectMysql.js"
import { UserGoogle } from "../types.js"

const table: string = "users_google"

const existEmail = async (email: string): Promise<Boolean> => {
    try {
        return await db.exist(table, "email", email)
    } catch (error) {
        throw error
    }
}

const saveUser = async (user: UserGoogle): Promise<Boolean> => {
    try {
        return await db.save(table, user)
    } catch (error) {
        throw error
    }
}

const getAllUsers = async () => {
    try {
        const users = await db.findAll(table)
        return users
    } catch (error) {
        throw error
    }
}

const getUser = async (params: string, column: string, value: string | number) => {
    try {
        const row = await db.findByColumn(params, table, column, value)
        return row[0]
    } catch (error) {
        throw error
    }
}

const verifyReferralCode = async (code: number): Promise<Boolean> => {
    try {
        return await db.exist(table, "referral_code", code)
    } catch (error) {
        throw error
    }
}

const incrementReferral = async (code: number) => {
    try {

        let cant_referrals = await db.findByColumn("number_of_referrals", table, "referral_code", code)

        cant_referrals = cant_referrals[0].number_of_referrals
        cant_referrals = cant_referrals + 1

        await db.update(table, {number_of_referrals: cant_referrals}, "referral_code", code)

        return true

    } catch (error) {
        throw error
    }
}

export const googleModel = {
    existEmail,
    saveUser,
    getAllUsers,
    getUser,
    verifyReferralCode,
    incrementReferral
}