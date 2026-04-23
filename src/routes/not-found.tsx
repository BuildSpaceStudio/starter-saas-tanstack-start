import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/not-found')({
  component: NotFoundRoute,
})

function NotFoundRoute() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.18em] text-primary">404</p>
        <h1 className="font-serif text-5xl">Your page was not found.</h1>
        <p className="text-muted-foreground">
          The starter ships with a fallback route so creators can tailor their
          own recovery flow.
        </p>
        <Button asChild>
          <Link to="/">Back home</Link>
        </Button>
      </div>
    </div>
  )
}
