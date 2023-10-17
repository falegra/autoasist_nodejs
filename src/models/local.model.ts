import { db } from "../database/connectMysql.js";
import { UserLocal } from "../types.js";

const table: string = "users_local"

const existEmail = async (email: string): Promise<boolean> => {
    try {
        return await db.exist(table, "email", email)
    } catch (error) {
        throw error
    }
}

const saveUser = async (user: UserLocal): Promise<boolean> => {
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

const confirmActivationCode = async (activation_code: number) => {
    try {
        let user: any = await db.findByColumn("email, activate", table, "activation_code", activation_code)
        user = user[0]

        if(!user){
            return [0, ""]
        }
        else if(user.activate === 1){
            return [1, ""]
        }
        else{
            const activate: number = 1
            await db.update(table, {activate}, "activation_code", activation_code)
            return [2, user.email]
        }
    } catch (error) {
        throw error
    }
}

 const verifyActivateAccount = async (email: string) => {
    try {
        let activate: any = await db.findByColumn("activate", table, "email", email)
        activate = activate[0].activate
        if(activate === 1){
            return 1
        }
        else{
            return 2
        }
    } catch (error) {
        throw error
    }
 }

 const updatePassword = async (email: string, password: string): Promise<boolean> => {
    try {
        return await db.update(table, {password}, "email", email)
    } catch (error) {
        throw error
    }
 }

 const verifyReferralCode = async (code: number): Promise<boolean> => {
    try {
        return await db.exist(table, "referral_code", code)
    } catch (error) {
        throw error
    }
 }

 const incrementReferral = async (code: number): Promise<boolean> => {
    try {
        let cant_referrals: any = await db.findByColumn("number_of_referrals", table, "referral_code", code)

        cant_referrals = cant_referrals[0].number_of_referrals
        cant_referrals = cant_referrals + 1

        const number_of_referrals: number = cant_referrals

        await db.update(table, {number_of_referrals}, "referral_code", code)

        return true
    } catch (error) {
        throw error
    }
 }

export const localModel = {
    existEmail,
    saveUser,
    getAllUsers,
    getUser,
    confirmActivationCode,
    verifyActivateAccount,
    updatePassword,
    verifyReferralCode,
    incrementReferral
}