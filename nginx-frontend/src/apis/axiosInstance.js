import axios from "axios"
import { AuthAPI } from "./AuthAPI"


// Если не удаётся поправить файл hosts на хостовой машине, необходимо "baseURL" заменить на "http://localhost/api"
const axiosInstance = axios.create({
  baseURL: "http://vulnapp.lan/api",
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  (response) => { return response },
  async (error) => {
    const originalRequest = error.config

    try {
      // Ошибка 401, когда токен протух
      if (error.response && error.response.status === 401 && error.response.data.msg === "Token has expired") {
        await AuthAPI.refresh_token()
        return await axios(originalRequest)
      }

      // Иначе получаем объект ошибки, основываясь на ответе (< 500 или 5XX)
      const returnErr = await get_error_object(error)
      return Promise.reject(returnErr)
    }

    // На случай, когда первый запрос получил ошибку из-за протухшего AT, а второй запрос опять вернул какую-либо ошибку
    // Возможны и другие сценарии
    catch (error) {
      const returnErr = await get_error_object(error)
      return Promise.reject(returnErr)
    }
  }
)

const get_error_object = async (error) => {
  // Если полученный объект error ранее был обработан этой функцией, возвращаем уже готовый объект error
  if (error.final_msg) return error

  const returnErr = {
    code: "",
    name: "",
    msg_from_API: "",
    final_msg: "",
  }

  // Ошибки < 500
  if (error.response) {
    returnErr.code = error.response.status
    returnErr.name = error.response.statusText
    returnErr.msg_from_API = error.response.data.msg ? error.response.data.msg : ""

    if (returnErr.msg_from_API) {
      returnErr.final_msg = `Ошибка ${returnErr.code}: ${returnErr.name}. ${returnErr.msg_from_API}`
    } else {
      returnErr.final_msg = `Ошибка ${returnErr.code}: ${returnErr.name}`
    }
  }

  // Все 5xx ошибки (почему-то конкретный код ошибки узнать нельзя)
  else {
    returnErr.code = "5XX"
    returnErr.name = error.message
    returnErr.msg_from_API = "Подробнее в DevTools"

    returnErr.final_msg = `Ошибка ${returnErr.code}: ${returnErr.name}. ${returnErr.msg_from_API}`
  }

  return returnErr
}

export default axiosInstance
