import axios from "axios"

import { AppError } from "@utils/AppError"

const api = axios.create({
  baseURL: 'http://192.168.0.108:3333'
})

api.interceptors.response.use(response => response, error => {
  // Verificando se é uma mensagem de erro tratada pelo servidor
  if(error.response && error.response.data) {
    return Promise.reject(new AppError(error.response.data.message))
  } else {
    return Promise.reject(error)
  }
})

export { api }