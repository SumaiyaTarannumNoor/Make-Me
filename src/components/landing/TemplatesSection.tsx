import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, GraduationCap, Briefcase, User, Award } from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";

const TemplatesSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { templates, loading, getExperienceLevelLabel } = useTemplates();
  const { createResume } = useResumes();

  const getIcon = (level: string) => {
    switch (level) {
      case 'student':
        return GraduationCap;
      case 'fresher':
        return User;
      case 'one_to_three':
      case 'three_to_five':
        return Briefcase;
      default:
        return Award;
    }
  };

  const handleUseTemplate = async (templateId: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }
    
    const resume = await createResume(templateId);
    if (resume) {
      navigate(`/builder/${resume.id}`);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Resume Templates for Every Level
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Choose from our collection of professionally designed templates for 
              students, fresh graduates, and experienced professionals.
            </p>
          </div>
          <Link to="/templates">
            <Button variant="hero-outline">
              View All Templates
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.slice(0, 4).map((template) => {
            const Icon = getIcon(template.experience_level);
            const color = template.layout_config?.color || "from-icy-blue-400 to-sky-blue-500";
            
            return (
              <div
                key={template.id}
                className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
              >
                {/* Template Preview */}
                <div className={`aspect-[3/4] bg-gradient-to-br ${color} p-4`}>
                  <div className="w-full h-full bg-card/90 rounded-lg p-4 shadow-lg">
                    {/* Mini Resume Preview */}
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 mx-auto flex items-center justify-center">
                        <Icon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="h-3 bg-muted rounded w-2/3 mx-auto" />
                      <div className="h-2 bg-muted rounded w-1/2 mx-auto" />
                      <div className="pt-3 space-y-2">
                        <div className="h-2 bg-muted/50 rounded w-full" />
                        <div className="h-2 bg-muted/50 rounded w-5/6" />
                        <div className="h-2 bg-muted/50 rounded w-4/6" />
                      </div>
                      <div className="pt-3 space-y-2">
                        <div className="h-2 bg-muted/50 rounded w-full" />
                        <div className="h-2 bg-muted/50 rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getExperienceLevelLabel(template.experience_level)}
                      </p>
                    </div>
                    {template.experience_level === 'student' && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-baby-pink-600/30 text-baby-pink-200">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-medium">Popular</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TemplatesSection;
