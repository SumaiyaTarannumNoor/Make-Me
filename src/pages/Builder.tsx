import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useResumes, Resume } from "@/hooks/useResumes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FileText, ChevronLeft, Download, Plus, Trash2, User, Briefcase, GraduationCap, Code, FileCheck, ChevronDown, ChevronUp, Loader2, Save } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { resumes, updateResume, createResume } = useResumes();
  const { toast } = useToast();
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [sections, setSections] = useState([
    { id: "personal", title: "Personal Information", icon: User, isOpen: true },
    { id: "summary", title: "Professional Summary", icon: FileCheck, isOpen: false },
    { id: "experience", title: "Work Experience", icon: Briefcase, isOpen: false },
    { id: "education", title: "Education", icon: GraduationCap, isOpen: false },
    { id: "skills", title: "Skills", icon: Code, isOpen: false },
  ]);
  const [formData, setFormData] = useState({ title: "Untitled Resume", fullName: "", email: "", phone: "", location: "", linkedin: "", portfolio: "", summary: "" });
  const [experiences, setExperiences] = useState([{ id: 1, company: "", title: "", startDate: "", endDate: "", description: "" }]);
  const [education, setEducation] = useState([{ id: 1, institution: "", degree: "", year: "", grade: "" }]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (id && resumes.length > 0) {
      const resume = resumes.find(r => r.id === id);
      if (resume) {
        setCurrentResume(resume);
        setFormData({ title: resume.title, fullName: resume.personal_info?.fullName || "", email: resume.personal_info?.email || "", phone: resume.personal_info?.phone || "", location: resume.personal_info?.location || "", linkedin: resume.personal_info?.linkedin || "", portfolio: resume.personal_info?.portfolio || "", summary: resume.summary || "" });
        if (resume.experience?.length) setExperiences(resume.experience as any);
        if (resume.education?.length) setEducation(resume.education as any);
        if (resume.skills?.length) setSkills((resume.skills as any).map((s: any) => s.name || s));
      }
    } else if (!id && user) {
      createResume().then(resume => { if (resume) navigate(`/builder/${resume.id}`, { replace: true }); });
    }
  }, [id, resumes, user]);

  const toggleSection = (sectionId: string) => setSections(prev => prev.map(s => s.id === sectionId ? { ...s, isOpen: !s.isOpen } : s));
  const addSkill = () => { if (newSkill.trim() && !skills.includes(newSkill.trim())) { setSkills(prev => [...prev, newSkill.trim()]); setNewSkill(""); } };

  const handleSave = async () => {
    if (!currentResume || !user) return;
    setSaving(true);
    await updateResume(currentResume.id, { title: formData.title, personal_info: { fullName: formData.fullName, email: formData.email, phone: formData.phone, location: formData.location, linkedin: formData.linkedin, portfolio: formData.portfolio }, summary: formData.summary, experience: experiences, education: education, skills: skills.map(s => ({ name: s })) });
    toast({ title: "Resume saved!" });
    setSaving(false);
  };

  const handleDownloadPDF = async () => {
    if (!resumePreviewRef.current || !currentResume || !user) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(resumePreviewRef.current, { scale: 2 });
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`${formData.title}.pdf`);
      const pdfBlob = pdf.output("blob");
      await supabase.storage.from("resumes").upload(`${user.id}/${currentResume.id}.pdf`, pdfBlob, { upsert: true });
      toast({ title: "PDF saved!" });
    } catch (e) { toast({ title: "Error", variant: "destructive" }); }
    setGenerating(false);
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><Link to="/login"><Button variant="hero">Log in</Button></Link></div>;

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><ChevronLeft className="w-5 h-5" /></Link>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="border-0 bg-transparent font-semibold w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}</Button>
            <Button variant="hero" size="sm" onClick={handleDownloadPDF} disabled={generating}>{generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} PDF</Button>
          </div>
        </div>
      </header>
      <div className="flex-1 flex">
        <div className="w-full lg:w-1/2 border-r border-border bg-card overflow-auto p-6 space-y-4">
          {sections.map(section => (
            <Collapsible key={section.id} open={section.isOpen} onOpenChange={() => toggleSection(section.id)}>
              <CollapsibleTrigger className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-icy-blue-600/30 flex items-center justify-center"><section.icon className="w-5 h-5 text-primary" /></div><span className="font-semibold">{section.title}</span></div>
                {section.isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 space-y-4">
                {section.id === "personal" && <div className="grid grid-cols-2 gap-4">{["fullName", "email", "phone", "location", "linkedin", "portfolio"].map(f => <div key={f}><Label>{f}</Label><Input value={(formData as any)[f]} onChange={e => setFormData({ ...formData, [f]: e.target.value })} /></div>)}</div>}
                {section.id === "summary" && <Textarea value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} rows={5} />}
                {section.id === "experience" && <>{experiences.map((exp, i) => <div key={exp.id} className="p-4 border rounded-xl space-y-4"><div className="grid grid-cols-2 gap-4"><Input placeholder="Company" value={exp.company} onChange={e => setExperiences(experiences.map(x => x.id === exp.id ? { ...x, company: e.target.value } : x))} /><Input placeholder="Title" value={exp.title} onChange={e => setExperiences(experiences.map(x => x.id === exp.id ? { ...x, title: e.target.value } : x))} /></div><Textarea placeholder="Description" value={exp.description} onChange={e => setExperiences(experiences.map(x => x.id === exp.id ? { ...x, description: e.target.value } : x))} /></div>)}<Button variant="outline" onClick={() => setExperiences([...experiences, { id: Date.now(), company: "", title: "", startDate: "", endDate: "", description: "" }])}><Plus className="w-4 h-4 mr-2" />Add</Button></>}
                {section.id === "education" && education.map(edu => <div key={edu.id} className="grid grid-cols-2 gap-4"><Input placeholder="Institution" value={edu.institution} onChange={e => setEducation(education.map(x => x.id === edu.id ? { ...x, institution: e.target.value } : x))} /><Input placeholder="Degree" value={edu.degree} onChange={e => setEducation(education.map(x => x.id === edu.id ? { ...x, degree: e.target.value } : x))} /></div>)}
                {section.id === "skills" && <><div className="flex gap-2"><Input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyPress={e => e.key === "Enter" && addSkill()} /><Button onClick={addSkill}><Plus className="w-4 h-4" /></Button></div><div className="flex flex-wrap gap-2">{skills.map(s => <span key={s} className="px-3 py-1 rounded-full bg-icy-blue-600/30 flex items-center gap-2">{s}<button onClick={() => setSkills(skills.filter(x => x !== s))}><Trash2 className="w-3 h-3" /></button></span>)}</div></>}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
        <div className="hidden lg:flex flex-1 items-start justify-center p-8 bg-muted/30 overflow-auto">
          <div ref={resumePreviewRef} className="w-full max-w-[600px] bg-white rounded-2xl shadow-xl p-8 min-h-[800px]">
            <div className="text-center pb-6 border-b"><h1 className="text-2xl font-bold">{formData.fullName || "Your Name"}</h1><p className="text-sm text-muted-foreground">{[formData.email, formData.phone, formData.location].filter(Boolean).join(" • ")}</p></div>
            {formData.summary && <div className="py-6 border-b"><h2 className="text-sm font-bold text-primary uppercase mb-3">Summary</h2><p className="text-sm">{formData.summary}</p></div>}
            {experiences.some(e => e.company) && <div className="py-6 border-b"><h2 className="text-sm font-bold text-primary uppercase mb-3">Experience</h2>{experiences.filter(e => e.company).map(exp => <div key={exp.id}><h3 className="font-semibold">{exp.title}</h3><p className="text-sm text-muted-foreground">{exp.company}</p><p className="text-sm">{exp.description}</p></div>)}</div>}
            {education.some(e => e.institution) && <div className="py-6 border-b"><h2 className="text-sm font-bold text-primary uppercase mb-3">Education</h2>{education.filter(e => e.institution).map(edu => <div key={edu.id}><h3 className="font-semibold">{edu.degree}</h3><p className="text-sm text-muted-foreground">{edu.institution}</p></div>)}</div>}
            {skills.length > 0 && <div className="py-6"><h2 className="text-sm font-bold text-primary uppercase mb-3">Skills</h2><div className="flex flex-wrap gap-2">{skills.map(s => <span key={s} className="px-2 py-1 text-xs bg-muted rounded">{s}</span>)}</div></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
