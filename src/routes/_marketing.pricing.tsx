import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getBrowserClient } from '@/lib/buildspace/client'
import { trackClient } from '@/lib/events-client'

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    description: 'For early validation and your first handful of customers.',
    points: ['Core product access', 'Standard dashboards', 'Community support'],
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For growing teams that need speed and clearer reporting.',
    points: [
      'Everything in Starter',
      'Advanced reporting',
      'Priority email support',
    ],
    featured: true,
  },
  {
    name: 'Scale',
    price: '$199',
    description: 'For organizations with compliance and rollout needs.',
    points: [
      'Everything in Pro',
      'Dedicated success contact',
      'Custom onboarding',
    ],
  },
]

export const Route = createFileRoute('/_marketing/pricing')({
  head: () => ({
    meta: [
      { title: 'Pricing | Your Product' },
      {
        name: 'description',
        content:
          'Illustrative pricing tiers you can replace with your real plans.',
      },
    ],
  }),
  component: PricingPage,
})

function PricingPage() {
  function beginSignUp(plan: string) {
    trackClient('billing:upgrade-clicked', { plan })
    const redirectUri = `${window.location.origin}/auth/callback`
    window.location.href = getBrowserClient().auth.getSignUpUrl({ redirectUri })
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Pricing
        </p>
        <h1 className="mt-4 font-serif text-5xl">
          Plans that read well until billing goes live.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          These numbers and bullets are samples—update them when you connect
          your payment provider and packaging.
        </p>
      </div>
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            className={
              tier.featured ? 'border-primary shadow-lg shadow-primary/10' : ''
            }
            key={tier.name}
          >
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{tier.name}</p>
                <p className="text-5xl font-semibold">{tier.price}</p>
                <p className="text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {tier.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={() => beginSignUp(tier.name.toLowerCase())}
                variant={tier.featured ? 'default' : 'outline'}
              >
                Choose {tier.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
