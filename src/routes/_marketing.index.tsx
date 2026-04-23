import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  BarChart3,
  Bell,
  CreditCard,
  Lock,
  Sparkles,
  Users,
  Zap,
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
    title: 'Get productive faster',
    description:
      'Onboarding, dashboards, and settings are laid out so your team can start work without a blank screen.',
    icon: Zap,
  },
  {
    title: 'Insights at a glance',
    description:
      'Surface the metrics your customers care about—revenue, usage, or health scores—in a layout you can extend.',
    icon: BarChart3,
  },
  {
    title: 'Built for teams',
    description:
      'Roles, invitations, and an admin area give you a credible story for how your product scales past the first user.',
    icon: Users,
  },
  {
    title: 'Security-minded defaults',
    description:
      'Sign-in stays on a hosted flow, sessions are handled for you, and protected routes stay server-checked.',
    icon: Lock,
  },
  {
    title: 'Stay in touch with customers',
    description:
      'Transactional messages and preference toggles are wired so account emails feel intentional, not improvised.',
    icon: Bell,
  },
  {
    title: 'Pricing that looks real',
    description:
      'Marketing and in-app pricing sections use believable copy and tiers you can swap when billing is ready.',
    icon: CreditCard,
  },
]

const faqs = [
  {
    question: 'Can we change the copy and layout?',
    answer:
      'Yes. Treat every section as a starting point—headlines, features, FAQs, and pricing are meant to be replaced with your product story.',
  },
  {
    question: 'Where does sign-in happen?',
    answer:
      'Users complete sign-in on a secure hosted flow, then land back in your app with a normal session—no custom password forms to maintain here.',
  },
  {
    question: 'Is billing included?',
    answer:
      'No. Tiers and prices are illustrative so you can plug in Stripe, Paddle, or another provider when you are ready.',
  },
  {
    question: 'How do we deploy?',
    answer:
      'The app builds to a standard Node server bundle, so most PaaS hosts that run Node work without special casing.',
  },
]

export const Route = createFileRoute('/_marketing/')({
  head: () => ({
    meta: [
      { title: 'Your Product | Starter SaaS' },
      {
        name: 'description',
        content:
          'Launch-ready marketing site, customer dashboard, and admin tools—customize the story and ship.',
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
              For teams shipping a credible v1
            </Badge>
            <div className="space-y-6">
              <h1 className="max-w-3xl font-serif text-5xl leading-none sm:text-6xl lg:text-7xl">
                The headline for your product belongs here—everything around it
                is ready to customize.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                A polished marketing site, customer home, settings, and
                super-admin tools—so your next sprint goes to product
                differentiation, not scaffolding.
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
                  <p className="text-sm text-slate-400">This week (sample)</p>
                  <p className="text-2xl font-semibold">$24.8k revenue</p>
                </div>
                <Sparkles className="h-8 w-8 text-sky-300" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">New customers</p>
                  <p className="mt-2 text-3xl font-semibold">+186</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Active trials</p>
                  <p className="mt-2 text-3xl font-semibold">412</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">NPS (demo)</p>
                  <p className="mt-2 text-3xl font-semibold">54</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Churn</p>
                  <p className="mt-2 text-3xl font-semibold">1.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4 rounded-[2rem] border border-border/70 bg-card/60 p-6 text-sm text-muted-foreground sm:grid-cols-4">
          <p>99.9% uptime (illustrative)</p>
          <p>Teams in 40+ countries (sample)</p>
          <p>Average setup under an hour</p>
          <p>Human support on Pro and Scale</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16" id="features">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Features
          </p>
          <h2 className="font-serif text-4xl">
            Everything you need for a serious first release.
          </h2>
          <p className="text-muted-foreground">
            These blocks read like a real product—not a framework demo—so
            stakeholders see a credible surface on day one.
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
                Social proof
              </p>
              <blockquote className="font-serif text-3xl leading-tight">
                “We went from a blank repo to a presentable beta in days—the
                structure was already there; we only had to tell our story.”
              </blockquote>
              <p className="text-sm text-muted-foreground">
                Placeholder quote. Drop in a customer logo or testimonial before
                you go live.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-border/70 bg-background/80 p-6">
              <p className="text-sm text-muted-foreground">
                What teams finish first
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Marketing + pricing pages</span>
                  <span className="font-semibold">Included</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Authenticated app shell</span>
                  <span className="font-semibold">Included</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Admin and user management</span>
                  <span className="font-semibold">Included</span>
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
              Simple tiers your leads can understand.
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
              points: ['Up to 3 seats', 'Core dashboards', 'Email support'],
            },
            {
              name: 'Pro',
              price: '$49',
              points: [
                'Unlimited seats',
                'Advanced reporting',
                'Priority support',
              ],
            },
            {
              name: 'Scale',
              price: '$199',
              points: [
                'Dedicated success manager',
                'SLA options',
                'Custom contracts',
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
            Questions buyers ask before they try the product.
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
                Ready when you are
              </p>
              <h2 className="font-serif text-4xl">
                Put your roadmap on top of a complete customer experience.
              </h2>
              <p className="text-muted-foreground">
                Swap in your brand, connect your data, and keep the flows that
                already feel production-grade.
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
