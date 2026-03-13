import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2, Play } from "lucide-react";

const HeroSection = () => {
  const features = [
    "Professional templates",
    "Quick & Easy to use",
    "Export to PDF & DOCX",
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Elements - reversed: sky-aqua, blue-energy, electric-sapphire, indigo-bloom, neon-pink */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full gradient-hero opacity-30" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-aqua-400/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-bloom-400/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-true-azure-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-raspberry-plum-400/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ultrasonic-blue-500/20 border border-ultrasonic-blue-400/50 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-ultrasonic-blue-600" />
              <span className="text-sm font-medium text-ultrasonic-blue-600">
                Professional Resume Builder
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Create a resume that
              <span className="text-gradient block mt-2">gets you hired</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Build professional resumes in under 10 minutes. 
              Transform your experience into compelling bullet points 
              that land interviews.
            </p>

            {/* Features List */}
            <ul className="flex flex-wrap gap-4 mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {features.map((feature, index) => {
                const colors = ["text-sky-aqua-500", "text-indigo-bloom-500", "text-neon-pink-500"];
                return (
                  <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className={`w-5 h-5 ${colors[index]}`} />
                    <span>{feature}</span>
                  </li>
                );
              })}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link to="/signup">
                <Button variant="hero" size="xl">
                  Start Building Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="hero-outline" size="xl">
                  <Play className="w-5 h-5" />
                  View Templates
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-10 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[
                    "from-sky-aqua-400 to-blue-energy-400",
                    "from-electric-sapphire-400 to-bright-indigo-400",
                    "from-vivid-royal-400 to-true-azure-400",
                    "from-ultrasonic-blue-400 to-indigo-bloom-400",
                    "from-raspberry-plum-400 to-neon-pink-400",
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br ${gradient}`}
                    />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-foreground">10,000+ Students</p>
                  <p className="text-sm text-muted-foreground">Building resumes with MakeMe</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Resume Preview */}
          <div className="relative lg:pl-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              {/* Main Resume Card */}
              <div className="bg-card rounded-2xl shadow-xl border border-border p-6 md:p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center pb-4 border-b border-border">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-true-azure-400 to-neon-pink-400" />
                    <h3 className="font-display font-bold text-xl text-foreground">Joe Rothbart</h3>
                    <p className="text-sm text-muted-foreground">Software Engineer</p>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="font-semibold text-sm text-bright-indigo-500 mb-2">Summary</h4>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded-full w-full" />
                      <div className="h-3 bg-muted rounded-full w-4/5" />
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h4 className="font-semibold text-sm text-vivid-royal-500 mb-2">Experience</h4>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-indigo-bloom-900/50">
                        <div className="h-3 bg-indigo-bloom-400/30 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-indigo-bloom-400/20 rounded w-1/2" />
                      </div>
                      <div className="p-3 rounded-lg bg-raspberry-plum-900/50">
                        <div className="h-3 bg-raspberry-plum-400/30 rounded w-2/3 mb-2" />
                        <div className="h-2 bg-raspberry-plum-400/20 rounded w-1/2" />
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-semibold text-sm text-ultrasonic-blue-500 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { skill: "React", color: "bg-sky-aqua-500/20 text-sky-aqua-700" },
                        { skill: "Python", color: "bg-electric-sapphire-500/20 text-electric-sapphire-700" },
                        { skill: "AWS", color: "bg-neon-pink-500/20 text-neon-pink-700" },
                        { skill: "SQL", color: "bg-true-azure-500/20 text-true-azure-700" },
                      ].map(({ skill, color }) => (
                        <span
                          key={skill}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${color}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-card shadow-lg border border-border animate-float">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-energy-500" />
                  <span className="text-sm font-medium">Professional</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl bg-card shadow-lg border border-border animate-float-delayed">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-neon-pink-500" />
                  <span className="text-sm font-medium">Ready to Download</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;