import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";
import { Mail, Phone, User, ArrowRight } from "lucide-react";

const sampleData = {
  fullName: "Sarah Johnson",
  tagline: "A passionate developer who works hard to learn new skills.",
  email: "sarah@example.com",
  phone: "+1 234-567-8900",
};

export type ColorScheme =
  | "coral"
  | "royal-blue"
  | "light-coral"
  | "deep-pink"
  | "dark-orange"
  | "medium-orchid"
  | "teal"
  | "dark-turquoise"
  | "olive-drab"
  | "medium-blue";

export const colorSchemes: Record<ColorScheme, { name: string; primary: string; light: string; headerBg: string }> = {
  coral: { name: "Coral", primary: "#FF7F50", light: "#FFF0EB", headerBg: "#2D3748" },
  "royal-blue": { name: "Royal Blue", primary: "#4169E1", light: "#E8EEFF", headerBg: "#2D3748" },
  "light-coral": { name: "Light Coral", primary: "#F08080", light: "#FDEAEA", headerBg: "#2D3748" },
  "deep-pink": { name: "Deep Pink", primary: "#FF1493", light: "#FFE4F3", headerBg: "#2D3748" },
  "dark-orange": { name: "Dark Orange", primary: "#FF8C00", light: "#FFF3E0", headerBg: "#2D3748" },
  "medium-orchid": { name: "Medium Orchid", primary: "#BA55D3", light: "#F9E8FD", headerBg: "#2D3748" },
  teal: { name: "Teal", primary: "#008080", light: "#E0F7F7", headerBg: "#2D3748" },
  "dark-turquoise": { name: "Dark Turquoise", primary: "#00CED1", light: "#E0FAFA", headerBg: "#2D3748" },
  "olive-drab": { name: "Olive Drab", primary: "#6B8E23", light: "#F0F4E4", headerBg: "#2D3748" },
  "medium-blue": { name: "Medium Blue", primary: "#0000CD", light: "#E8E8FF", headerBg: "#2D3748" },
};

interface TemplateCardProps {
  colorScheme: ColorScheme;
  onUse: () => void;
}

const TemplateCard = ({ colorScheme, onUse }: TemplateCardProps) => {
  const theme = colorSchemes[colorScheme];

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300">
      <div className="aspect-[3/4] overflow-hidden">
        <div className="px-3 py-2" style={{ backgroundColor: theme.headerBg }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">{sampleData.fullName}</h3>
              <p className="text-[6px] text-gray-300 line-clamp-1">{sampleData.tagline}</p>
            </div>
          </div>
          <div className="flex gap-2 text-[6px] text-gray-300">
            <div className="flex items-center gap-0.5">
              <Mail className="w-2 h-2" style={{ color: theme.primary }} />
              <span>{sampleData.email}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Phone className="w-2 h-2" style={{ color: theme.primary }} />
              <span>{sampleData.phone}</span>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100%-60px)]">
          <div className="w-[60%] p-2 bg-white">
            <div className="mb-2">
              <h4 className="text-[6px] font-bold uppercase mb-1 pb-0.5 border-b" style={{ color: theme.primary, borderColor: theme.primary }}>
                Work Experience
              </h4>
              <div className="space-y-1">
                <div>
                  <p className="text-[6px] font-semibold text-gray-800">Project Manager</p>
                  <p className="text-[5px] text-gray-500">Tech Corp • 2022</p>
                </div>
                <div>
                  <p className="text-[6px] font-semibold text-gray-800">Software Engineer</p>
                  <p className="text-[5px] text-gray-500">StartupXYZ • 2020</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[6px] font-bold uppercase mb-1 pb-0.5 border-b" style={{ color: theme.primary, borderColor: theme.primary }}>
                Education
              </h4>
              <p className="text-[6px] font-semibold text-gray-800">M.Sc. Computer Science</p>
              <p className="text-[5px] text-gray-500">University • 2020</p>
            </div>
          </div>

          <div className="w-[40%] p-2" style={{ backgroundColor: theme.light }}>
            <div className="mb-2">
              <h4 className="text-[6px] font-bold uppercase mb-1 pb-0.5 border-b" style={{ color: theme.primary, borderColor: theme.primary }}>
                Skills
              </h4>
              <div className="flex flex-wrap gap-0.5">
                {["React", "Node", "Python"].map((skill) => (
                  <span key={skill} className="px-1 py-0.5 rounded text-[5px] bg-white/70 text-gray-700">{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[6px] font-bold uppercase mb-1 pb-0.5 border-b" style={{ color: theme.primary, borderColor: theme.primary }}>
                Projects
              </h4>
              <p className="text-[5px] font-medium text-gray-800">E-commerce Platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <h3 className="font-semibold text-foreground text-sm">{theme.name}</h3>
        <Button variant="ghost" size="sm" className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" onClick={onUse}>
          Use Template <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};

const TemplateShowcase = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createResume } = useResumes();

  const handleUseTemplate = async (colorScheme: ColorScheme) => {
    if (!user) {
      navigate("/signup");
      return;
    }
    const resume = await createResume();
    if (resume) {
      navigate(`/builder/${resume.id}?template=${colorScheme}`);
    }
  };

  const allSchemes = Object.keys(colorSchemes) as ColorScheme[];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Professional Resume Templates</h2>
          <p className="text-lg text-muted-foreground">
            Choose from 10 color schemes with modern layouts featuring work experience, skills, projects, and certifications.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {allSchemes.map((scheme) => (
            <TemplateCard key={scheme} colorScheme={scheme} onUse={() => handleUseTemplate(scheme)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplateShowcase;
