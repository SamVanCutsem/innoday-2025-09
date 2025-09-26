import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Innovation Day 2025-09
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Welcome to your Next.js 15 project with shadcn/ui. Built with modern React patterns,
            TypeScript, and Tailwind CSS.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                Next.js 15
              </CardTitle>
              <CardDescription>
                Built with the latest Next.js App Router and React Server Components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Featuring App Router, Server Components, and modern React patterns for optimal performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                shadcn/ui
              </CardTitle>
              <CardDescription>
                Beautiful components built on Radix UI and Tailwind CSS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Accessible, customizable components with consistent design patterns.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                TypeScript
              </CardTitle>
              <CardDescription>
                Type-safe development with modern TypeScript features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Enhanced developer experience with full type safety and IntelliSense.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </main>
  )
}