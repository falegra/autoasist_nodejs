var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db } from "../database/connectMysql.js";
const table = "users_local";
const existEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db.exist(table, "email", email);
    }
    catch (error) {
        throw error;
    }
});
const saveUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db.save(table, user);
    }
    catch (error) {
        throw error;
    }
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db.findAll(table);
        return users;
    }
    catch (error) {
        throw error;
    }
});
const getUser = (params, column, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const row = yield db.findByColumn(params, table, column, value);
        return row[0];
    }
    catch (error) {
        throw error;
    }
});
const confirmActivationCode = (activation_code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield db.findByColumn("email, activate", table, "activation_code", activation_code);
        user = user[0];
        if (!user) {
            return [0, ""];
        }
        else if (user.activate === 1) {
            return [1, ""];
        }
        else {
            const activate = 1;
            yield db.update(table, { activate }, "activation_code", activation_code);
            return [2, user.email];
        }
    }
    catch (error) {
        throw error;
    }
});
const verifyActivateAccount = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let activate = yield db.findByColumn("activate", table, "email", email);
        activate = activate[0].activate;
        if (activate === 1) {
            return 1;
        }
        else {
            return 2;
        }
    }
    catch (error) {
        throw error;
    }
});
const updatePassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db.update(table, { password }, "email", email);
    }
    catch (error) {
        throw error;
    }
});
const verifyReferralCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db.exist(table, "referral_code", code);
    }
    catch (error) {
        throw error;
    }
});
const incrementReferral = (code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cant_referrals = yield db.findByColumn("number_of_referrals", table, "referral_code", code);
        cant_referrals = cant_referrals[0].number_of_referrals;
        cant_referrals = cant_referrals + 1;
        const number_of_referrals = cant_referrals;
        yield db.update(table, { number_of_referrals }, "referral_code", code);
        return true;
    }
    catch (error) {
        throw error;
    }
});
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
};
