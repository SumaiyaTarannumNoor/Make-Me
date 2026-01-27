import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Star, Check, Filter, LayoutTemplate } from "lucide-react";

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "professional", label: "Professional" },
    { id: "creative", label: "Creative" },
    { id: "simple", label: "Simple" },
    { id: "modern", label: "Modern" },
  ];

  const templates = [
    {
      id: 1,
      name: "Modern Professional",
      category: "professional",
      popular: true,
      color: "from-icy-blue-400 to-sky-blue-500",
      description: "Clean and modern design perfect for corporate roles",
      features: ["ATS-friendly", "1-2 pages", "Print-ready"],
    },
    {
      id: 2,
      name: "Creative Minimal",
      category: "creative",
      popular: false,
      color: "from-pastel-petal-400 to-baby-pink-500",
      description: "Stand out with a unique yet professional layout",
      features: ["Creative layout", "1 page", "Portfolio-ready"],
    },
    {
      id: 3,
      name: "Executive Classic",
      category: "professional",
      popular: true,
      color: "from-thistle-400 to-thistle-500",
      description: "Traditional format ideal for senior positions",
      features: ["ATS-optimized", "2 pages", "Executive format"],
    },
    {
      id: 4,
      name: "Tech Innovator",
      category: "modern",
      popular: false,
      color: "from-sky-blue-400 to-icy-blue-500",
      description: "Perfect for developers and tech professionals",
      features: ["Skills-focused", "1-2 pages", "Tech-ready"],
    },
    {
      id: 5,
      name: "Clean Simple",
      category: "simple",
      popular: true,
      color: "from-icy-blue-300 to-icy-blue-400",
      description: "Minimalist design that lets your content shine",
      features: ["Simple layout", "1 page", "Fast to fill"],
    },
    {
      id: 6,
      name: "Fresh Graduate",
      category: "simple",
      popular: false,
      color: "from-baby-pink-300 to-pastel-petal-400",
      description: "Designed for students and fresh graduates",
      features: ["Entry-level", "1 page", "Education-focused"],
    },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-icy-blue-600/30 border border-icy-blue-400/30 mb-6">
              <LayoutTemplate className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">ATS-Optimized</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Professional Resume
              <span className="text-gradient block">Templates</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose from our collection of professionally designed, ATS-friendly templates. 
              All templates are optimized to help you land interviews.
            </p>
          </div>

          {/* Filters */}
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

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
              >
                {/* Template Preview */}
                <div className={`aspect-[3/4] bg-gradient-to-br ${template.color} p-6 relative`}>
                  <div className="w-full h-full bg-card/95 rounded-xl p-6 shadow-lg">
                    {/* Mini Resume Preview */}
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 mx-auto" />
                      <div className="text-center space-y-2">
                        <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
                        <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
                      </div>
                      <div className="pt-4 space-y-2">
                        <div className="h-3 bg-muted/50 rounded w-full" />
                        <div className="h-3 bg-muted/50 rounded w-5/6" />
                        <div className="h-3 bg-muted/50 rounded w-4/6" />
                      </div>
                      <div className="pt-4 space-y-2">
                        <div className="h-3 bg-muted/50 rounded w-full" />
                        <div className="h-3 bg-muted/50 rounded w-3/4" />
                      </div>
                      <div className="pt-4 flex gap-2">
                        <div className="h-6 bg-muted/50 rounded-full w-16" />
                        <div className="h-6 bg-muted/50 rounded-full w-16" />
                        <div className="h-6 bg-muted/50 rounded-full w-16" />
                      </div>
                    </div>
                  </div>

                  {/* Popular Badge */}
                  {template.popular && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-card shadow-lg">
                      <Star className="w-4 h-4 text-baby-pink fill-baby-pink" />
                      <span className="text-xs font-semibold text-foreground">Popular</span>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {template.features.map((feature, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground"
                      >
                        <Check className="w-3 h-3 text-primary" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link to="/signup">
                    <Button variant="hero" className="w-full">
                      Use This Template
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Templates;
