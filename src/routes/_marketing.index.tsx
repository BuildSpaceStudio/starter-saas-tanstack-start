import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  BarChart3,
  Bell,
  CreditCard,
  Lock,
  Radar,
  Sparkles,
  Users,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getBrowserClient } from '@/lib/buildspace/client'

const features = [
  {
    title: 'Hosted auth in minutes',
    description:
      'Redirect into Buildspace auth, come back with a secure session cookie, and keep route protection server-trusted.',
    icon: Lock,
  },
  {
    title: 'Dashboard-ready data layer',
    description:
      'Drizzle and libSQL are wired for creators who want a familiar schema-and-query flow without the setup tax.',
    icon: BarChart3,
  },
  {
    title: 'Admin controls included',
    description:
      'The first user becomes super admin, so founders can inspect users and prove out role-gated routes immediately.',
    icon: Users,
  },
  {
    title: 'Product analytics hooks',
    description:
      'Core lifecycle events are already modeled so you can start tracking activity from day one.',
    icon: Radar,
  },
  {
    title: 'Built-in notifications',
    description:
      'Welcome messages, admin invites, and account lifecycle helpers all flow through Buildspace notifications.',
    icon: Bell,
  },
  {
    title: 'Pricing and conversion polish',
    description:
      'A premium-looking marketing shell keeps your first launch from feeling like a raw starter repo.',
    icon: CreditCard,
  },
]

const faqs = [
  {
    question: 'Can I change every section and route later?',
    answer:
      'Yes. The starter is intentionally thin in business logic and heavy on structure, so founders can swap copy, visuals, schema, and product flows quickly.',
  },
  {
    question: 'Does this starter create custom auth forms?',
    answer:
      'No. Auth stays on the hosted Buildspace flow so you keep secure callbacks, session handling, and less auth surface area to maintain.',
  },
  {
    question: 'Is billing wired out of the box?',
    answer:
      'No. Pricing is placeholder-only so you can layer in your billing provider without undoing starter-specific assumptions.',
  },
  {
    question: 'Can I deploy this as a normal Node app?',
    answer:
      'Yes. The TanStack Start build outputs a standard Node server under `.output/server/index.mjs` that fits Railway cleanly.',
  },
]

export const Route = createFileRoute('/_marketing/')({
  head: () => ({
    meta: [
      { title: 'Your Product | Starter SaaS' },
      {
        name: 'description',
        content:
          'Placeholder marketing shell for a Buildspace-powered SaaS starter built on TanStack Start.',
      },
    ],
  }),
  component: MarketingHome,
})

