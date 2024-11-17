"use client"

import { Nav } from "@/components/nav"
import { useFlashcards } from "@/hooks/use-flashcards"
import { useFlashcardGroups } from "@/hooks/use-flashcard-groups"
import { Flashcard } from "@/components/flashcard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Pencil, Plus, Trash2, BookOpen } from "lucide-react"
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
import { Card } from "@/components/ui/card"

export default function GroupPage() {
  const params = useParams()
  const router = useRouter()
  const { flashcards, loadFlashcards } = useFlashcards()
  const { groups, updateGroup, deleteGroup } = useFlashcardGroups()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", description: "" })

  const groupId = typeof params.groupId === "string" ? params.groupId : ""
  const group = groups.find((g) => g.id === groupId)
  const groupFlashcards = flashcards.filter((f) => f.groupId === groupId)

  useEffect(() => {
    const handleFlashcardUpdate = () => {
      loadFlashcards()
    }

    window.addEventListener("flashcard-update", handleFlashcardUpdate)
    return () => {
      window.removeEventListener("flashcard-update", handleFlashcardUpdate)
    }
  }, [loadFlashcards])

  useEffect(() => {
    if (group) {
      setEditForm({
        name: group.name,
        description: group.description || "",
      })
    }
  }, [group])

  if (!group) {
    return null
  }

  const handleEdit = () => {
    updateGroup(groupId, {
      name: editForm.name,
      description: editForm.description,
    })
    setIsEditDialogOpen(false)
  }

  const handleDelete = () => {
    deleteGroup(groupId)
    router.push("/groups")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
              {group.description && (
                <p className="text-muted-foreground">{group.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Group</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this group? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button asChild>
                <Link 
                  href={`/create?groupId=${groupId}`} 
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Flashcard
                </Link>
              </Button>
            </div>
          </div>

          {groupFlashcards.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {groupFlashcards.map((flashcard) => (
                <Flashcard 
                  key={flashcard.id}
                  flashcard={flashcard} 
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 flex flex-col items-center justify-center text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Flashcards Yet</h2>
              <p className="text-muted-foreground mb-4">
                This group doesn&apos;t have any flashcards yet. Create your first flashcard to get started!
              </p>
              <Button asChild>
                <Link 
                  href={`/create?groupId=${groupId}`} 
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Flashcard
                </Link>
              </Button>
            </Card>
          )}
        </div>
      </main>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
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
    </div>
  )
} 