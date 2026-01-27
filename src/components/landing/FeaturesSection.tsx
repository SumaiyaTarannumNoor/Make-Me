import { 
  Sparkles, 
  FileText, 
  Zap, 
  Shield, 
  Download, 
  Globe,
  Wand2,
  LayoutTemplate
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Wand2,
      title: "AI-Powered Writing",
      description: "Transform rough notes into professional bullet points. Our AI understands your experience and crafts compelling content.",
      color: "bg-icy-blue-500/20 text-icy-blue-300",
    },
    {
      icon: LayoutTemplate,
      title: "ATS-Optimized Templates",
      description: "Choose from 5+ professionally designed templates that pass Applicant Tracking Systems with flying colors.",
      color: "bg-pastel-petal-500/20 text-pastel-petal-300",
    },
    {
      icon: Zap,
      title: "10-Minute Resumes",
      description: "Our guided wizard and smart suggestions help you create a polished resume in under 10 minutes.",
      color: "bg-baby-pink-500/20 text-baby-pink-300",
    },
    {
      icon: Download,
      title: "Multiple Export Formats",
      description: "Download your resume as PDF or DOCX. Share via public link or print directly from the app.",
      color: "bg-thistle-500/20 text-thistle-300",
    },
    {
      icon: Shield,
      title: "Keyword Optimization",
      description: "Get real-time suggestions for industry keywords that help your resume rank higher in searches.",
      color: "bg-sky-blue-500/20 text-sky-blue-300",
    },
    {
      icon: Globe,
      title: "Shareable Links",
      description: "Generate public links to share your resume with recruiters. Track views and engagement.",
      color: "bg-icy-blue-500/20 text-icy-blue-300",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-icy-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pastel-petal-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pastel-petal-600/30 border border-pastel-petal-400/30 mb-6">
            <Sparkles className="w-4 h-4 text-pastel-petal-300" />
            <span className="text-sm font-medium text-pastel-petal-100">Powerful Features</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Everything you need to
            <span className="text-gradient block">land your dream job</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered platform combines cutting-edge technology with proven resume strategies 
            to help you stand out from the competition.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
