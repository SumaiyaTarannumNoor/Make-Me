import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";
import { Crown, LayoutTemplate } from "lucide-react";
import {
  TemplateCard,
  PremiumTemplateCard,
  colorSchemes,
  premiumColorSchemes,
  type ColorScheme,
  type PremiumColorScheme,
} from "@/components/landing/TemplateShowcase";

interface TemplateGalleryProps {
  onSelectTemplate?: (colorScheme: string) => void;
}

const TemplateGallery = ({ onSelectTemplate }: TemplateGalleryProps) => {
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
    if (onSelectTemplate) {
      onSelectTemplate(colorScheme);
      return;
    }
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
    <div>
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <LayoutTemplate className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">25 Templates</span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
          Choose a Template
        </h2>
        <p className="text-muted-foreground">
          10 standard and 15 premium professionally designed templates.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
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

      {showStandard && (
        <div className="mb-12">
          {selectedCategory === "all" && (
            <div className="flex items-center gap-3 mb-6">
              <h3 className="font-display text-xl font-bold text-foreground">Standard Templates</h3>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">{allStandard.length}</span>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {allStandard.map((scheme) => (
              <TemplateCard key={scheme} colorScheme={scheme} onUse={() => handleUseTemplate(scheme)} />
            ))}
          </div>
        </div>
      )}

      {showPremium && (
        <div>
          {selectedCategory === "all" && (
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-5 h-5 text-primary" />
              <h3 className="font-display text-xl font-bold text-foreground">Premium Templates</h3>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">{allPremium.length}</span>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {allPremium.map((scheme) => (
              <PremiumTemplateCard key={scheme} colorScheme={scheme} onUse={() => handleUsePremiumTemplate(scheme)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
