import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useTemplates } from "@/hooks/useTemplates";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";
import { Star, Check, LayoutTemplate, GraduationCap, Briefcase, User, Award, Loader2 } from "lucide-react";

const Templates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { templates, loading, getExperienceLevelLabel } = useTemplates();
  const { createResume } = useResumes();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "student", label: "Students" },
    { id: "fresher", label: "Fresh Graduates" },
    { id: "one_to_three", label: "1-3 Years" },
    { id: "three_to_five", label: "3-5 Years" },
  ];

  const getIcon = (level: string) => {
    switch (level) {
      case 'student': return GraduationCap;
      case 'fresher': return User;
      case 'one_to_three':
      case 'three_to_five': return Briefcase;
      default: return Award;
    }
  };

  const handleUseTemplate = async (templateId: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }
    const resume = await createResume(templateId);
    if (resume) navigate(`/builder/${resume.id}`);
  };

  const filteredTemplates = selectedCategory === "all" ? templates : templates.filter((t) => t.experience_level === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-pink-600/30 border border-neon-pink-400/30 mb-6">
              <LayoutTemplate className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Professional</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Professional Resume<span className="text-gradient block">Templates</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose from our collection of professionally designed templates for every experience level.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => {
                const Icon = getIcon(template.experience_level);
                const color = template.layout_config?.color || "from-neon-pink-400 to-sky-aqua-500";
                const features = ['Professional', '1-2 pages', 'Print-ready'];

                return (
                  <div key={template.id} className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300">
                    <div className={`aspect-[3/4] bg-gradient-to-br ${color} p-6 relative`}>
                      <div className="w-full h-full bg-card/95 rounded-xl p-6 shadow-lg">
                        <div className="space-y-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 mx-auto flex items-center justify-center">
                            <Icon className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <div className="text-center space-y-2">
                            <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
                            <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
                          </div>
                          <div className="pt-4 space-y-2">
                            <div className="h-3 bg-muted/50 rounded w-full" />
                            <div className="h-3 bg-muted/50 rounded w-5/6" />
                          </div>
                        </div>
                      </div>
                      {template.experience_level === 'student' && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-card shadow-lg">
                          <Star className="w-4 h-4 text-neon-pink-500 fill-neon-pink-500" />
                          <span className="text-xs font-semibold text-foreground">Popular</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-display font-bold text-xl text-foreground mb-2">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{getExperienceLevelLabel(template.experience_level)}</p>
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {features.map((feature, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                            <Check className="w-3 h-3 text-primary" />{feature}
                          </span>
                        ))}
                      </div>
                      <Button variant="hero" className="w-full" onClick={() => handleUseTemplate(template.id)}>
                        Use This Template
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Templates;