function MarketingHome() {
  function beginAuth(mode: 'sign-in' | 'sign-up') {
    const redirectUri = `${window.location.origin}/auth/callback`
    const client = getBrowserClient()

    window.location.href =
      mode === 'sign-in'
        ? client.auth.getSignInUrl({ redirectUri })
        : client.auth.getSignUpUrl({ redirectUri })
  }

  return (
    <div>
      <section className="surface-grid relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_60%)]" />
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-24 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-8">
            <Badge className="rounded-full px-4 py-1.5" variant="outline">
              Built for fast-moving founders
            </Badge>
            <div className="space-y-6">
              <h1 className="max-w-3xl font-serif text-5xl leading-none sm:text-6xl lg:text-7xl">
                Your SaaS headline goes here, but the product structure is
                already done.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Ship a polished marketing site, hosted auth flow, query-driven
                dashboard, admin surface, and transactional email baseline
                without wiring the platform glue yourself.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => beginAuth('sign-up')} size="lg">
                Start free <ArrowRight className="h-4 w-4" />
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/pricing">See pricing</a>
              </Button>
            </div>
          </div>
          <Card className="glass-panel max-w-xl border-white/10 bg-slate-950 text-slate-100">
            <CardContent className="space-y-6 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Launch kit</p>
                  <p className="text-2xl font-semibold">Ready on day one</p>
                </div>
                <Sparkles className="h-8 w-8 text-sky-300" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Auth callback</p>
                  <p className="mt-2 text-3xl font-semibold">Hosted</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">App shell</p>
                  <p className="mt-2 text-3xl font-semibold">Query-first</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Admin role</p>
                  <p className="mt-2 text-3xl font-semibold">Built-in</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Deploy shape</p>
                  <p className="mt-2 text-3xl font-semibold">Node-ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4 rounded-[2rem] border border-border/70 bg-card/60 p-6 text-sm text-muted-foreground sm:grid-cols-4">
          <p>TanStack Start</p>
          <p>Buildspace auth + notifications</p>
          <p>Drizzle + libSQL</p>
          <p>shadcn/ui + Tailwind</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16" id="features">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Features
          </p>
          <h2 className="font-serif text-4xl">
            A serious starter, not a router demo.
          </h2>
          <p className="text-muted-foreground">
            The starter focuses on founder-shaped product surfaces so your first
            week goes into product decisions, not framework glue.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <Card key={feature.title}>
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <Card className="overflow-hidden border-primary/10 bg-primary/[0.04]">
          <CardContent className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Testimonial
              </p>
              <blockquote className="font-serif text-3xl leading-tight">
                “We replaced a weekend of auth, admin, and dashboard setup with
                an afternoon of customizing copy and product ideas.”
              </blockquote>
              <p className="text-sm text-muted-foreground">
                Placeholder founder quote. Replace with your own customer proof
                before launch.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-border/70 bg-background/80 p-6">
              <p className="text-sm text-muted-foreground">
                What this saves you
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Hosted auth + callback routes</span>
                  <span className="font-semibold">Done</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Drizzle schema + migrations</span>
                  <span className="font-semibold">Done</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Admin shell + role guards</span>
                  <span className="font-semibold">Done</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Pricing preview
            </p>
            <h2 className="font-serif text-4xl">
              Placeholder tiers that still feel launch-ready.
            </h2>
          </div>
          <Button asChild variant="ghost">
            <a href="/pricing">View full pricing</a>
          </Button>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            {
              name: 'Starter',
              price: '$0',
              points: ['Hosted auth', 'Dashboard shell', 'Email helpers'],
            },
            {
              name: 'Pro',
              price: '$49',
              points: [
                'Priority support',
                'Advanced analytics',
                'Admin workflows',
              ],
            },
            {
              name: 'Scale',
              price: '$199',
              points: [
                'SLA placeholder',
                'Dedicated onboarding',
                'Custom integrations',
              ],
            },
          ].map((tier) => (
            <Card
              className={
                tier.name === 'Pro'
                  ? 'border-primary shadow-lg shadow-primary/10'
                  : ''
              }
              key={tier.name}
            >
              <CardContent className="space-y-6 p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{tier.name}</p>
                  <p className="mt-3 text-4xl font-semibold">{tier.price}</p>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {tier.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={() => beginAuth('sign-up')}
                  variant={tier.name === 'Pro' ? 'default' : 'outline'}
                >
                  Choose {tier.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16" id="faq">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            FAQ
          </p>
          <h2 className="mt-3 font-serif text-4xl">
            A few practical questions founders usually ask.
          </h2>
        </div>
        <Accordion className="space-y-4" collapsible type="single">
          {faqs.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(37,99,235,0.12),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]">
          <CardContent className="flex flex-col gap-8 p-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Final CTA
              </p>
              <h2 className="font-serif text-4xl">
                Put your product idea on top of a complete SaaS skeleton.
              </h2>
              <p className="text-muted-foreground">
                Replace the placeholder story, wire your real schema, and keep
                the platform plumbing you would rather not rebuild.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => beginAuth('sign-up')} size="lg">
                Get started
              </Button>
              <Button
                onClick={() => beginAuth('sign-in')}
                size="lg"
                variant="outline"
              >
                Sign in
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
