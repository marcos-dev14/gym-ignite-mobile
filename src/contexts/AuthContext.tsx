import { ReactNode, createContext, useState, useEffect } from "react"

import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser"

import { api } from "@services/api"
import { UserDTO } from "@dtos/UserDTO"

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
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

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password })
    
      if (data.user) {
        setUser(data.user)
        storageUserSave(data.user)
      }
    } catch (error) {
      throw error
    }
  }

  async function signOut() {
    try {
      setIsLoading(true)

      setUser({} as UserDTO)
      await storageUserRemove()

    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet()

      if (userLogged) {
        setUser(userLogged)
        setIsLoading(false)
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

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      signOut,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}