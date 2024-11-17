"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFlashcardGroups } from "@/hooks/use-flashcard-groups"
import { useState } from "react"

interface CreateGroupDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onGroupCreated?: (groupId: string) => void
}

export function CreateGroupDialog({ 
  open, 
  onOpenChange,
  onGroupCreated 
}: CreateGroupDialogProps) {
  const { createGroup } = useFlashcardGroups()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const controlled = open !== undefined

  const handleCreate = () => {
    if (name.trim()) {
      const newGroup = createGroup(name, description)
      setName("")
      setDescription("")
      if (onGroupCreated) {
        onGroupCreated(newGroup.id)
      }
      if (onOpenChange) {
        onOpenChange(false)
      }
    }
  }

  const dialogProps = controlled
    ? { open, onOpenChange }
    : {}

  return (
    <Dialog {...dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Flashcard Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="group-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="group-name"
              placeholder="Enter group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="group-description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Textarea
              id="group-description"
              placeholder="Enter group description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleCreate}>Create Group</Button>
      </DialogContent>
    </Dialog>
  )
} 