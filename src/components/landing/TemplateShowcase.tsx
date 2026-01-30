import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";
import { Mail, Phone, MapPin, Linkedin, Globe, User, ArrowRight } from "lucide-react";

const sampleData = {
  fullName: "Sarah Johnson",
  tagline: "A passionate developer who works hard to learn new skills and gain experience.",
  email: "sarah@example.com",
  phone: "+1 234-567-8900",
  location: "New York, USA",
  linkedin: "linkedin.com/in/sarah",
  portfolio: "sarahjohnson.dev",
};

interface TemplateCardProps {
  colorScheme: "coral" | "royal-blue";
  title: string;
  subtitle: string;
  onUse: () => void;
}

const TemplateCard = ({ colorScheme, title, subtitle, onUse }: TemplateCardProps) => {
  const colors = {
    coral: {
      primary: "hsl(16, 100%, 66%)",
      light: "hsl(16, 100%, 94%)",
      headerBg: "hsl(220, 20%, 20%)",
      gradient: "from-coral-400 to-coral-600",
    },
    "royal-blue": {
      primary: "hsl(225, 73%, 57%)",
      light: "hsl(225, 73%, 92%)",
      headerBg: "hsl(220, 20%, 20%)",
      gradient: "from-royal-blue-400 to-royal-blue-600",
    },
  };

  const theme = colors[colorScheme];

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300">
      {/* Mini Resume Preview */}
      <div className="aspect-[3/4] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3" style={{ backgroundColor: theme.headerBg }}>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme.primary }}
            >
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{sampleData.fullName}</h3>
              <p className="text-[8px] text-gray-300 line-clamp-1">{sampleData.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-[7px] text-gray-300">
            <div className="flex items-center gap-1">
              <Mail className="w-2.5 h-2.5" style={{ color: theme.primary }} />
              <span>{sampleData.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-2.5 h-2.5" style={{ color: theme.primary }} />
              <span>{sampleData.phone}</span>
            </div>
          </div>
        </div>

        {/* Two Column Body */}
        <div className="flex h-[calc(100%-80px)]">
          {/* Left Column */}
          <div className="w-[60%] p-3 bg-white">
            <div className="mb-3">
              <h4
                className="text-[8px] font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                Work Experience
              </h4>
              <div className="space-y-1.5">
                <div>
                  <p className="text-[7px] font-semibold text-gray-800">Project Manager (Full-time)</p>
                  <p className="text-[6px] text-gray-500">Tech Corp • 2022 - Present</p>
                </div>
                <div>
                  <p className="text-[7px] font-semibold text-gray-800">Software Engineer (Full-time)</p>
                  <p className="text-[6px] text-gray-500">StartupXYZ • 2020 - 2022</p>
                </div>
              </div>
            </div>
            <div>
              <h4
                className="text-[8px] font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                Education
              </h4>
              <div>
                <p className="text-[7px] font-semibold text-gray-800">Master of Science in CS</p>
                <p className="text-[6px] text-gray-500">University • 2020</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-[40%] p-3" style={{ backgroundColor: theme.light }}>
            <div className="mb-3">
              <h4
                className="text-[8px] font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                Skills
              </h4>
              <div className="flex flex-wrap gap-1">
                {["React", "Node.js", "Python", "AWS", "Docker"].map((skill) => (
                  <span
                    key={skill}
                    className="px-1 py-0.5 rounded text-[6px] bg-white/70 text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4
                className="text-[8px] font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                Projects
              </h4>
              <div className="space-y-1">
                <p className="text-[6px] font-medium text-gray-800">E-commerce Platform</p>
                <p className="text-[6px] font-medium text-gray-800">AI Resume Builder</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info & CTA */}
      <div className="p-4 border-t border-border">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          onClick={onUse}
        >
          Use Template
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

const TemplateShowcase = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createResume } = useResumes();

  const handleUseTemplate = async (colorScheme: "coral" | "royal-blue") => {
    if (!user) {
      navigate("/signup");
      return;
    }

    const resume = await createResume();
    if (resume) {
      navigate(`/builder/${resume.id}?template=${colorScheme}`);
    }
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Professional Resume Templates
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from our ATS-optimized templates with modern layouts featuring work experience, skills, projects, and certifications - all in one page.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <TemplateCard
            colorScheme="coral"
            title="Coral Professional"
            subtitle="Warm & confident design"
            onUse={() => handleUseTemplate("coral")}
          />
          <TemplateCard
            colorScheme="royal-blue"
            title="Royal Blue Classic"
            subtitle="Clean & trustworthy design"
            onUse={() => handleUseTemplate("royal-blue")}
          />
        </div>
      </div>
    </section>
  );
};

export default TemplateShowcase;
