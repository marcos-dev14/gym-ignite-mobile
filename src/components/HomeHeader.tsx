import { TouchableOpacity } from "react-native"
import { Heading, HStack, VStack, Text, Icon } from "native-base"
import { MaterialIcons } from "@expo/vector-icons"
 
import { UserPhoto } from "./UserPhoto"

export function HomeHeader() {
  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <UserPhoto 
        source={{ uri: 'https://github.com/marcos-dev14.png' }}
        alt="Imagem do usuário"
        size={16}
        mr={4}
      />

      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">Olá,</Text>
        <Heading fontFamily="heading" color="gray.100" fontSize="md">Marcos Paulo</Heading>
      </VStack>

      <TouchableOpacity activeOpacity={0.7}>
        <Icon 
          as={MaterialIcons}
          name="logout"
          color="gray.200"
          size={7}
        />
      </TouchableOpacity>
    </HStack>
  )
}