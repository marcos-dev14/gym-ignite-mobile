import { useState } from "react"
import { Heading, VStack, SectionList, Text } from "native-base"

import { HistoryCard } from "@components/HistoryCard"
import { ScreenHeader } from "@components/ScreenHeader"

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: '11.06.23',
      data: ['Puxada frontal', 'Remada unilateral']
    },
    {
      title: '12.06.23',
      data: ['Remada unilateral']
    }
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />

      <SectionList 
        sections={exercises}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <HistoryCard />
        )}
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3}>
            {section.title}
          </Heading>
        )}
        showsVerticalScrollIndicator={false}
        px={8}
        contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não tem nenhum exercícios registrado!{'\n'}
            Vamos fazer exercícios hoje?
          </Text>
        )}
      />
    </VStack>
  )
}