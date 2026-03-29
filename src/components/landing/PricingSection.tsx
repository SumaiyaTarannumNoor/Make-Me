import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "৳0",
      period: "forever",
      description: "Great for getting started",
      features: [
        "Up to 6 resumes",
        "2-page resumes max",
        "Basic templates",
        "PDF export with watermark",
        "Email support",
      ],
      cta: "Start Free",
      variant: "hero-outline" as const,
      popular: false,
      accentColor: "text-aquamarine-500",
    },
    {
      name: "Pro",
      price: "৳499",
      period: "per month",
      description: "Best for active job seekers",
      features: [
        "Up to 10 resumes",
        "3-page resumes max",
        "All premium templates",
        "PDF & DOCX export",
        "No watermark",
        "Priority support",
      ],
      cta: "Go Pro",
      variant: "hero" as const,
      popular: true,
      accentColor: "text-turquoise-500",
    },
    {
      name: "Yearly",
      price: "৳4,000",
      period: "per year",
      description: "Best value for professionals",
      features: [
        "Up to 20 resumes",
        "All premium templates",
        "PDF & DOCX export",
        "No watermark",
        "Early access to new features",
        "Dedicated support",
      ],
      cta: "Get Yearly",
      variant: "purple" as const,
      popular: false,
      accentColor: "text-pearl-aqua-500",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-slate-blue-500/10 via-cloudy-sky-500/10 to-royal-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fresh-sky-500/20 border border-fresh-sky-500/30 mb-6">
            <Zap className="w-4 h-4 text-fresh-sky-500" />
            <span className="text-sm font-medium text-fresh-sky-700">Simple Pricing</span>
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
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full gradient-button">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                    <span className="text-sm font-semibold text-primary-foreground">Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="font-display font-bold text-xl text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 ${plan.accentColor} mt-0.5 flex-shrink-0`} />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup">
                <Button variant={plan.variant} className="w-full" size="lg">{plan.cta}</Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Looking for team or enterprise plans?</p>
          <Link to="/contact"><Button variant="ghost">Contact us for B2B pricing</Button></Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
