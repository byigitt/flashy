"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { generateId } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFlashcardGroups } from "@/hooks/use-flashcard-groups"
import { PlusCircle, Trash2, Plus } from "lucide-react"
import { CreateGroupDialog } from "@/components/create-group-dialog"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

const flashcardSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
})

const formSchema = z.object({
  groupId: z.string().min(1, "Group is required"),
  flashcards: z.array(flashcardSchema).min(1, "At least one flashcard is required"),
})

interface CreateFlashcardFormProps {
  defaultGroupId?: string | null;
}

export function CreateFlashcardForm({ defaultGroupId }: CreateFlashcardFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialGroupId = searchParams.get('groupId') || ""
  
  const { toast } = useToast()
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const { groups, loadGroups } = useFlashcardGroups()
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  useEffect(() => {
    const handleGroupUpdate = () => {
      loadGroups()
    }

    window.addEventListener("group-update", handleGroupUpdate)
    return () => {
      window.removeEventListener("group-update", handleGroupUpdate)
    }
  }, [loadGroups])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupId: initialGroupId,
      flashcards: [{ question: "", answer: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "flashcards",
  })

  useEffect(() => {
    if (defaultGroupId) {
      form.setValue('groupId', defaultGroupId);
    }
  }, [defaultGroupId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newFlashcards = values.flashcards.map(card => ({
      id: generateId(),
      question: card.question,
      answer: card.answer,
      createdAt: Date.now(),
      groupId: values.groupId,
    }))

    // Get existing flashcards from localStorage
    const existingFlashcards = JSON.parse(localStorage.getItem("flashcards") || "[]")
    
    // Add new flashcards
    localStorage.setItem(
      "flashcards", 
      JSON.stringify([...existingFlashcards, ...newFlashcards])
    )

    toast({
      title: "Success",
      description: `${newFlashcards.length} flashcard${newFlashcards.length > 1 ? 's' : ''} created successfully!`,
    })

    // Redirect to the group page
    router.push(`/groups/${values.groupId}`)
  }

  const handleGroupCreated = (groupId: string) => {
    form.setValue("groupId", groupId)
    setShowCreateGroup(false)
    loadGroups()
  }

  const handleGroupSelect = (value: string) => {
    if (value === "new") {
      setShowCreateGroup(true)
    } else {
      form.setValue("groupId", value)
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="groupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group</FormLabel>
                <Select onValueChange={handleGroupSelect} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">
                      <div className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Create New Group
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="relative">
                <CardContent className="p-4 pt-6">
                  <div className="absolute -top-3 -left-3 bg-background px-2 py-1 text-sm font-medium">
                    Flashcard {index + 1}
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-3 -right-3"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`flashcards.${index}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your question" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`flashcards.${index}.answer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Answer</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter the answer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ question: "", answer: "" })}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Another Flashcard
            </Button>
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? "Edit" : "Preview"}
              </Button>
              <Button type="submit">Create Flashcards</Button>
            </div>
          </div>
        </form>
      </Form>

      <CreateGroupDialog
        open={showCreateGroup}
        onOpenChange={setShowCreateGroup}
        onGroupCreated={handleGroupCreated}
      />

      {isPreviewMode && (
        <div className="pt-8 space-y-6">
          <h2 className="text-lg font-semibold">Preview</h2>
          {fields.map((field, index) => (
            <Card key={field.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Question {index + 1}:</h3>
                    <p className="mt-1">{form.watch(`flashcards.${index}.question`)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Answer {index + 1}:</h3>
                    <p className="mt-1">{form.watch(`flashcards.${index}.answer`)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 