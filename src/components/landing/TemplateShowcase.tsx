import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";
import { Mail, Phone, User, ArrowRight, Crown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

export type PremiumColorScheme =
  | "lavender-purple"
  | "neon-pink"
  | "sunset-gold"
  | "emerald-green"
  | "crimson-red"
  | "ocean-cyan"
  | "midnight-navy"
  | "rose-gold"
  | "electric-indigo"
  | "aquamarine"
  | "cherry-blossom"
  | "arctic-frost"
  | "bronze-ember"
  | "mystic-teal"
  | "violet-haze";

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

export const premiumColorSchemes: Record<PremiumColorScheme, { name: string; primary: string; secondary: string; accent: string; light: string; headerBg: string }> = {
  "lavender-purple": { name: "Lavender Purple", primary: "#7624db", secondary: "#9250e2", accent: "#ad7bea", light: "#f1e9fb", headerBg: "#18072c" },
  "neon-pink": { name: "Neon Pink", primary: "#eb1495", secondary: "#ef43aa", accent: "#f372bf", light: "#fde8f4", headerBg: "#2a0516" },
  "sunset-gold": { name: "Sunset Gold", primary: "#E6A817", secondary: "#F0C040", accent: "#F5D060", light: "#FFF8E1", headerBg: "#3D2E0A" },
  "emerald-green": { name: "Emerald Green", primary: "#00875A", secondary: "#00A86B", accent: "#36D399", light: "#E6F9F1", headerBg: "#002E1F" },
  "crimson-red": { name: "Crimson Red", primary: "#DC143C", secondary: "#E8364F", accent: "#F06070", light: "#FDE8EC", headerBg: "#2D0A12" },
  "ocean-cyan": { name: "Ocean Cyan", primary: "#0099cc", secondary: "#33ccff", accent: "#66d9ff", light: "#e6f7ff", headerBg: "#001b24" },
  "midnight-navy": { name: "Midnight Navy", primary: "#1a237e", secondary: "#3949ab", accent: "#5c6bc0", light: "#e8eaf6", headerBg: "#0d1147" },
  "rose-gold": { name: "Rose Gold", primary: "#B76E79", secondary: "#D4A0A7", accent: "#E8C4C9", light: "#FDF2F4", headerBg: "#3D2228" },
  "electric-indigo": { name: "Electric Indigo", primary: "#6930c3", secondary: "#7B4FD3", accent: "#9B7DE8", light: "#EDE4FB", headerBg: "#1A0B33" },
  "aquamarine": { name: "Aquamarine", primary: "#00ccb1", secondary: "#33ffe4", accent: "#66ffeb", light: "#e5fffc", headerBg: "#00332c" },
  "cherry-blossom": { name: "Cherry Blossom", primary: "#E891B2", secondary: "#F0A8C4", accent: "#F7C4D8", light: "#FDF0F5", headerBg: "#3D1A28" },
  "arctic-frost": { name: "Arctic Frost", primary: "#5B9BD5", secondary: "#7EB3E0", accent: "#A8CCEB", light: "#EBF3FA", headerBg: "#1A2D42" },
  "bronze-ember": { name: "Bronze Ember", primary: "#CD7F32", secondary: "#D4954D", accent: "#DBAB68", light: "#FBF3E8", headerBg: "#3D2610" },
  "mystic-teal": { name: "Mystic Teal", primary: "#2E8B8B", secondary: "#4AA8A8", accent: "#6EC5C5", light: "#E8F6F6", headerBg: "#0F2E2E" },
  "violet-haze": { name: "Violet Haze", primary: "#8A5CF5", secondary: "#A07DF7", accent: "#B69EF9", light: "#F0EAFD", headerBg: "#1E1040" },
};

interface TemplateCardProps {
  colorScheme: ColorScheme;
  onUse: () => void;
}

export const TemplateCard = ({ colorScheme, onUse }: TemplateCardProps) => {
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

interface PremiumTemplateCardProps {
  colorScheme: PremiumColorScheme;
  onUse: () => void;
}

export const PremiumTemplateCard = ({ colorScheme, onUse }: PremiumTemplateCardProps) => {
  const theme = premiumColorSchemes[colorScheme];

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300">
      {/* Premium badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r shadow-lg" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
        <Crown className="w-3 h-3 text-white" />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Premium</span>
      </div>

      <div className="aspect-[3/4] overflow-hidden">
        {/* Advanced layout: full-width header with gradient accent bar */}
        <div className="relative">
          <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})` }} />
          <div className="px-3 py-2.5" style={{ backgroundColor: theme.headerBg }}>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[10px] font-bold text-white tracking-wide">{sampleData.fullName}</h3>
                <p className="text-[6px] font-medium mt-0.5" style={{ color: theme.accent }}>{sampleData.tagline}</p>
              </div>
            </div>
            <div className="flex gap-3 text-[6px] mt-1">
              <div className="flex items-center gap-0.5">
                <Mail className="w-2 h-2" style={{ color: theme.accent }} />
                <span style={{ color: theme.accent }}>{sampleData.email}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <Phone className="w-2 h-2" style={{ color: theme.accent }} />
                <span style={{ color: theme.accent }}>{sampleData.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100%-80px)]">
          {/* Left sidebar */}
          <div className="w-[35%] p-2" style={{ backgroundColor: theme.headerBg }}>
            <div className="mb-2">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-1 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                <h4 className="text-[6px] font-bold uppercase tracking-wider text-white">Skills</h4>
              </div>
              <div className="space-y-0.5">
                {["React", "Node.js", "Python", "TypeScript"].map((skill) => (
                  <div key={skill} className="flex items-center gap-1">
                    <div className="w-full rounded-full h-1 overflow-hidden" style={{ backgroundColor: `${theme.primary}30` }}>
                      <div className="h-full rounded-full" style={{ width: `${60 + Math.random() * 40}%`, background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})` }} />
                    </div>
                    <span className="text-[5px] text-gray-300 whitespace-nowrap">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-1 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                <h4 className="text-[6px] font-bold uppercase tracking-wider text-white">Languages</h4>
              </div>
              <div className="space-y-0.5">
                {["English", "Spanish"].map((lang) => (
                  <p key={lang} className="text-[5px] text-gray-300">{lang}</p>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <div className="w-1 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                <h4 className="text-[6px] font-bold uppercase tracking-wider text-white">Certifications</h4>
              </div>
              <p className="text-[5px] text-gray-300">AWS Certified</p>
            </div>
          </div>

          {/* Right content */}
          <div className="w-[65%] p-2 bg-white">
            <div className="mb-2">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="w-2 h-2" style={{ color: theme.primary }} />
                <h4 className="text-[6px] font-bold uppercase tracking-wider" style={{ color: theme.primary }}>Summary</h4>
              </div>
              <p className="text-[5px] text-gray-600 leading-relaxed">Experienced full-stack developer with 5+ years building scalable applications.</p>
            </div>
            <div className="mb-2">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="w-2 h-2" style={{ color: theme.primary }} />
                <h4 className="text-[6px] font-bold uppercase tracking-wider" style={{ color: theme.primary }}>Experience</h4>
              </div>
              <div className="space-y-1.5">
                <div className="relative pl-2 border-l" style={{ borderColor: theme.primary }}>
                  <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                  <p className="text-[6px] font-bold text-gray-800">Senior Developer</p>
                  <p className="text-[5px] font-medium" style={{ color: theme.secondary }}>Tech Corp • 2022-Present</p>
                </div>
                <div className="relative pl-2 border-l" style={{ borderColor: `${theme.primary}50` }}>
                  <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                  <p className="text-[6px] font-bold text-gray-800">Full Stack Engineer</p>
                  <p className="text-[5px] font-medium" style={{ color: theme.secondary }}>StartupXYZ • 2019-2022</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="w-2 h-2" style={{ color: theme.primary }} />
                <h4 className="text-[6px] font-bold uppercase tracking-wider" style={{ color: theme.primary }}>Education</h4>
              </div>
              <p className="text-[6px] font-bold text-gray-800">M.Sc. Computer Science</p>
              <p className="text-[5px]" style={{ color: theme.secondary }}>MIT • 2019</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm">{theme.name}</h3>
          <Badge className="text-[9px] px-1.5 py-0 border-0" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: 'white' }}>
            PRO
          </Badge>
        </div>
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

  const handleUseTemplate = async (colorScheme: string) => {
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
            Choose from 20 color schemes with modern layouts featuring work experience, skills, projects, and certifications.
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
