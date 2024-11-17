"use client"

import { Nav } from "@/components/nav"
import { useFlashcards } from "@/hooks/use-flashcards"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
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

export default function ManagePage() {
  const { flashcards, updateFlashcard, deleteFlashcard } = useFlashcards()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCard, setEditingCard] = useState<{
    id: string
    question: string
    answer: string
  } | null>(null)

  const filteredFlashcards = flashcards.filter(card => 
    card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUpdate = () => {
    if (editingCard) {
      updateFlashcard(editingCard.id, {
        question: editingCard.question,
        answer: editingCard.answer,
      })
      setEditingCard(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold">Manage Flashcards</h1>
            <Input
              placeholder="Search flashcards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFlashcards.map((card) => (
              <Card key={card.id} className="relative">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Question:</h3>
                      <p className="mt-1">{card.question}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Answer:</h3>
                      <p className="mt-1">{card.answer}</p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setEditingCard({
                              id: card.id,
                              question: card.question,
                              answer: card.answer,
                            })}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Flashcard</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label htmlFor={`question-${card.id}`} className="text-sm font-medium">
                                Question
                              </label>
                              <Input
                                id={`question-${card.id}`}
                                value={editingCard?.question}
                                onChange={(e) => setEditingCard(prev => 
                                  prev ? { ...prev, question: e.target.value } : null
                                )}
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor={`answer-${card.id}`} className="text-sm font-medium">
                                Answer
                              </label>
                              <Textarea
                                id={`answer-${card.id}`}
                                value={editingCard?.answer}
                                onChange={(e) => setEditingCard(prev => 
                                  prev ? { ...prev, answer: e.target.value } : null
                                )}
                              />
                            </div>
                          </div>
                          <Button onClick={handleUpdate}>Save Changes</Button>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
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
                            <AlertDialogAction onClick={() => deleteFlashcard(card.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 