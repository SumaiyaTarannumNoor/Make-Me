import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";
import { LayoutTemplate, Crown } from "lucide-react";
import {
  TemplateCard,
  PremiumTemplateCard,
  colorSchemes,
  premiumColorSchemes,
  type ColorScheme,
  type PremiumColorScheme,
} from "@/components/landing/TemplateShowcase";

const Templates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createResume } = useResumes();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "standard", label: "Standard" },
    { id: "premium", label: "Premium" },
  ];

  const handleUseTemplate = async (colorScheme: string) => {
    if (!user) {
      navigate("/signup");
      return;
    }
    const resume = await createResume();
    if (resume) navigate(`/builder/${resume.id}?template=${colorScheme}`);
  };

  const handleUsePremiumTemplate = async (colorScheme: string) => {
    if (!user) {
      navigate("/signup");
      return;
    }
    const resume = await createResume();
    if (resume) navigate(`/builder/${resume.id}?template=${colorScheme}`);
  };

  const allStandard = Object.keys(colorSchemes) as ColorScheme[];
  const allPremium = Object.keys(premiumColorSchemes) as PremiumColorScheme[];

  const showStandard = selectedCategory === "all" || selectedCategory === "standard";
  const showPremium = selectedCategory === "all" || selectedCategory === "premium";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <LayoutTemplate className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">25 Templates</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Professional Resume<span className="text-gradient block">Templates</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose from 10 standard and 15 premium professionally designed templates with advanced layouts.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {cat.id === "premium" && <Crown className="w-3.5 h-3.5" />}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Standard Templates */}
          {showStandard && (
            <div className="mb-16">
              {selectedCategory === "all" && (
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="font-display text-2xl font-bold text-foreground">Standard Templates</h2>
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">{allStandard.length} templates</span>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                {allStandard.map((scheme) => (
                  <TemplateCard key={scheme} colorScheme={scheme} onUse={() => handleUseTemplate(scheme)} />
                ))}
              </div>
            </div>
          )}

          {/* Premium Templates */}
          {showPremium && (
            <div>
              {selectedCategory === "all" && (
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-2xl font-bold text-foreground">Premium Templates</h2>
                  </div>
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">{allPremium.length} templates</span>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                {allPremium.map((scheme) => (
                  <PremiumTemplateCard key={scheme} colorScheme={scheme} onUse={() => handleUsePremiumTemplate(scheme)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Templates;
