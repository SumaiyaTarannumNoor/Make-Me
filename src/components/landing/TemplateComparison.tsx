import { Check, X, Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TemplateComparison = () => {
  const features = [
    { label: "Clean two-column layout", standard: true, premium: true },
    { label: "10+ color schemes", standard: true, premium: true },
    { label: "Work experience & education sections", standard: true, premium: true },
    { label: "Skills & projects display", standard: true, premium: true },
    { label: "PDF export", standard: true, premium: true },
    { label: "Gradient accent bars & headers", standard: false, premium: true },
    { label: "Skill progress bars", standard: false, premium: true },
    { label: "Timeline-style experience layout", standard: false, premium: true },
    { label: "Summary / objective section", standard: false, premium: true },
    { label: "Certifications & languages", standard: false, premium: true },
    { label: "Advanced sidebar with dark theme", standard: false, premium: true },
    { label: "15+ exclusive color schemes", standard: false, premium: true },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Standard vs Premium</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Choose the Right Template for <span className="text-gradient">You</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Standard templates get the job done. Premium templates make you stand out.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Standard */}
          <div className="glass rounded-2xl border border-border/50 p-8">
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Standard</h3>
            <p className="text-muted-foreground text-sm mb-6">Professional & clean — perfect for getting started</p>
            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f.label} className="flex items-center gap-3 text-sm">
                  {f.standard ? (
                    <Check className="w-4 h-4 text-aquamarine-500 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                  )}
                  <span className={f.standard ? "text-foreground" : "text-muted-foreground/50"}>{f.label}</span>
                </li>
              ))}
            </ul>
            <Link to="/templates">
              <Button variant="outline" className="w-full">Browse Standard</Button>
            </Link>
          </div>

          {/* Premium */}
          <div className="relative glass rounded-2xl border border-primary/30 p-8 shadow-glow">
            <div className="absolute -top-3 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              <Crown className="w-3.5 h-3.5" />
              RECOMMENDED
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Premium</h3>
            <p className="text-muted-foreground text-sm mb-6">Advanced designs that make your resume unforgettable</p>
            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f.label} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-aquamarine-500 shrink-0" />
                  <span className="text-foreground">{f.label}</span>
                </li>
              ))}
            </ul>
            <Link to="/templates">
              <Button variant="hero" className="w-full">Browse Premium</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemplateComparison;
