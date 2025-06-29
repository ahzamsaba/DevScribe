import { account } from "./appwriteConfig";
import { ID } from "appwrite";

export const authService = {
    async createAccount({email, password, name}) {
        await account.create(ID.unique(), email, password, name)
        return this.login({email,password});
    },

    async login({email, password}) {
        return await account.createEmailPasswordSession(email,password)
    },

    async getCurrentUser() {
        try {
            return await account.get()
        } catch (error) {
            return null
        }
    },
    
    async logout() {
        return await account.deleteSession('current')
    }
}