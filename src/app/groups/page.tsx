"use client"

import { Nav } from "@/components/nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFlashcardGroups } from "@/hooks/use-flashcard-groups"
import Link from "next/link"
import { CreateGroupDialog } from "@/components/create-group-dialog"
import { PlusCircle, Pencil, Trash2, FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import type { FlashcardGroup } from "@/types"

function TruncatedText({ text, maxLength = 100 }: { text?: string; maxLength?: number }) {
  if (!text) return null;
  if (text.length <= maxLength) return <p className="text-sm text-muted-foreground">{text}</p>;
  return (
    <p className="text-sm text-muted-foreground">
      {text.slice(0, maxLength)}...
    </p>
  );
}

export default function GroupsPage() {
  const { groups, updateGroup, deleteGroup, loadGroups } = useFlashcardGroups()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<FlashcardGroup | null>(null)
  const [editedGroup, setEditedGroup] = useState<{
    name: string;
    description?: string;
  }>({ name: "", description: "" })

  // Listen for group updates
  useEffect(() => {
    const handleGroupUpdate = () => {
      loadGroups()
    }

    window.addEventListener("group-update", handleGroupUpdate)
    return () => {
      window.removeEventListener("group-update", handleGroupUpdate)
    }
  }, [loadGroups])

  const handleEdit = (group: FlashcardGroup, e: React.MouseEvent) => {
    e.preventDefault()
    setSelectedGroup(group)
    setEditedGroup({
      name: group.name,
      description: group.description,
    })
    setShowEditDialog(true)
  }

  const handleDelete = (group: FlashcardGroup, e: React.MouseEvent) => {
    e.preventDefault()
    setSelectedGroup(group)
    setShowDeleteDialog(true)
  }

  const handleUpdate = () => {
    if (selectedGroup && editedGroup.name.trim()) {
      updateGroup(selectedGroup.id, editedGroup)
      setShowEditDialog(false)
      setSelectedGroup(null)
    }
  }

  const handleConfirmDelete = () => {
    if (selectedGroup) {
      deleteGroup(selectedGroup.id)
      setShowDeleteDialog(false)
      setSelectedGroup(null)
    }
  }

  if (groups.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">
          <div className="container py-8">
            <Card className="p-12 flex flex-col items-center justify-center text-center">
              <FolderPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Groups Yet</h2>
              <p className="text-muted-foreground mb-4">
                Create your first group to start organizing your flashcards!
              </p>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setShowCreateDialog(true)}
              >
                <PlusCircle className="h-4 w-4" />
                Create Your First Group
              </Button>
            </Card>
          </div>
        </main>
        <CreateGroupDialog 
          open={showCreateDialog} 
          onOpenChange={setShowCreateDialog}
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Flashcard Groups</h1>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Link key={group.id} href={`/groups/${group.id}`}>
                <Card className="hover:bg-muted/50 transition-colors group relative h-[200px]">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{group.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TruncatedText text={group.description} maxLength={100} />
                  </CardContent>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => handleEdit(group, e)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => handleDelete(group, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}

            <Card 
              className="hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center h-[200px]"
              onClick={() => setShowCreateDialog(true)}
            >
              <PlusCircle className="h-8 w-8 mb-2" />
              <p className="text-lg font-medium">Add New Group</p>
            </Card>
          </div>
        </div>
      </main>

      <CreateGroupDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="edit-name"
                value={editedGroup.name}
                onChange={(e) => setEditedGroup(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="edit-description"
                value={editedGroup.description}
                onChange={(e) => setEditedGroup(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={handleUpdate}>Save Changes</Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this group? All flashcards in this group will also be deleted.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 