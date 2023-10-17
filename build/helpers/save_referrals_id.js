var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { localModel } from "../models/local.model.js";
import { googleModel } from "../models/google.model.js";
export const save_referrals_id = (user_referral_code, referral_code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user_id;
        let id;
        if (yield localModel.verifyReferralCode(user_referral_code)) {
            user_id = yield localModel.getUser("id", "referral_code", user_referral_code);
        }
        else {
            user_id = yield googleModel.getUser("id", "referral_code", user_referral_code);
        }
        user_id = user_id.id;
        if (yield localModel.verifyReferralCode(referral_code)) {
            id = yield localModel.getUser("id", "referral_code", referral_code);
        }
        else {
            id = yield googleModel.getUser("id", "referral_code", referral_code);
        }
        id = id.id;
        const ids = {
            user_id,
            referred_user_id: id
        };
        return ids;
    }
    catch (error) {
        throw error;
    }
});
