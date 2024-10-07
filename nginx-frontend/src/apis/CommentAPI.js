import axiosInstance from './axiosInstance'


export const CommentAPI = {
    async edit(comment_id, commentData) {
        const { data } = await axiosInstance.put(`admin/comments/${comment_id}`, commentData)
        return data
    },

    async delete(comment_id) {
        const { data } = await axiosInstance.delete(`admin/comments/${comment_id}`)
        return data
    },
}
