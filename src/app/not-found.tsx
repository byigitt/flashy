import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <div className="container py-8">
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Button asChild>
              <Link href="/" className="flex items-center gap-2">
                Return to Home
              </Link>
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
} 