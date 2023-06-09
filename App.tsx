import { StatusBar } from 'react-native';
import { NativeBaseProvider, Text } from "native-base"
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto"

import { AuthContextProvider } from "@contexts/AuthContext"

import { Loading } from '@components/Loading';
import { Routes } from './src/routes';

import { theme } from './src/theme';

export default function App() {
  const [fontLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        {fontLoaded ? <Routes/> : <Loading /> }
      </AuthContextProvider>

    </NativeBaseProvider>
  );
}

