import { useState } from "react"
import { VStack, FlatList, HStack, Heading, Text } from "native-base"
import { useNavigation } from "@react-navigation/native"

import { HomeHeader } from "@components/HomeHeader"
import { Group } from "@components/Group"
import { ExerciseCard } from "@components/ExerciseCard"

import { AppNavigatorRoutesProps } from "@routes/app.routes"

export function Home() {
  const [groups, setGroups] = useState(['Costa', 'Ombro', 'Perna', 'Peito', 'Bíceps', 'Tríceps'])
  const [exercise, setExercise] = useState(['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento Terra'])
  const [groupSelected, setGroupSelected] = useState('costa')

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails() {
    navigation.navigate('exercise')
  }

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList 
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group 
            name={item} 
            isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()} 
            onPress={() => setGroupSelected(item)}  
          />
        )}
        horizontal
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
      />

      <VStack flex={1} px={8}>
        <HStack justifyContent="space-between" mb={5}>
          <Heading fontFamily="heading" color="gray.200" fontSize="md">Exercícios</Heading>
          <Text color="gray.200" fontSize="sm">{exercise.length}</Text>
        </HStack>

        <FlatList 
          data={exercise}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <ExerciseCard 
              title={item}
              onPress={handleOpenExerciseDetails}  
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 18 }}
        />
      </VStack>
    </VStack>
  )
}