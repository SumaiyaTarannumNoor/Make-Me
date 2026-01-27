import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Sparkles,
  ChevronLeft,
  Download,
  Share2,
  Eye,
  Wand2,
  Plus,
  Trash2,
  GripVertical,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
}

const Builder = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [sections, setSections] = useState<Section[]>([
    { id: "personal", title: "Personal Information", icon: User, isOpen: true },
    { id: "summary", title: "Professional Summary", icon: FileCheck, isOpen: false },
    { id: "experience", title: "Work Experience", icon: Briefcase, isOpen: false },
    { id: "education", title: "Education", icon: GraduationCap, isOpen: false },
    { id: "skills", title: "Skills", icon: Code, isOpen: false },
    { id: "projects", title: "Projects", icon: FileText, isOpen: false },
    { id: "certifications", title: "Certifications", icon: Award, isOpen: false },
  ]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    summary: "",
  });

  const [experiences, setExperiences] = useState([
    { id: 1, company: "", title: "", startDate: "", endDate: "", description: "" },
  ]);

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isOpen: !s.isOpen } : s))
    );
    setActiveSection(id);
  };

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      { id: Date.now(), company: "", title: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const removeExperience = (id: number) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left */}
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-button flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary-foreground" />
                </div>
                <Input
                  type="text"
                  defaultValue="Untitled Resume"
                  className="border-0 bg-transparent font-semibold text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-8 w-40"
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="hero" size="sm">
                <Download className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Editor */}
        <div className="w-full lg:w-1/2 xl:w-2/5 border-r border-border bg-card overflow-auto">
          <div className="p-6 space-y-4">
            {sections.map((section) => (
              <Collapsible
                key={section.id}
                open={section.isOpen}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-icy-blue-600/30 flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">{section.title}</span>
                    </div>
                    {section.isOpen ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 space-y-4">
                    {section.id === "personal" && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              placeholder="John Doe"
                              value={formData.fullName}
                              onChange={(e) =>
                                setFormData({ ...formData, fullName: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              placeholder="+880 1234-567890"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              placeholder="Dhaka, Bangladesh"
                              value={formData.location}
                              onChange={(e) =>
                                setFormData({ ...formData, location: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                              id="linkedin"
                              placeholder="linkedin.com/in/johndoe"
                              value={formData.linkedin}
                              onChange={(e) =>
                                setFormData({ ...formData, linkedin: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="portfolio">Portfolio</Label>
                            <Input
                              id="portfolio"
                              placeholder="johndoe.com"
                              value={formData.portfolio}
                              onChange={(e) =>
                                setFormData({ ...formData, portfolio: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {section.id === "summary" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="summary">Professional Summary</Label>
                          <Button variant="ghost" size="sm" className="text-primary">
                            <Wand2 className="w-4 h-4 mr-1" />
                            AI Generate
                          </Button>
                        </div>
                        <Textarea
                          id="summary"
                          placeholder="Write a compelling summary of your professional background..."
                          value={formData.summary}
                          onChange={(e) =>
                            setFormData({ ...formData, summary: e.target.value })
                          }
                          rows={5}
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.summary.length}/300 characters
                        </p>
                      </div>
                    )}

                    {section.id === "experience" && (
                      <div className="space-y-4">
                        {experiences.map((exp, index) => (
                          <div
                            key={exp.id}
                            className="p-4 rounded-xl border border-border bg-card space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                                <span className="font-medium text-sm text-muted-foreground">
                                  Experience {index + 1}
                                </span>
                              </div>
                              {experiences.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExperience(exp.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Company</Label>
                                <Input placeholder="Company Name" />
                              </div>
                              <div className="space-y-2">
                                <Label>Job Title</Label>
                                <Input placeholder="Software Engineer" />
                              </div>
                              <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input placeholder="Jan 2022" />
                              </div>
                              <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input placeholder="Present" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label>Description</Label>
                                <Button variant="ghost" size="sm" className="text-primary">
                                  <Wand2 className="w-4 h-4 mr-1" />
                                  Improve with AI
                                </Button>
                              </div>
                              <Textarea
                                placeholder="• Led development of..."
                                rows={4}
                              />
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={addExperience}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Experience
                        </Button>
                      </div>
                    )}

                    {section.id === "education" && (
                      <div className="p-4 rounded-xl border border-border bg-card space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Institution</Label>
                            <Input placeholder="University Name" />
                          </div>
                          <div className="space-y-2">
                            <Label>Degree</Label>
                            <Input placeholder="B.Sc. in Computer Science" />
                          </div>
                          <div className="space-y-2">
                            <Label>Graduation Year</Label>
                            <Input placeholder="2024" />
                          </div>
                          <div className="space-y-2">
                            <Label>CGPA / Grade</Label>
                            <Input placeholder="3.80/4.00" />
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Education
                        </Button>
                      </div>
                    )}

                    {section.id === "skills" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Add Skills</Label>
                          <div className="flex gap-2">
                            <Input placeholder="e.g., JavaScript, React, Python" />
                            <Button variant="outline">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {["JavaScript", "React", "TypeScript", "Node.js", "Python"].map(
                            (skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1.5 rounded-full bg-icy-blue-600/30 text-sm font-medium text-foreground flex items-center gap-2"
                              >
                                {skill}
                                <button className="hover:text-destructive">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </span>
                            )
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary">
                          <Sparkles className="w-4 h-4 mr-1" />
                          Suggest relevant skills
                        </Button>
                      </div>
                    )}

                    {(section.id === "projects" || section.id === "certifications") && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="mb-4">Add your {section.title.toLowerCase()}</p>
                        <Button variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Add {section.id === "projects" ? "Project" : "Certification"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="hidden lg:flex flex-1 items-start justify-center p-8 bg-muted/30 overflow-auto">
          <div className="w-full max-w-[600px] bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            {/* Preview Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <span className="text-sm font-medium text-muted-foreground">Live Preview</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Template: Modern Professional</span>
              </div>
            </div>

            {/* Resume Preview */}
            <div className="p-8 min-h-[800px]">
              {/* Header */}
              <div className="text-center pb-6 border-b border-border">
                <h1 className="text-2xl font-bold text-foreground">
                  {formData.fullName || "Your Name"}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {[formData.email, formData.phone, formData.location]
                    .filter(Boolean)
                    .join(" • ") || "your@email.com • +880 1234-567890 • Dhaka, BD"}
                </p>
                {(formData.linkedin || formData.portfolio) && (
                  <p className="text-sm text-primary mt-1">
                    {[formData.linkedin, formData.portfolio].filter(Boolean).join(" • ")}
                  </p>
                )}
              </div>

              {/* Summary */}
              {formData.summary && (
                <div className="py-6 border-b border-border">
                  <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
                    Summary
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {formData.summary}
                  </p>
                </div>
              )}

              {/* Experience Placeholder */}
              <div className="py-6 border-b border-border">
                <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">
                  Experience
                </h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">Software Engineer</h3>
                        <p className="text-sm text-muted-foreground">Tech Company</p>
                      </div>
                      <span className="text-xs text-muted-foreground">Jan 2022 - Present</span>
                    </div>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
                      <li>Led development of new features...</li>
                      <li>Collaborated with cross-functional teams...</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Education Placeholder */}
              <div className="py-6 border-b border-border">
                <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">
                  Education
                </h2>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">B.Sc. in Computer Science</h3>
                    <p className="text-sm text-muted-foreground">University Name</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2024</span>
                </div>
              </div>

              {/* Skills Placeholder */}
              <div className="py-6">
                <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {["JavaScript", "React", "TypeScript", "Node.js", "Python"].map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
