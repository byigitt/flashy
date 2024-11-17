"use client"

import { useState, useEffect, useCallback } from "react"
import type { Flashcard } from "@/types"
import { useToast } from "@/hooks/use-toast"

export function useFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const { toast } = useToast()

  const loadFlashcards = useCallback(() => {
    const stored = localStorage.getItem("flashcards")
    if (stored) {
      setFlashcards(JSON.parse(stored))
    } else {
      setFlashcards([]) // Initialize with empty array if no flashcards exist
    }
  }, [])

  useEffect(() => {
    loadFlashcards()
  }, [loadFlashcards])

  const addFlashcard = useCallback((flashcard: Flashcard) => {
    // Get current flashcards from localStorage to ensure we have the latest state
    const currentFlashcards = JSON.parse(localStorage.getItem("flashcards") || "[]")
    const newFlashcards = [...currentFlashcards, flashcard]
    
    setFlashcards(newFlashcards)
    localStorage.setItem("flashcards", JSON.stringify(newFlashcards))
    window.dispatchEvent(new Event('flashcard-update'))
  }, [])

  const updateFlashcard = useCallback((id: string, updates: Partial<Flashcard>) => {
    // Get current flashcards from localStorage to ensure we have the latest state
    const currentFlashcards = JSON.parse(localStorage.getItem("flashcards") || "[]")
    const newFlashcards = currentFlashcards.map((card: Flashcard) => 
      card.id === id ? { ...card, ...updates } : card
    )
    
    setFlashcards(newFlashcards)
    localStorage.setItem("flashcards", JSON.stringify(newFlashcards))
    window.dispatchEvent(new Event('flashcard-update'))
    
    toast({
      title: "Success",
      description: "Flashcard updated successfully!",
    })
  }, [toast])

  const deleteFlashcard = useCallback((id: string) => {
    // Get current flashcards from localStorage to ensure we have the latest state
    const currentFlashcards = JSON.parse(localStorage.getItem("flashcards") || "[]")
    const newFlashcards = currentFlashcards.filter((card: Flashcard) => card.id !== id)
    
    setFlashcards(newFlashcards)
    localStorage.setItem("flashcards", JSON.stringify(newFlashcards))
    window.dispatchEvent(new Event('flashcard-update'))
    
    toast({
      title: "Success",
      description: "Flashcard deleted successfully!",
    })
  }, [toast])

  return {
    flashcards,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    loadFlashcards,
  }
} 