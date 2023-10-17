export interface UserGoogle {
    id?: number,
    name: string,
    email: string,
    created_at: string,
    updated_at: string,
    deleted_at: string,
    accept: boolean,
    authorization: boolean,
    referral_code: number,
    number_of_referrals: number
}

export interface UserLocal extends UserGoogle {
    password: string,
    activation_code: number,
    activate: boolean
}

export interface dataSendMail {
    to: string,
    subject: string,
    text: string
}