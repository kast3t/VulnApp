import axiosInstance from './axiosInstance'


export const ArticleAPI = {
    async get_all() {
        const { data } = await axiosInstance.get("articles")
        return data
    },

    async get_all_by_category(category) {
        const { data } = await axiosInstance.get("articles", { params: { category } })
        return data
    },

    async get_by_id(article_id) {
        const { data } = await axiosInstance.get(`articles/${article_id}`)
        return data
    },

    async add_comment(article_id, comment) {
        const { data } = await axiosInstance.post(`articles/${article_id}/comment`, comment)
        return data
    },

    async add(articleData) {
        const { data } = await axiosInstance.post("admin/articles", articleData)
        return data
    },

    async edit(article_id, articleData) {
        const { data } = await axiosInstance.put(`admin/articles/${article_id}`, articleData)
        return data
    },

    async delete(article_id) {
        const { data } = await axiosInstance.delete(`admin/articles/${article_id}`)
        return data
    },
}
