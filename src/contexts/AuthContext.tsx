import { ReactNode, createContext, useState, useEffect } from "react"

import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken"
import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser"

import { api } from "@services/api"
import { UserDTO } from "@dtos/UserDTO"

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  updateUserProfile: (userUpdate: UserDTO) => Promise<void>;
  signOut: () => Promise<void>
  isLoading: boolean
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoading, setIsLoading] = useState(true)

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    // Anexando as informações no cabeçalho da requisições
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    setUser(userData)
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
    try {
      setIsLoading(true)

      await storageUserSave(userData)
      await storageAuthTokenSave({token, refresh_token})
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password })
    
      if (data.user && data.token && data.refresh_token) {
        setIsLoading(true)
        await storageUserAndTokenSave(data.user, data.token, data.refresh_token)
        userAndTokenUpdate(data.user, data.token)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated)
      await storageUserSave(userUpdated)

    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setIsLoading(true)

      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()

    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function loadUserData() {
    try {
      setIsLoading(true)

      const userLogged = await storageUserGet()
      const { token } = await storageAuthTokenGet()

      if (userLogged && token) {
        userAndTokenUpdate(userLogged, token)
      }
      
    } catch (error) {
      throw error      
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut)

    return () => {
      subscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      signOut,
      updateUserProfile,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}