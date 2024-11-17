"use client"

import { Nav } from "@/components/nav"
import { Flashcard } from "@/components/flashcard"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import type { Flashcard as FlashcardType } from "@/types"
import { Card } from "@/components/ui/card"
import { useFlashcardGroups } from "@/hooks/use-flashcard-groups"
import { useFlashcards } from "@/hooks/use-flashcards"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookOpen, Plus, Shuffle } from "lucide-react"
import Link from "next/link"

export default function StudyPage() {
  const { groups } = useFlashcardGroups()
  const { flashcards, loadFlashcards } = useFlashcards()
  const [selectedGroupId, setSelectedGroupId] = useState<string>("all")
  const [studyCards, setStudyCards] = useState<FlashcardType[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    const handleFlashcardUpdate = () => {
      loadFlashcards()
      const updatedCards = selectedGroupId === "all" 
        ? flashcards 
        : flashcards.filter(card => card.groupId === selectedGroupId)
      setStudyCards(prev => {
        const newCards = [...prev]
        newCards[currentIndex] = updatedCards.find(card => card.id === prev[currentIndex].id) || prev[currentIndex]
        return newCards
      })
    }

    window.addEventListener("flashcard-update", handleFlashcardUpdate)
    return () => {
      window.removeEventListener("flashcard-update", handleFlashcardUpdate)
    }
  }, [loadFlashcards, selectedGroupId, currentIndex, flashcards])

  useEffect(() => {
    const filtered = selectedGroupId === "all" 
      ? flashcards 
      : flashcards.filter(card => card.groupId === selectedGroupId)
    setStudyCards(shuffleArray([...filtered]))
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [selectedGroupId, flashcards])

  const shuffleArray = (array: FlashcardType[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const handleShuffle = () => {
    setStudyCards(prev => shuffleArray([...prev]))
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const handleNext = () => {
    if (currentIndex < studyCards.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsFlipped(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      handleNext()
    } else if (e.key === 'ArrowLeft') {
      handlePrevious()
    } else if (e.key === ' ') {
      e.preventDefault()
      setIsFlipped(!isFlipped)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isFlipped, studyCards.length])

  if (flashcards.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">
          <div className="container py-8">
            <Card className="p-12 flex flex-col items-center justify-center text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Flashcards to Study</h2>
              <p className="text-muted-foreground mb-4">
                You haven&apos;t created any flashcards yet. Create some flashcards to start studying!
              </p>
              <Button asChild>
                <Link href="/create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Flashcard
                </Link>
              </Button>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8 flex justify-between items-center">
            <Select
              value={selectedGroupId}
              onValueChange={setSelectedGroupId}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleShuffle}
              className="flex items-center gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Shuffle Cards
            </Button>
          </div>

          {studyCards.length > 0 ? (
            <div className="max-w-2xl mx-auto">
              <Flashcard 
                flashcard={studyCards[currentIndex]} 
                showActions={true}
                height="h-[400px]"
              />
              <div className="flex justify-between mt-6 items-center">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  Previous
                </Button>
                <div className="text-center">
                  <span className="text-muted-foreground text-sm">
                    {currentIndex + 1} of {studyCards.length}
                  </span>
                </div>
                <Button
                  onClick={handleNext}
                  disabled={currentIndex === studyCards.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <Card className="p-12 flex flex-col items-center justify-center text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Flashcards in This Group</h2>
              <p className="text-muted-foreground mb-4">
                There are no flashcards in the selected group. Select a different group or create new flashcards.
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
} 