import { localModel } from "../models/local.model.js";
import { googleModel } from "../models/google.model.js";

export const save_referrals_id = async (user_referral_code: number, referral_code: number) => {
    try {
        let user_id: any
        let id: any

        if(await localModel.verifyReferralCode(user_referral_code)){
            user_id = await localModel.getUser("id", "referral_code", user_referral_code)
        }
        else{
            user_id = await googleModel.getUser("id", "referral_code", user_referral_code)
        }

        user_id = user_id.id

        if(await localModel.verifyReferralCode(referral_code)){
            id = await localModel.getUser("id", "referral_code", referral_code)
        }
        else{
            id = await googleModel.getUser("id", "referral_code", referral_code)
        }

        id = id.id

        const ids: any = {
            user_id,
            referred_user_id: id
        }

        return ids
    } catch (error) {
        throw error
    }
}