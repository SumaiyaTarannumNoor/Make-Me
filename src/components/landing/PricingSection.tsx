import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "৳0",
      period: "forever",
      description: "Perfect for trying out MakeMe",
      features: [
        "1 resume",
        "3 AI rewrites/month",
        "Basic templates",
        "PDF export with watermark",
        "Email support",
      ],
      cta: "Start Free",
      variant: "hero-outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "৳499",
      period: "per month",
      description: "Best for active job seekers",
      features: [
        "Unlimited resumes",
        "Unlimited AI rewrites",
        "All premium templates",
        "PDF & DOCX export",
        "No watermark",
        "Version history",
        "Shareable links",
        "Priority support",
      ],
      cta: "Go Pro",
      variant: "hero" as const,
      popular: true,
    },
    {
      name: "Lifetime",
      price: "৳2,999",
      period: "one-time",
      description: "Pay once, use forever",
      features: [
        "Everything in Pro",
        "Lifetime access",
        "Early access to new features",
        "Custom branding",
        "API access",
        "Dedicated support",
      ],
      cta: "Get Lifetime",
      variant: "purple" as const,
      popular: false,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-icy-blue-400/10 via-pastel-petal-400/10 to-thistle-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-thistle-600/30 border border-thistle-400/30 mb-6">
            <Zap className="w-4 h-4 text-thistle-300" />
            <span className="text-sm font-medium text-thistle-100">Simple Pricing</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Choose your path to
            <span className="text-gradient block">career success</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free and upgrade when you're ready. All plans include our core features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.popular
                  ? "bg-card border-2 border-primary shadow-xl scale-105"
                  : "bg-card border border-border hover:border-primary/30 hover:shadow-card-hover"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full gradient-button">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                    <span className="text-sm font-semibold text-primary-foreground">Most Popular</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to="/signup">
                <Button variant={plan.variant} className="w-full" size="lg">
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* B2B Note */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Looking for team or enterprise plans?
          </p>
          <Link to="/contact">
            <Button variant="ghost">
              Contact us for B2B pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
