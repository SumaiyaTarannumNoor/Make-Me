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
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-aquamarine-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-royal-violet-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-sky-surge-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-pearl-aqua-500/15 rounded-full blur-3xl" />

        {/* Large translucent fairy bubbles - varied colors at 60% opacity */}
        <div className="absolute top-[8%] left-[12%] w-40 h-40 rounded-full border-2 border-white/40 bg-gradient-to-br from-[#ff70d4] via-[#c77dff] to-[#5cf2ff] opacity-60 shadow-[0_0_70px_25px_#c77dff80,inset_0_0_30px_#ffffff80] animate-bubble-1" />
        <div className="absolute top-[28%] right-[18%] w-32 h-32 rounded-full border-2 border-white/40 bg-gradient-to-br from-[#ff9500] via-[#ff70d4] to-[#fff066] opacity-60 shadow-[0_0_65px_22px_#ff70d480,inset_0_0_28px_#ffffff80] animate-bubble-2" />
        <div className="absolute bottom-[20%] left-[35%] w-56 h-56 rounded-full border-2 border-white/40 bg-gradient-to-br from-[#fff066] via-[#7dffd4] to-[#5cf2ff] opacity-60 shadow-[0_0_80px_30px_#fff06680,inset_0_0_35px_#ffffff80] animate-bubble-3" />
        <div className="absolute top-[55%] left-[8%] w-36 h-36 rounded-full border-2 border-white/40 bg-gradient-to-br from-[#00e5ff] via-[#5cf2ff] to-[#b388ff] opacity-60 shadow-[0_0_70px_25px_#5cf2ff80,inset_0_0_30px_#ffffff80] animate-bubble-4" />
        <div className="absolute top-[15%] right-[32%] w-24 h-24 rounded-full border-2 border-white/40 bg-gradient-to-br from-[#7dffd4] via-[#a8ff60] to-[#fff066] opacity-60 shadow-[0_0_60px_20px_#7dffd480,inset_0_0_25px_#ffffff80] animate-bubble-5" />
        <div className="absolute bottom-[10%] right-[12%] w-60 h-60 rounded-full border-2 border-white/40 bg-gradient-to-br from-[#b388ff] via-[#ff9ee8] to-[#ff5d8f] opacity-60 shadow-[0_0_90px_35px_#b388ff80,inset_0_0_40px_#ffffff80] animate-bubble-6" />
        <div className="absolute top-[42%] right-[3%] w-28 h-28 rounded-full border-2 border-white/40 bg-gradient-to-br from-[#ff9ee8] via-[#ff5d8f] to-[#5cf2ff] opacity-60 shadow-[0_0_60px_22px_#ff9ee880,inset_0_0_28px_#ffffff80] animate-bubble-7" />
        <div className="absolute bottom-[38%] left-[22%] w-44 h-44 rounded-full border-2 border-white/40 bg-gradient-to-br from-[#5cf2ff] via-[#fff066] to-[#ff70d4] opacity-60 shadow-[0_0_75px_28px_#5cf2ff80,inset_0_0_32px_#ffffff80] animate-bubble-8" />
        <div className="absolute top-[68%] right-[40%] w-20 h-20 rounded-full border-2 border-white/40 bg-gradient-to-br from-[#ff5d8f] to-[#ff9500] opacity-60 shadow-[0_0_55px_18px_#ff5d8f80,inset_0_0_22px_#ffffff80] animate-bubble-2" />
        <div className="absolute top-[5%] right-[8%] w-28 h-28 rounded-full border-2 border-white/40 bg-gradient-to-br from-[#a8ff60] via-[#5cf2ff] to-[#c77dff] opacity-60 shadow-[0_0_60px_22px_#a8ff6080,inset_0_0_25px_#ffffff80] animate-bubble-5" />

        {/* Glittery fairy sparkles */}
        <div className="absolute top-[18%] left-[35%] w-2 h-2 rounded-full bg-white shadow-[0_0_15px_4px_#fff066] animate-twinkle-1" />
        <div className="absolute top-[55%] right-[28%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_3px_#ff70d4] animate-twinkle-2" />
        <div className="absolute bottom-[35%] left-[55%] w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_18px_5px_#5cf2ff] animate-twinkle-3" />
        <div className="absolute top-[70%] right-[45%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_3px_#c77dff] animate-twinkle-4" />
        <div className="absolute top-[8%] right-[10%] w-2 h-2 rounded-full bg-white shadow-[0_0_15px_4px_#7dffd4] animate-twinkle-5" />
        <div className="absolute bottom-[10%] left-[8%] w-2 h-2 rounded-full bg-white shadow-[0_0_15px_4px_#ff9ee8] animate-twinkle-6" />
        <div className="absolute top-[40%] left-[60%] w-1 h-1 rounded-full bg-white shadow-[0_0_10px_3px_#fff066] animate-twinkle-2" />
        <div className="absolute bottom-[55%] right-[8%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_3px_#b388ff] animate-twinkle-5" />
        <div className="absolute top-[28%] left-[5%] w-1 h-1 rounded-full bg-white shadow-[0_0_10px_3px_#5cf2ff] animate-twinkle-3" />
        <div className="absolute bottom-[20%] left-[70%] w-2 h-2 rounded-full bg-white shadow-[0_0_15px_4px_#ff70d4] animate-twinkle-1" />


      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-bloom-500/20 border border-indigo-bloom-400/50 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-indigo-bloom-600" />
              <span className="text-sm font-medium text-indigo-bloom-900">
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
                const colors = ["text-aquamarine-500", "text-turquoise-500", "text-pearl-aqua-500"];
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
                    "from-aquamarine-400 to-turquoise-400",
                    "from-turquoise-400 to-pearl-aqua-400",
                    "from-pearl-aqua-400 to-sky-blue-light-400",
                    "from-sky-surge-400 to-fresh-sky-400",
                    "from-cloudy-sky-400 to-slate-blue-400",
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br ${gradient}`}
                    />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-foreground">Students Pack</p>
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
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cloudy-sky-400 to-aquamarine-400" />
                    <h3 className="font-display font-bold text-xl text-foreground">Joe Rothbart</h3>
                    <p className="text-sm text-muted-foreground">Software Engineer</p>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="font-semibold text-sm text-sky-blue-light-500 mb-2">Summary</h4>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded-full w-full" />
                      <div className="h-3 bg-muted rounded-full w-4/5" />
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h4 className="font-semibold text-sm text-fresh-sky-500 mb-2">Experience</h4>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-royal-violet-500/10">
                        <div className="h-3 bg-royal-violet-500/20 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-royal-violet-500/15 rounded w-1/2" />
                      </div>
                      <div className="p-3 rounded-lg bg-indigo-bloom-500/10">
                        <div className="h-3 bg-indigo-bloom-500/20 rounded w-2/3 mb-2" />
                        <div className="h-2 bg-indigo-bloom-500/15 rounded w-1/2" />
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-semibold text-sm text-cloudy-sky-500 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { skill: "React", color: "bg-aquamarine-500/20 text-aquamarine-500" },
                        { skill: "Python", color: "bg-turquoise-500/20 text-turquoise-500" },
                        { skill: "AWS", color: "bg-pearl-aqua-500/20 text-pearl-aqua-500" },
                        { skill: "SQL", color: "bg-sky-surge-500/20 text-sky-surge-500" },
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
                  <Sparkles className="w-4 h-4 text-turquoise-500" />
                  <span className="text-sm font-medium">Professional</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl bg-card shadow-lg border border-border animate-float-delayed">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aquamarine-500" />
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
