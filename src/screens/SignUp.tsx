import { useNavigation } from "@react-navigation/native"
import { 
  VStack, 
  Image, 
  Center, 
  Text,
  Heading,
  ScrollView,
  useToast
} from "native-base"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";

import { api } from "@services/api"
import { AppError } from "@utils/AppError";

import BackgroundImg from "@assets/background.png"
import LogoSvg from "@assets/logo.svg"

import { Input } from "@components/Input"
import { Button } from "@components/Button"

import { AuthNavigatorRoutesProps } from "@routes/auth.routes"

type FormDataProps = {
  name: string
  email: string
  password: string
  password_confirm: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: yup
    .string()
    .required('Informe a confirmação da senha.')
    .oneOf([yup.ref('password')], 'A confirmação da senha não confere')
})

export function SignUp() {

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  })

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleGoBack() {
    navigation.goBack()
  }

  const toast = useToast()

  async function signUp({ name, email, password }: FormDataProps) {
    try {
      const response = await api.post('/users', {
        name,
        email,
        password
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error?.message : 'Não foi possível criar a conta. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
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

        <Center my={16}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading fontFamily="heading" color="gray.100" fontSize="xl" mb={6}>
            Crie sua conta
          </Heading>

          <Controller 
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input 
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller 
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input 
                value={value}
                onChangeText={onChange}
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller 
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input 
                value={value}
                onChangeText={onChange}
                placeholder="Senha"
                secureTextEntry 
                errorMessage={errors.password?.message} 
              />
            )}
          />

          <Controller 
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input 
                value={value}
                onChangeText={onChange}
                placeholder="Senha"
                secureTextEntry 
                onSubmitEditing={handleSubmit(signUp)}
                returnKeyType="send" 
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button 
            title="Criar conta"
            onPress={handleSubmit(signUp)}
          />
        </Center>

        <Center mt={16}>
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