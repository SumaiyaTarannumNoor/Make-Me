import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useResumes, Resume } from "@/hooks/useResumes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ColorScheme, colorSchemes } from "@/components/landing/TemplateShowcase";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ChevronLeft, Download, Plus, Trash2, User, Briefcase,
  GraduationCap, Code, FileCheck, ChevronDown, ChevronUp, Loader2, Save,
  FolderOpen, Award, Mail, Phone, MapPin, Linkedin, Globe, Camera,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const AUTOSAVE_KEY = "resume_autosave_";

const Builder = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { resumes, updateResume, createResume } = useResumes();
  const { toast } = useToast();
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("coral");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [sections, setSections] = useState([
    { id: "personal", title: "Personal Information", icon: User, isOpen: true },
    { id: "photo", title: "Profile Photo", icon: Camera, isOpen: false },
    { id: "summary", title: "Professional Summary", icon: FileCheck, isOpen: false },
    { id: "experience", title: "Work Experience", icon: Briefcase, isOpen: false },
    { id: "education", title: "Education", icon: GraduationCap, isOpen: false },
    { id: "skills", title: "Skills", icon: Code, isOpen: false },
    { id: "projects", title: "Projects", icon: FolderOpen, isOpen: false },
    { id: "certifications", title: "Certifications", icon: Award, isOpen: false },
  ]);

  const [formData, setFormData] = useState({
    title: "Untitled Resume",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    tagline: "",
    summary: "",
  });

  const [experiences, setExperiences] = useState([
    { id: 1, company: "", title: "", type: "Full-time", startDate: "", endDate: "", description: "" },
  ]);

  const [education, setEducation] = useState([
    { id: 1, institution: "", degree: "", year: "", grade: "" },
  ]);

  const [skillGroups, setSkillGroups] = useState([
    { id: 1, category: "Technical Skills", items: [] as string[] },
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [activeSkillGroup, setActiveSkillGroup] = useState(0);

  const [projects, setProjects] = useState([
    { id: 1, name: "", description: "", link: "" },
  ]);

  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCert, setNewCert] = useState("");

  const theme = colorSchemes[colorScheme];

  // Auto-save to localStorage whenever data changes
  const saveToLocalStorage = useCallback(() => {
    if (!id) return;
    const data = {
      formData,
      experiences,
      education,
      skillGroups,
      projects,
      certifications,
      colorScheme,
      photoUrl,
    };
    localStorage.setItem(AUTOSAVE_KEY + id, JSON.stringify(data));
    setHasUnsavedChanges(true);
  }, [id, formData, experiences, education, skillGroups, projects, certifications, colorScheme, photoUrl]);

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage();
    }, 500);
    return () => clearTimeout(timer);
  }, [saveToLocalStorage]);

  // Load from localStorage on mount
  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(AUTOSAVE_KEY + id);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.formData) setFormData(data.formData);
          if (data.experiences) setExperiences(data.experiences);
          if (data.education) setEducation(data.education);
          if (data.skillGroups) setSkillGroups(data.skillGroups);
          if (data.projects) setProjects(data.projects);
          if (data.certifications) setCertifications(data.certifications);
          if (data.colorScheme) setColorScheme(data.colorScheme);
          if (data.photoUrl) setPhotoUrl(data.photoUrl);
          setHasUnsavedChanges(true);
          return; // Use localStorage data instead of database
        } catch (e) {
          console.error("Failed to parse saved data", e);
        }
      }
    }
  }, [id]);

  // Load from template param
  useEffect(() => {
    const templateParam = searchParams.get("template");
    if (templateParam && Object.keys(colorSchemes).includes(templateParam)) {
      setColorScheme(templateParam as ColorScheme);
    }
  }, [searchParams]);

  // Load from database if no localStorage data
  useEffect(() => {
    if (id && resumes.length > 0) {
      const saved = localStorage.getItem(AUTOSAVE_KEY + id);
      if (saved) return; // Already loaded from localStorage

      const resume = resumes.find((r) => r.id === id);
      if (resume) {
        setCurrentResume(resume);
        setFormData({
          title: resume.title || "Untitled Resume",
          fullName: resume.personal_info?.fullName || "",
          email: resume.personal_info?.email || "",
          phone: resume.personal_info?.phone || "",
          location: resume.personal_info?.location || "",
          linkedin: resume.personal_info?.linkedin || "",
          portfolio: resume.personal_info?.portfolio || "",
          tagline: resume.personal_info?.tagline || "",
          summary: resume.summary || "",
        });
        if (resume.experience?.length) setExperiences(resume.experience as any);
        if (resume.education?.length) setEducation(resume.education as any);
        if (resume.skills?.length) {
          const skills = resume.skills as any[];
          if (skills[0]?.category) {
            setSkillGroups(skills);
          } else {
            setSkillGroups([{ id: 1, category: "Technical Skills", items: skills.map((s) => s.name || s) }]);
          }
        }
        if (resume.projects?.length) setProjects(resume.projects as any);
        if (resume.certifications?.length) setCertifications((resume.certifications as any[]).map((c) => c.name || c));
      }
    } else if (!id && user) {
      createResume().then((resume) => {
        if (resume) navigate(`/builder/${resume.id}`, { replace: true });
      });
    }
  }, [id, resumes, user]);

  // Set current resume reference
  useEffect(() => {
    if (id && resumes.length > 0) {
      const resume = resumes.find((r) => r.id === id);
      if (resume) setCurrentResume(resume);
    }
  }, [id, resumes]);

  const toggleSection = (sectionId: string) =>
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, isOpen: !s.isOpen } : s)));

  const addSkill = () => {
    if (newSkill.trim() && !skillGroups[activeSkillGroup].items.includes(newSkill.trim())) {
      setSkillGroups((prev) =>
        prev.map((g, i) => (i === activeSkillGroup ? { ...g, items: [...g.items, newSkill.trim()] } : g))
      );
      setNewSkill("");
    }
  };

  const addCertification = () => {
    if (newCert.trim() && !certifications.includes(newCert.trim())) {
      setCertifications((prev) => [...prev, newCert.trim()]);
      setNewCert("");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!currentResume || !user) return;
    setSaving(true);
    await updateResume(currentResume.id, {
      title: formData.title,
      personal_info: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        linkedin: formData.linkedin,
        portfolio: formData.portfolio,
        tagline: formData.tagline,
      },
      summary: formData.summary,
      experience: experiences,
      education: education,
      skills: skillGroups,
      projects: projects,
      certifications: certifications.map((c) => ({ name: c })),
    });
    // Clear localStorage after successful save
    if (id) localStorage.removeItem(AUTOSAVE_KEY + id);
    setHasUnsavedChanges(false);
    toast({ title: "Resume saved!" });
    setSaving(false);
  };

  const handleDownloadPDF = async () => {
    if (!resumePreviewRef.current || !currentResume || !user) return;
    setGenerating(true);
    try {
      // Higher scale for better quality, especially for photos
      const canvas = await html2canvas(resumePreviewRef.current, { 
        scale: 3, 
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 0,
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Handle multi-page if content is longer than A4
      if (imgHeight <= pageHeight) {
        pdf.addImage(canvas.toDataURL("image/png", 1.0), "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST");
      } else {
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(canvas.toDataURL("image/png", 1.0), "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
          position = -pageHeight + (imgHeight - heightLeft - pageHeight);
          pdf.addPage();
          pdf.addImage(canvas.toDataURL("image/png", 1.0), "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
          heightLeft -= pageHeight;
        }
      }
      
      pdf.save(`${formData.title}.pdf`);
      const pdfBlob = pdf.output("blob");
      await supabase.storage.from("resumes").upload(`${user.id}/${currentResume.id}.pdf`, pdfBlob, { upsert: true });
      toast({ title: "PDF saved!" });
    } catch (e) {
      console.error("PDF generation error:", e);
      toast({ title: "Error generating PDF", variant: "destructive" });
    }
    setGenerating(false);
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/login">
          <Button variant="hero">Log in</Button>
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border-0 bg-transparent font-semibold w-40"
            />
            {hasUnsavedChanges && <span className="text-xs text-muted-foreground">(unsaved)</span>}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
              className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium border-0 focus:ring-2 focus:ring-primary"
            >
              {Object.entries(colorSchemes).map(([key, value]) => (
                <option key={key} value={key}>{value.name}</option>
              ))}
            </select>
            <Button variant="ghost" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline ml-1">Save</span>
            </Button>
            <Button variant="hero" size="sm" onClick={handleDownloadPDF} disabled={generating}>
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span className="hidden sm:inline ml-1">PDF</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Panel - Editor */}
        <div className="w-full lg:w-1/2 border-r border-border bg-card overflow-auto p-6 space-y-4">
          {sections.map((section) => (
            <Collapsible key={section.id} open={section.isOpen} onOpenChange={() => toggleSection(section.id)}>
              <CollapsibleTrigger className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-icy-blue-600/30 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold">{section.title}</span>
                </div>
                {section.isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 space-y-4">
                {section.id === "personal" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Full Name</Label>
                      <Input placeholder="John Doe" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>Tagline / Headline</Label>
                      <Input placeholder="A passionate developer..." value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input placeholder="+880 1234-567890" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input placeholder="Dhaka, Bangladesh" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                    </div>
                    <div>
                      <Label>LinkedIn</Label>
                      <Input placeholder="linkedin.com/in/johndoe" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>Portfolio / Website</Label>
                      <Input placeholder="johndoe.com" value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} />
                    </div>
                  </div>
                )}

                {section.id === "photo" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border">
                        {photoUrl ? (
                          <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                        <Button variant="outline" onClick={() => photoInputRef.current?.click()}>
                          <Camera className="w-4 h-4 mr-2" />Upload Photo
                        </Button>
                        {photoUrl && (
                          <Button variant="ghost" size="sm" className="ml-2 text-destructive" onClick={() => setPhotoUrl(null)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Photo is embedded in PDF only, not saved to database.</p>
                  </div>
                )}

                {section.id === "summary" && (
                  <Textarea placeholder="Write a compelling summary..." value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} rows={4} />
                )}

                {section.id === "experience" && (
                  <>
                    {experiences.map((exp, i) => (
                      <div key={exp.id} className="p-4 border rounded-xl space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Experience {i + 1}</span>
                          {experiences.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => setExperiences(experiences.filter((e) => e.id !== exp.id))} className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="Job Title" value={exp.title} onChange={(e) => setExperiences(experiences.map((x) => (x.id === exp.id ? { ...x, title: e.target.value } : x)))} />
                          <Input placeholder="Type (Full-time)" value={exp.type} onChange={(e) => setExperiences(experiences.map((x) => (x.id === exp.id ? { ...x, type: e.target.value } : x)))} />
                          <Input placeholder="Company" value={exp.company} onChange={(e) => setExperiences(experiences.map((x) => (x.id === exp.id ? { ...x, company: e.target.value } : x)))} />
                          <div className="flex gap-2">
                            <Input placeholder="Start" value={exp.startDate} onChange={(e) => setExperiences(experiences.map((x) => (x.id === exp.id ? { ...x, startDate: e.target.value } : x)))} />
                            <Input placeholder="End" value={exp.endDate} onChange={(e) => setExperiences(experiences.map((x) => (x.id === exp.id ? { ...x, endDate: e.target.value } : x)))} />
                          </div>
                        </div>
                        <Textarea placeholder="• Led development of..." value={exp.description} onChange={(e) => setExperiences(experiences.map((x) => (x.id === exp.id ? { ...x, description: e.target.value } : x)))} rows={4} />
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => setExperiences([...experiences, { id: Date.now(), company: "", title: "", type: "Full-time", startDate: "", endDate: "", description: "" }])}>
                      <Plus className="w-4 h-4 mr-2" />Add Experience
                    </Button>
                  </>
                )}

                {section.id === "education" && (
                  <>
                    {education.map((edu) => (
                      <div key={edu.id} className="grid grid-cols-2 gap-4 p-4 border rounded-xl">
                        <Input placeholder="Degree" value={edu.degree} onChange={(e) => setEducation(education.map((x) => (x.id === edu.id ? { ...x, degree: e.target.value } : x)))} />
                        <Input placeholder="Institution" value={edu.institution} onChange={(e) => setEducation(education.map((x) => (x.id === edu.id ? { ...x, institution: e.target.value } : x)))} />
                        <Input placeholder="Year" value={edu.year} onChange={(e) => setEducation(education.map((x) => (x.id === edu.id ? { ...x, year: e.target.value } : x)))} />
                        <Input placeholder="CGPA / Grade" value={edu.grade} onChange={(e) => setEducation(education.map((x) => (x.id === edu.id ? { ...x, grade: e.target.value } : x)))} />
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => setEducation([...education, { id: Date.now(), institution: "", degree: "", year: "", grade: "" }])}>
                      <Plus className="w-4 h-4 mr-2" />Add Education
                    </Button>
                  </>
                )}

                {section.id === "skills" && (
                  <>
                    {skillGroups.map((group, groupIndex) => (
                      <div key={group.id} className="p-4 border rounded-xl space-y-3">
                        <Input placeholder="Category (e.g., Technical Skills)" value={group.category} onChange={(e) => setSkillGroups(skillGroups.map((g, i) => (i === groupIndex ? { ...g, category: e.target.value } : g)))} className="font-medium" />
                        <div className="flex gap-2">
                          <Input placeholder="Add skill..." value={activeSkillGroup === groupIndex ? newSkill : ""} onFocus={() => setActiveSkillGroup(groupIndex)} onChange={(e) => { setActiveSkillGroup(groupIndex); setNewSkill(e.target.value); }} onKeyPress={(e) => e.key === "Enter" && addSkill()} />
                          <Button onClick={addSkill}><Plus className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((skill) => (
                            <span key={skill} className="px-3 py-1 rounded-full bg-icy-blue-600/30 flex items-center gap-2 text-sm">
                              {skill}
                              <button onClick={() => setSkillGroups(skillGroups.map((g, i) => i === groupIndex ? { ...g, items: g.items.filter((s) => s !== skill) } : g))}><Trash2 className="w-3 h-3" /></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => setSkillGroups([...skillGroups, { id: Date.now(), category: "", items: [] }])}>
                      <Plus className="w-4 h-4 mr-2" />Add Skill Category
                    </Button>
                  </>
                )}

                {section.id === "projects" && (
                  <>
                    {projects.map((project) => (
                      <div key={project.id} className="p-4 border rounded-xl space-y-3">
                        <Input placeholder="Project Name" value={project.name} onChange={(e) => setProjects(projects.map((p) => (p.id === project.id ? { ...p, name: e.target.value } : p)))} />
                        <Textarea placeholder="Brief description..." value={project.description} onChange={(e) => setProjects(projects.map((p) => (p.id === project.id ? { ...p, description: e.target.value } : p)))} rows={2} />
                        <Input placeholder="Link (optional)" value={project.link} onChange={(e) => setProjects(projects.map((p) => (p.id === project.id ? { ...p, link: e.target.value } : p)))} />
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => setProjects([...projects, { id: Date.now(), name: "", description: "", link: "" }])}>
                      <Plus className="w-4 h-4 mr-2" />Add Project
                    </Button>
                  </>
                )}

                {section.id === "certifications" && (
                  <>
                    <div className="flex gap-2">
                      <Input placeholder="Certification name..." value={newCert} onChange={(e) => setNewCert(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addCertification()} />
                      <Button onClick={addCertification}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <div className="space-y-2">
                      {certifications.map((cert) => (
                        <div key={cert} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm">{cert}</span>
                          <button onClick={() => setCertifications(certifications.filter((c) => c !== cert))}><Trash2 className="w-4 h-4 text-destructive" /></button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Right Panel - Preview */}
        <div className="hidden lg:flex flex-1 items-start justify-center p-8 bg-muted/30 overflow-auto">
          <div className="w-full max-w-[600px] shadow-xl rounded-lg overflow-hidden">
            <div ref={resumePreviewRef} className="bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
              {/* Header Section */}
              <div className="px-6 py-5" style={{ backgroundColor: theme.headerBg }}>
                <div className="flex items-center gap-4 mb-3">
                  <div 
                    className="rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden" 
                    style={{ 
                      backgroundColor: photoUrl ? "transparent" : theme.primary,
                      width: "64px",
                      height: "64px",
                      minWidth: "64px",
                      minHeight: "64px",
                    }}
                  >
                    {photoUrl ? (
                      <img 
                        src={photoUrl} 
                        alt="Profile" 
                        style={{ 
                          width: "64px", 
                          height: "64px", 
                          objectFit: "cover",
                          borderRadius: "50%",
                        }} 
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white tracking-wide">{formData.fullName || "YOUR NAME"}</h1>
                    <p className="text-gray-300 text-sm mt-0.5">{formData.tagline || "Your professional tagline..."}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-gray-300 text-[10px]">
                  {formData.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" style={{ color: theme.primary }} /><span>{formData.email}</span></div>}
                  {formData.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" style={{ color: theme.primary }} /><span>{formData.phone}</span></div>}
                  {formData.location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" style={{ color: theme.primary }} /><span>{formData.location}</span></div>}
                  {formData.linkedin && <div className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" style={{ color: theme.primary }} /><span>{formData.linkedin}</span></div>}
                  {formData.portfolio && <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" style={{ color: theme.primary }} /><span>{formData.portfolio}</span></div>}
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="flex text-xs">
                {/* Left Column - 60% */}
                <div className="w-[60%] p-5 pr-4">
                  <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>Work Experience</h2>
                    <div className="space-y-3">
                      {experiences.filter((e) => e.company || e.title).map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{exp.title || "Job Title"} {exp.type && `(${exp.type})`}</h3>
                              <p className="text-gray-600 text-[10px]">{exp.company}</p>
                            </div>
                            <span className="text-[9px] text-gray-500 whitespace-nowrap">{exp.startDate} - {exp.endDate || "Present"}</span>
                          </div>
                          {exp.description && (
                            <ul className="mt-1.5 text-[10px] text-gray-600 space-y-0.5">
                              {exp.description.split("\n").filter(Boolean).map((line, i) => (
                                <li key={i} className="flex items-start gap-1"><span style={{ color: theme.primary }}>•</span><span>{line.replace(/^[•\-]\s*/, "")}</span></li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                      {experiences.filter((e) => e.company || e.title).length === 0 && <p className="text-gray-400 italic text-[10px]">Add your work experience...</p>}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>Education</h2>
                    <div className="space-y-2">
                      {education.filter((e) => e.institution || e.degree).map((edu) => (
                        <div key={edu.id} className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-[11px]">{edu.degree || "Degree"}</h3>
                            <p className="text-gray-600 text-[10px]">{edu.institution}</p>
                            {edu.grade && <p className="text-gray-500 text-[9px]">CGPA: {edu.grade}</p>}
                          </div>
                          <span className="text-[9px] text-gray-500">{edu.year}</span>
                        </div>
                      ))}
                      {education.filter((e) => e.institution || e.degree).length === 0 && <p className="text-gray-400 italic text-[10px]">Add your education...</p>}
                    </div>
                  </div>
                </div>

                {/* Right Column - 40% */}
                <div className="w-[40%] p-5 pl-4" style={{ backgroundColor: theme.light }}>
                  <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>Skills</h2>
                    <div className="space-y-2">
                      {skillGroups.map((group) => (
                        <div key={group.id}>
                          {group.category && <p className="font-medium text-gray-700 text-[10px] mb-1">{group.category}</p>}
                          <div className="flex flex-wrap gap-1">
                            {group.items.map((skill, j) => <span key={j} className="px-1.5 py-0.5 rounded text-[9px] text-gray-700 bg-white/70">{skill}</span>)}
                          </div>
                        </div>
                      ))}
                      {skillGroups.every((g) => g.items.length === 0) && <p className="text-gray-400 italic text-[10px]">Add your skills...</p>}
                    </div>
                  </div>

                  {projects.some((p) => p.name) && (
                    <div className="mb-5">
                      <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>Projects</h2>
                      <div className="space-y-2">
                        {projects.filter((p) => p.name).map((project) => (
                          <div key={project.id}>
                            <h3 className="font-semibold text-gray-900 text-[10px]">{project.name}</h3>
                            <p className="text-gray-600 text-[9px]">{project.description}</p>
                            {project.link && <p className="text-[8px]" style={{ color: theme.primary }}>{project.link}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {certifications.length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>Training & Certificates</h2>
                      <ul className="space-y-1">
                        {certifications.map((cert, i) => (
                          <li key={i} className="flex items-start gap-1 text-[10px] text-gray-700"><span style={{ color: theme.primary }}>•</span><span>{cert}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
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
