import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Create Your Flashcards
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Create, study, and master any subject with our easy-to-use flashcard generator.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/create">
                Create Your First Flashcard
              </Link>
            </Button>
          </div>
        </section>

        <section className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-4">
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center">
              How it works
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Create</h3>
                <p className="text-muted-foreground">
                  Create your flashcards with questions and answers
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Study</h3>
                <p className="text-muted-foreground">
                  Review your flashcards with our intuitive interface
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Master</h3>
                <p className="text-muted-foreground">
                  Track your progress and master the content
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
