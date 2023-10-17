import bcryptjs from "bcryptjs"

const encryptPassword = async (password: string) => {
    const salt = bcryptjs.genSaltSync()
    const hash_password = bcryptjs.hashSync(password, salt)

    return hash_password
}

const comparePassword = async (password: string, hash_password: string) => {
    const valid = bcryptjs.compareSync(password, hash_password)

    return valid
}

export const encryptManager = {
    encryptPassword,
    comparePassword
}