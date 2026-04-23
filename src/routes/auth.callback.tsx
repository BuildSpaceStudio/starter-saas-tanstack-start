import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { completeAuthCallback } from '@/lib/mutations/auth'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallbackPage,
})

function AuthCallbackPage() {
  const mutation = useMutation({
    mutationFn: completeAuthCallback,
    onSuccess: ({ redirectTo }) => {
      window.location.href = redirectTo
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const { mutate } = mutation

  useEffect(() => {
    mutate({
      data: {
        requestUrl: window.location.href,
      },
    })
  }, [mutate])

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LoaderCircle className="h-6 w-6 animate-spin" />
        </div>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.18em] text-primary">
            Finalizing sign-in
          </p>
          <h1 className="font-serif text-4xl">
            We’re setting up your workspace.
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Your hosted Buildspace session is being exchanged for a secure local
            cookie and starter user record.
          </p>
        </div>
      </div>
    </div>
  )
}
