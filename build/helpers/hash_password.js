var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcryptjs from "bcryptjs";
const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = bcryptjs.genSaltSync();
    const hash_password = bcryptjs.hashSync(password, salt);
    return hash_password;
});
const comparePassword = (password, hash_password) => __awaiter(void 0, void 0, void 0, function* () {
    const valid = bcryptjs.compareSync(password, hash_password);
    return valid;
});
export const encryptManager = {
    encryptPassword,
    comparePassword
};
