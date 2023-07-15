import { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import { HStack, Heading, Icon, VStack, Text, Image, Box, ScrollView, useToast } from "native-base"
import { Feather } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"

import BodySvg from "@assets/body.svg"
import SeriesSvg from "@assets/series.svg"
import RepetitionsSvg from "@assets/repetitions.svg"

import { AppError } from "@utils/AppError"
import { api } from "@services/api"

import { Button } from "@components/Button"

import { AppNavigatorRoutesProps } from "@routes/app.routes"

import { ExerciseDTO } from "@dtos/ExerciseDTO"
import { Loading } from "@components/Loading"

type RoutesParamsProps = {
  exerciseId: string
}

export function Exercise() {
  const [sendingRegister, setSendingRegister] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()

  const route = useRoute()

  const { exerciseId } = route.params as RoutesParamsProps

  function handleGoBack() {
    navigation.goBack()
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)

      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes exercícios.'
    
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true)

      await api.post("/history", { exercise_id: exerciseId })

      toast.show({
        title: 'Parabéns! Exercício registrado no seu histórico.',
        placement: 'top',
        bgColor: 'green.700'
      })

      navigation.navigate('history')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício.'
    
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setSendingRegister(false)
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
  },[exerciseId])

  return (
    <VStack flex={1}>
      <VStack bg="gray.600" px={8} pt={12}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleGoBack}
          >
          <Icon 
            as={Feather}
            name="arrow-left"
            color="green.500"
            size={6}
            />
        </TouchableOpacity>

        <HStack
          mt={4}
          mb={8}
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading fontFamily="heading" color="gray.100" fontSize="lg" flexShrink={1}>
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />

            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (<Loading />) : (
        <ScrollView>
          <VStack p={8}>
            <Box rounded="lg" mb={3} overflow="hidden">
              <Image 
                source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}
                alt="Image do exercício"
                resizeMode="cover"
                w="full"
                h={80}
              />
            </Box>

            <Box bg="gray.600" rounded="md" pb={4} px={4}>
              <HStack mt={5} mb={6} alignItems="center" justifyContent="space-around"> 
                <HStack>
                  <SeriesSvg />
                  <Text color="gray.200" ml="2">
                    {exercise.series} séries
                  </Text>
                </HStack>

                <HStack>
                  <RepetitionsSvg />
                  <Text color="gray.200" ml="2">
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button 
                title="Marcar como realizado" 
                onPress={handleExerciseHistoryRegister}
                isLoading={sendingRegister}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  )
}
