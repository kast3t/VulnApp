import axiosInstance from './axiosInstance'


export const UserAPI = {
    async get_all() {
        const { data } = await axiosInstance.get("admin/users")
        return data
    },

    async get_by_id(user_id) {
        const { data } = await axiosInstance.get(`admin/users/${user_id}`)
        return data
    },

    async add(userData) {
        const { data } = await axiosInstance.post("admin/users", userData)
        return data
    },

    async edit(user_id, userData) {
        const { data } = await axiosInstance.put(`admin/users/${user_id}`, userData)
        return data
    },

    async delete(user_id) {
        const { data } = await axiosInstance.delete(`admin/users/${user_id}`)
        return data
    },
}
