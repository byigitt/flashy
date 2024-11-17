"use client"

import { Nav } from "@/components/nav"
import { CreateFlashcardForm } from "@/components/create-flashcard-form"
import { useSearchParams } from "next/navigation"

export default function CreatePage() {
  const searchParams = useSearchParams()
  const groupId = searchParams.get('groupId')

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-8 text-center text-3xl font-bold">Create Flashcard</h1>
            <CreateFlashcardForm defaultGroupId={groupId as string | null} />
          </div>
        </div>
      </main>
    </div>
  )
} 