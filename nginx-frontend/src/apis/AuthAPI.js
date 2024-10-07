import axiosInstance from './axiosInstance'


export const AuthAPI = {
    async register(userData) {
        const { data } = await axiosInstance.post("register", userData)
        return data
    },

    async login(userData) {
        const { data } = await axiosInstance.post("login", userData)
        return data
    },

    async get_account() {
        const { data } = await axiosInstance.get("account")
        return data
    },

    async update_account(values) {
        const { data } = await axiosInstance.get("account/update", { params: values })
        return data
    },

    async refresh_token() {
        const { data } = await axiosInstance.post("account/refresh-token")
        return data
    },

    async logout() {
        const { data } = await axiosInstance.get("logout")
        return data
    },
}
