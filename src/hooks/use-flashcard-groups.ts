"use client"

import { useState, useEffect, useCallback } from "react"
import type { FlashcardGroup } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { generateId } from "@/lib/utils"

interface StoredFlashcard {
  id: string;
  groupId: string;
}

export function useFlashcardGroups() {
  const [groups, setGroups] = useState<FlashcardGroup[]>([])
  const { toast } = useToast()

  const loadGroups = useCallback(() => {
    const stored = localStorage.getItem("flashcard-groups")
    if (stored) {
      setGroups(JSON.parse(stored))
    } else {
      setGroups([]) // Initialize with empty array if no groups exist
    }
  }, [])

  useEffect(() => {
    loadGroups()
  }, [loadGroups])

  const createGroup = (name: string, description?: string) => {
    const newGroup: FlashcardGroup = {
      id: generateId(),
      name,
      description,
      createdAt: Date.now(),
    }

    // Get current groups from localStorage to ensure we have the latest state
    const currentGroups = JSON.parse(localStorage.getItem("flashcard-groups") || "[]")
    const updatedGroups = [...currentGroups, newGroup]
    
    setGroups(updatedGroups)
    localStorage.setItem("flashcard-groups", JSON.stringify(updatedGroups))
    window.dispatchEvent(new Event('group-update'))
    
    toast({
      title: "Success",
      description: "Group created successfully!",
    })

    return newGroup
  }

  const updateGroup = (id: string, updates: Partial<FlashcardGroup>) => {
    const currentGroups = JSON.parse(localStorage.getItem("flashcard-groups") || "[]")
    const updatedGroups = currentGroups.map((group: FlashcardGroup) => 
      group.id === id ? { ...group, ...updates } : group
    )
    
    setGroups(updatedGroups)
    localStorage.setItem("flashcard-groups", JSON.stringify(updatedGroups))
    window.dispatchEvent(new Event('group-update'))
    
    toast({
      title: "Success",
      description: "Group updated successfully!",
    })
  }

  const deleteGroup = (id: string) => {
    const currentGroups = JSON.parse(localStorage.getItem("flashcard-groups") || "[]")
    const updatedGroups = currentGroups.filter((group: FlashcardGroup) => group.id !== id)
    
    setGroups(updatedGroups)
    localStorage.setItem("flashcard-groups", JSON.stringify(updatedGroups))

    // Also delete all flashcards in this group
    const flashcards = JSON.parse(localStorage.getItem("flashcards") || "[]") as StoredFlashcard[]
    const updatedFlashcards = flashcards.filter(card => card.groupId !== id)
    localStorage.setItem("flashcards", JSON.stringify(updatedFlashcards))
    
    window.dispatchEvent(new Event('group-update'))
    window.dispatchEvent(new Event('flashcard-update'))

    toast({
      title: "Success",
      description: "Group deleted successfully!",
    })
  }

  return {
    groups,
    createGroup,
    updateGroup,
    deleteGroup,
    loadGroups,
  }
} 