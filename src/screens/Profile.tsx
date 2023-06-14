import { useState } from "react"
import { TouchableOpacity, Alert } from "react-native"
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { FileInfo } from "expo-file-system"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { ScreenHeader } from "@components/ScreenHeader"
import { UserPhoto } from "@components/UserPhoto"
import { Input } from "@components/Input"
import { Button } from "@components/Button"

const photoSize = 33

type FormDataProps = {
  name: string
  old_password: string
  new_password: string
  password_confirm: string
}

const updateProfileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  old_password: yup
    .string()
    .required('Informe a antiga senha.')
    .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  new_password: yup
    .string()
    .required('Informe a nova senha.')
    .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: yup
    .string()
    .required('Informe a confirmação da senha.')
    .oneOf([yup.ref('new_password')], 'A confirmação da senha não confere')
})

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState('https://github.com/marcos-dev14.png')

  const toast = useToast()

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
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

        setUserPhoto(photoSelected.assets[0].uri)
      }
  
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  function handleUpdateProfile(data: FormDataProps) {
    console.log(data)
  }

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
                source={{ uri: userPhoto }}
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
                errorMessage={errors.name?.message}
                bg="gray.600"
              />
            )}
          />

          <Input 
            bg="gray.600"
            placeholder="E-mail"
            isDisabled
          />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading fontFamily="heading" color="gray.100" fontSize="md" mb={2}>
            Alterar a senha
          </Heading>

          <Controller 
            control={control}
            name="old_password"
            render={({ field: { onChange, value } }) => (
              <Input 
                value={value}
                onChangeText={onChange}
                placeholder="Senha"
                secureTextEntry 
                errorMessage={errors.old_password?.message} 
                bg="gray.600"
              />
            )}
          />

          <Controller 
            control={control}
            name="new_password"
            render={({ field: { onChange, value } }) => (
              <Input 
                value={value}
                onChangeText={onChange}
                placeholder="Senha"
                secureTextEntry 
                errorMessage={errors.new_password?.message} 
                bg="gray.600"
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
                onSubmitEditing={handleSubmit(handleUpdateProfile)}
                returnKeyType="send" 
                errorMessage={errors.password_confirm?.message}
                bg="gray.600"
              />
            )}
          />

          <Button 
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleUpdateProfile)}
          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}