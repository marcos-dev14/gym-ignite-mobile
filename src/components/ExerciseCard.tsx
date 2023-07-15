import { TouchableOpacity, TouchableOpacityProps } from "react-native"
import { Image, HStack, VStack, Heading, Text, Icon } from "native-base"
import { Entypo } from "@expo/vector-icons"

import { api } from "@services/api"

import { ExerciseDTO } from "@dtos/ExerciseDTO"

type ExerciseCardProps = TouchableOpacityProps & {
  data: ExerciseDTO
}

export function ExerciseCard({data, ...rest}: ExerciseCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      {...rest}
    >
      <HStack bg="gray.500" alignItems="center" p={2} pr={4} rounded="md" mb={3}>
        <Image
          source={{ uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}` }}
          alt="Image do exercício"
          w={16}
          h={16}
          rounded="md"
          mr={4}
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontFamily="heading" fontSize="lg" color="white">
            {data.name}
          </Heading>
          <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2} >
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>

        <Icon 
          as={Entypo}
          name="chevron-thin-right"
          color="gray.300"
        />
      </HStack>
    </TouchableOpacity>
  )
}