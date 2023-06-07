import { useState } from "react"
import { VStack, FlatList, HStack, Heading, Text } from "native-base"

import { HomeHeader } from "@components/HomeHeader"
import { Group } from "@components/Group"
import { ExerciseCard } from "@components/ExerciseCard"

export function Home() {
  const [groups, setGroups] = useState(['Costa', 'Ombro', 'Perna', 'Peito', 'Bíceps', 'Tríceps'])
  const [exercise, setExercise] = useState(['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento Terra'])
  const [groupSelected, setGroupSelected] = useState('costa')

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
      />

      <VStack flex={1} px={8}>
        <HStack justifyContent="space-between" mb={5}>
          <Heading color="gray.200" fontSize="md">Exercícios</Heading>
          <Text color="gray.200" fontSize="sm">{exercise.length}</Text>
        </HStack>

        <FlatList 
          data={exercise}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <ExerciseCard title={item} />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 18 }}
        />
      </VStack>
    </VStack>
  )
}