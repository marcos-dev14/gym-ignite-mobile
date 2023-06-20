import { useTheme, Box } from "native-base"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"

import { useAuth } from "@hooks/useAuth"
import { Loading } from "@components/Loading"

import { AuthRoutes } from "./auth.routes"
import { AppRoutes } from "./app.routes"

export function Routes() {
  const { user, isLoading } = useAuth()

  const { colors } = useTheme()

  const theme = DefaultTheme
  theme.colors.background = colors.gray[700]

  if (isLoading) { 
    return <Loading />
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}