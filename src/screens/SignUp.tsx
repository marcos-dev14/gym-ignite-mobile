import { useNavigation } from "@react-navigation/native"
import { 
  VStack, 
  Image, 
  Center, 
  Text,
  Heading,
  ScrollView
} from "native-base"

import BackgroundImg from "@assets/background.png"
import LogoSvg from "@assets/logo.svg"

import { Input } from "@components/Input"
import { Button } from "@components/Button"

import { AuthNavigatorRoutesProps } from "@routes/auth.routes"

export function SignUp() {

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Image 
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading fontFamily="heading" color="gray.100" fontSize="xl" mb={6}>
            Crie sua conta
          </Heading>

          <Input 
            placeholder="Nome"
          />

          <Input 
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input 
            placeholder="Senha"
            secureTextEntry  
          />
          {/* <Input 
            placeholder="Confirme a senha"
            secureTextEntry  
          /> */}

          <Button title="Criar conta" />
        </Center>

        <Center mt={24}>
          <Button 
            title="Voltar para o login" 
            variant="outline"
            onPress={handleGoBack}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}