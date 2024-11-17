"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import type { Flashcard as FlashcardType } from "@/types"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFlashcards } from "@/hooks/use-flashcards"

interface FlashcardProps {
  flashcard: FlashcardType
  showActions?: boolean
  width?: string
  height?: string
}

export function Flashcard({ 
  flashcard, 
  showActions = true,
  width = "w-full",
  height = "h-[300px]",
}: FlashcardProps) {
  const { updateFlashcard, deleteFlashcard } = useFlashcards()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [editForm, setEditForm] = useState({
    question: flashcard.question,
    answer: flashcard.answer,
  })

  useEffect(() => {
    setEditForm({
      question: flashcard.question,
      answer: flashcard.answer,
    })
  }, [flashcard])

  const handleEdit = () => {
    updateFlashcard(flashcard.id, {
      question: editForm.question,
      answer: editForm.answer,
    })
    setIsEditDialogOpen(false)
    window.dispatchEvent(new Event('flashcard-update'))
  }

  const handleDelete = () => {
    deleteFlashcard(flashcard.id)
    window.dispatchEvent(new Event('flashcard-update'))
  }

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <>
      <div 
        className={`perspective-[1000px] ${width} ${height} cursor-pointer`}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick()
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div 
          className={`relative h-full w-full duration-500 transform-style-3d ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* Front of card (Question) */}
          <Card className="absolute inset-0 p-6 backface-hidden">
            <div className="flex flex-col h-full">
              <div className="flex-1 flex items-center justify-center">
                <p className="text-lg font-medium text-center w-full">{flashcard.question}</p>
              </div>
              {showActions && (
                <div 
                  className="flex justify-end gap-2" 
                  onClick={e => e.stopPropagation()}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Flashcard</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this flashcard? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </Card>

          {/* Back of card (Answer) */}
          <Card className="absolute inset-0 p-6 backface-hidden [transform:rotateY(-180deg)]">
            <div className="flex flex-col h-full">
              <div className="flex-1 flex items-center justify-center">
                <p className="text-lg font-medium text-center w-full">{flashcard.answer}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Flashcard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor={`question-${flashcard.id}`} className="text-sm font-medium">
                Question
              </label>
              <Input
                id={`question-${flashcard.id}`}
                value={editForm.question}
                onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor={`answer-${flashcard.id}`} className="text-sm font-medium">
                Answer
              </label>
              <Textarea
                id={`answer-${flashcard.id}`}
                value={editForm.answer}
                onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 