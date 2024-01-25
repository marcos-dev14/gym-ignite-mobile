import { useState } from "react"
import { TouchableOpacity, Alert } from "react-native"
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { FileInfo } from "expo-file-system"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { api } from "@services/api"
import { useAuth } from "@hooks/useAuth"

import userPhotoDefault from "@assets/userPhotoDefault.png"

import { ScreenHeader } from "@components/ScreenHeader"
import { UserPhoto } from "@components/UserPhoto"
import { Input } from "@components/Input"
import { Button } from "@components/Button"
import { AppError } from "@utils/AppError"

const photoSize = 33

type FormDataProps = {
  name: string
  email?: string
  old_password?: string
  new_password: string | null | undefined
  password_confirm: string | null | undefined
}

const updateProfileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  new_password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => !!value ? value : null),
  password_confirm: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('new_password')], 'A confirmação da senha não confere')
    .when('new_password', {
      is: (Field: any) => Field,
      then: (schema) => 
        schema
        .transform((value) => !!value ? value : null)
        .nullable()
        .required('Informe a confirmação da nova senha')
    })
})

export function Profile() {
  const [isLoading, setIsLoading] = useState(false)
  const [photoIsLoading, setPhotoIsLoading] = useState(false)

  const toast = useToast()
  const { user, updateUserProfile } = useAuth()

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(updateProfileSchema)
  })

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })
  
      if (photoSelected.canceled) {
        return
      }
      
      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri) as FileInfo

        const convertPhoto = photoInfo.size / 1024 / 1024 > 5 // convertendo foto de byte para megabyte

        if (photoInfo.size && convertPhoto) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB!',
            placement: 'top',
            bgColor: 'red.500'
          })
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop()
        
        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase().replace(/\s/g, ''),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        await updateUserProfile(userUpdated)


        toast.show({
          title: 'Foto atualizada!',
          placement: 'top',
          bgColor: 'green.500'
        })
      }
  
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsLoading(true)

      // Atualizando o nome do usuário dentro dos dados do usuário
      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data)

      await updateUserProfile(userUpdated)

      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível atualizar os dados, Tente novamente mais tarde.'
    
      toast.show({
        title,
        placement: 'top',
        color: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Pegando o caminhada imagem no backend
  const getUserPhoto = `${api.defaults.baseURL}/avatar/${user.avatar}`

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {
            photoIsLoading ?
              <Skeleton 
                w={photoSize} 
                h={photoSize} 
                rounded="full" 
                startColor="gray.500"
                endColor="gray.400"  
              />
            :
              <UserPhoto 
                source={user.avatar ? { uri: getUserPhoto } : userPhotoDefault}
                alt="Foto do usuário"
                size={photoSize}
              />
          }

          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={handleUserPhotoSelect}
          >
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller 
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input 
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                bg="gray.600"
              />
            )}
          />

          <Controller 
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input 
                placeholder="E-mail"
                isDisabled
                value={value}
                onChangeText={onChange}
                bg="gray.600"
              />
            )}
          />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading fontFamily="heading" color="gray.100" fontSize="md" mb={2}>
            Alterar a senha
          </Heading>

          <Controller 
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input 
                onChangeText={onChange}
                placeholder="Senha antiga"
                secureTextEntry 
                bg="gray.600"
              />
            )}
          />

          <Controller 
            control={control}
            name="new_password"
            render={({ field: { onChange } }) => (
              <Input 
                onChangeText={onChange}
                placeholder="Nova senha"
                secureTextEntry 
                errorMessage={errors.new_password?.message} 
                bg="gray.600"
              />
            )}
          />

          <Controller 
            control={control}
            name="password_confirm"
            render={({ field: { onChange } }) => (
              <Input 
                onChangeText={onChange}
                placeholder="Confirme a nova senha"
                secureTextEntry 
                onSubmitEditing={handleSubmit(handleProfileUpdate)}
                returnKeyType="send" 
                errorMessage={errors.password_confirm?.message}
                bg="gray.600"
              />
            )}
          />

          <Button 
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isLoading}
          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}