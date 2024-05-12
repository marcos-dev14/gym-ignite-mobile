import axios, { AxiosInstance } from "axios"

import { AppError } from "@utils/AppError"

type SignOut = () => void

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void
}

const api = axios.create({
  baseURL: 'http://192.168.0.108:3333'
}) as APIInstanceProps

api.registerInterceptTokenManager = signOut => {
  const interceptTokenManager = api.interceptors.response.use(response => response, error => {
    // Verificando se é uma mensagem de erro tratada pelo servidor
    if(error.response && error.response.data) {
      return Promise.reject(new AppError(error.response.data.message))
    } else {
      return Promise.reject(error)
    }
  })

  return () => {
    api.interceptors.response.eject(interceptTokenManager)
  }
}



export { api }