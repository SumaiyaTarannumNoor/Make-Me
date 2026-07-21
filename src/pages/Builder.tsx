import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useResumes, Resume } from "@/hooks/useResumes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ColorScheme, PremiumColorScheme, colorSchemes, premiumColorSchemes } from "@/components/landing/TemplateShowcase";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ChevronLeft, Download, Plus, Trash2, User, Briefcase,
  GraduationCap, Code, FileCheck, ChevronDown, ChevronUp, Loader2, Save,
  FolderOpen, Award, Mail, Phone, MapPin, Linkedin, Globe, Camera, LayoutTemplate, Users,
  Eye, EyeOff, Languages as LanguagesIcon, GripVertical,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { resizeImage, uploadPhoto, getPhotoUrl, removeImageBackground } from "@/lib/photoUpload";

const AUTOSAVE_KEY = "resume_autosave_";
type ResumeColorScheme = ColorScheme | PremiumColorScheme;

const resumeColorSchemes: Record<ResumeColorScheme, { name: string; primary: string; light: string; headerBg: string }> = {
  ...colorSchemes,
  ...premiumColorSchemes,
};

type PaperSize = "a4" | "letter";

type ExperienceItem = { id: number; company: string; title: string; type: string; startDate: string; endDate: string; description: string };
type LearnedExperienceItem = { id: number; title: string; description: string };
type EducationItem = { id: number; institution: string; degree: string; year: string; grade: string };
type SkillGroup = { id: number; category: string; items: string[] };
type ProjectItem = { id: number; name: string; description: string; link: string };
type ReferenceItem = { id: number; name: string; designation: string; organization: string; email: string; phone: string; active?: boolean };
type LanguageItem = { id: number; name: string; level: string };
type HeaderStyle = {
  nameSize: number;
  designationSize: number;
  taglineSize: number;
  nameColor: string;
  designationColor: string;
  taglineColor: string;
  bgColor: string;
};
const DEFAULT_HEADER_STYLE: HeaderStyle = {
  nameSize: 28,
  designationSize: 14,
  taglineSize: 11,
  nameColor: "#ffffff",
  designationColor: "", // empty => use theme.primary
  taglineColor: "#d1d5db",
  bgColor: "", // empty => use theme.headerBg
};
type ResumePersonalInfo = {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
  tagline?: string;
  designation?: string;
  headerStyle?: HeaderStyle;
  learnedExperiences?: LearnedExperienceItem[];
  references?: ReferenceItem[];
  languages?: LanguageItem[];
  paperSize?: PaperSize;
  sectionScales?: Record<string, number>;
  mutedSections?: Record<string, boolean>;
  photoPath?: string;
  photoSize?: number;
  manualPageCount?: number;
};

const PAPER_SIZES: Record<PaperSize, { label: string; widthPx: number; heightPx: number; widthMm: number; heightMm: number }> = {
  a4: { label: "A4", widthPx: 794, heightPx: 1123, widthMm: 210, heightMm: 297 },
  letter: { label: "US Letter", widthPx: 816, heightPx: 1056, widthMm: 215.9, heightMm: 279.4 },
};

// Auto-detect URLs and emails in free text and render them as clickable anchors
// so that clickable link annotations get emitted into the exported PDF.
const URL_REGEX = /(\bhttps?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])|(\b(?:www\.|(?:[a-zA-Z0-9-]+\.)+(?:com|net|org|io|dev|co|app|ai|me|xyz|tech|so|gg|ly|edu|gov|info|bd))(?:\/[^\s<>()]*)?)|(\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b)/gi;
const Linkify = ({ text, color }: { text: string; color?: string }) => {
  if (!text) return null;
  const parts: (string | { url: string; label: string })[] = [];
  let last = 0;
  text.replace(URL_REGEX, (match, _u, _b, _e, offset: number) => {
    if (offset > last) parts.push(text.slice(last, offset));
    const isEmail = match.includes("@") && !match.startsWith("http");
    const url = isEmail ? `mailto:${match}` : match.startsWith("http") ? match : `https://${match}`;
    parts.push({ url, label: match });
    last = offset + match.length;
    return match;
  });
  if (last < text.length) parts.push(text.slice(last));
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          <span key={i}>{p}</span>
        ) : (
          <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: color || "inherit" }}>
            {p.label}
          </a>
        )
      )}
    </>
  );
};



const Builder = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { resumes, updateResume, createResume } = useResumes();
  const { toast } = useToast();
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previewPaneRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [colorScheme, setColorScheme] = useState<ResumeColorScheme>("coral");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [photoSize, setPhotoSize] = useState<number>(128);
  const [photoProcessing, setPhotoProcessing] = useState<null | "upload" | "bgremove">(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [sections, setSections] = useState([
    { id: "personal", title: "Personal Information", icon: User, isOpen: true, muteable: false },
    { id: "photo", title: "Profile Photo", icon: Camera, isOpen: false, muteable: true },
    { id: "summary", title: "Professional Summary", icon: FileCheck, isOpen: false, muteable: true },
    { id: "experience", title: "Work Experience", icon: Briefcase, isOpen: false, muteable: true },
    { id: "learned", title: "Learned Experience", icon: Award, isOpen: false, muteable: true },
    { id: "education", title: "Education", icon: GraduationCap, isOpen: false, muteable: true },
    { id: "skills", title: "Skills", icon: Code, isOpen: false, muteable: true },
    { id: "projects", title: "Projects", icon: FolderOpen, isOpen: false, muteable: true },
    { id: "certifications", title: "Certifications", icon: Award, isOpen: false, muteable: true },
    { id: "languages", title: "Languages", icon: LanguagesIcon, isOpen: false, muteable: true },
    { id: "references", title: "References", icon: Users, isOpen: false, muteable: true },
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
    designation: "",
    summary: "",
  });
  const [headerStyle, setHeaderStyle] = useState<HeaderStyle>(DEFAULT_HEADER_STYLE);

  const [experiences, setExperiences] = useState([
    { id: 1, company: "", title: "", type: "Full-time", startDate: "", endDate: "", description: "" },
  ]);

  const [learnedExperiences, setLearnedExperiences] = useState([
    { id: 1, title: "", description: "" },
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
  const [dragProjectIdx, setDragProjectIdx] = useState<number | null>(null);
  const [dragOverProjectIdx, setDragOverProjectIdx] = useState<number | null>(null);
  const [projectDragArmed, setProjectDragArmed] = useState<string | number | null>(null);

  const reorderProjects = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return;
    setProjects((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const [references, setReferences] = useState<ReferenceItem[]>([
    { id: 1, name: "", designation: "", organization: "", email: "", phone: "", active: true },
  ]);

  const [languages, setLanguages] = useState<LanguageItem[]>([
    { id: 1, name: "", level: "" },
  ]);

  const [mutedSections, setMutedSections] = useState<Record<string, boolean>>({});

  const [pageCount, setPageCount] = useState(1);
  const [manualPageCount, setManualPageCount] = useState(1);
  const [zoom, setZoom] = useState(0.55);
  const [paperSize, setPaperSize] = useState<PaperSize>("a4");
  const [sectionScales, setSectionScales] = useState<Record<string, number>>({});
  const [pageOffsets, setPageOffsets] = useState<number[]>([0]);
  const theme = resumeColorSchemes[colorScheme];
  const activePaper = PAPER_SIZES[paperSize];

  // 1cm safe zones in the actual paper. Content may not enter these areas.
  const ONE_CM_PX = 38;

  const pageTopPad = (i: number) => (i === 0 ? 0 : ONE_CM_PX);
  const pageBottomPad = () => ONE_CM_PX;
  const pageContentH = useCallback(
    (i: number) => activePaper.heightPx - pageTopPad(i) - pageBottomPad(),
    [activePaper.heightPx]
  );

  const isMuted = (sectionId: string) => !!mutedSections[sectionId];
  const toggleMute = (sectionId: string) =>
    setMutedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));


  // Returns the y-offset (in source content) where page i begins.
  const pageOffsetY = (i: number) => pageOffsets[i] ?? 0;
  const pageVisibleContentH = (i: number) => {
    const nextOffset = pageOffsets[i + 1];
    if (typeof nextOffset !== "number") return pageContentH(i);
    return Math.max(0, Math.min(pageContentH(i), nextOffset - pageOffsetY(i)));
  };

  // Inline component: wraps a resume section so user can drag a handle to resize it.
  const ResizableSection = ({ id, children, interactive = false }: { id: string; children: React.ReactNode; interactive?: boolean }) => {
    const scale = sectionScales[id] ?? 1;
    const innerRef = useRef<HTMLDivElement>(null);
    const [innerH, setInnerH] = useState<number>(0);
    useLayoutEffect(() => {
      if (!innerRef.current) return;
      const measure = () => {
        if (innerRef.current) setInnerH(innerRef.current.offsetHeight);
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(innerRef.current);
      return () => ro.disconnect();
    }, [children, scale]);
    const onMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startY = e.clientY;
      const startScale = scale;
      const onMove = (ev: MouseEvent) => {
        const dy = (ev.clientY - startY) / Math.max(zoom, 0.25);
        const next = Math.max(0.55, Math.min(1.65, +(startScale + dy * 0.0035).toFixed(3)));
        setSectionScales((prev) => ({ ...prev, [id]: next }));
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };
    return (
      <div className="relative group" style={{ height: innerH ? innerH * scale : undefined }}>
        <div
          ref={innerRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: `${100 / scale}%`,
          }}
        >
          {children}
        </div>
        {interactive && (
          <div
            onMouseDown={onMouseDown}
            title="Drag up/down to make this resume section smaller or bigger"
            className="absolute -bottom-2 right-0 z-20 flex h-5 w-16 cursor-ns-resize items-center justify-center rounded border border-primary-foreground/70 bg-primary/90 text-[10px] font-bold text-primary-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
          >
            ↕ resize
          </div>
        )}
      </div>
    );
  };

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Auto-save to localStorage whenever data changes (only after initial DB load)
  const saveToLocalStorage = useCallback(() => {
    if (!id || !initialLoadDone) return;
    const data = {
      savedAt: Date.now(),
      formData,
      experiences,
      learnedExperiences,
      education,
      skillGroups,
      projects,
      certifications,
      references,
      languages,
      colorScheme,
      photoPath,
      photoSize,
      paperSize,
      sectionScales,
      mutedSections,
      headerStyle,
      manualPageCount,
    };
    localStorage.setItem(AUTOSAVE_KEY + id, JSON.stringify(data));
    setHasUnsavedChanges(true);
  }, [id, initialLoadDone, formData, experiences, learnedExperiences, education, skillGroups, projects, certifications, references, languages, colorScheme, photoPath, photoSize, paperSize, sectionScales, mutedSections, headerStyle, manualPageCount]);

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage();
    }, 500);
    return () => clearTimeout(timer);
  }, [saveToLocalStorage]);

  // Load from template param
  useEffect(() => {
    const templateParam = searchParams.get("template");
    if (templateParam && Object.keys(resumeColorSchemes).includes(templateParam)) {
      setColorScheme(templateParam as ResumeColorScheme);
    }
  }, [searchParams]);

  const applyLocalData = (data: any) => {
    if (data.formData) setFormData({ ...{ title: "Untitled Resume", fullName: "", email: "", phone: "", location: "", linkedin: "", portfolio: "", tagline: "", designation: "", summary: "" }, ...data.formData });
    if (data.headerStyle) setHeaderStyle({ ...DEFAULT_HEADER_STYLE, ...data.headerStyle });
    if (data.experiences) setExperiences(data.experiences);
    if (data.learnedExperiences) setLearnedExperiences(data.learnedExperiences);
    if (data.education) setEducation(data.education);
    if (data.skillGroups) setSkillGroups(data.skillGroups);
    if (data.projects) setProjects(data.projects);
    if (data.certifications) setCertifications(data.certifications);
    if (data.references) setReferences(data.references);
    if (data.languages) setLanguages(data.languages);
    if (data.colorScheme) setColorScheme(data.colorScheme);
    if (typeof data.photoSize === "number") setPhotoSize(data.photoSize);
    if (typeof data.manualPageCount === "number") setManualPageCount(data.manualPageCount);
    if (data.photoPath) {
      setPhotoPath(data.photoPath);
      getPhotoUrl("resumes", data.photoPath).then((u) => u && setPhotoUrl(u));
    }
    if (data.paperSize && PAPER_SIZES[data.paperSize as PaperSize]) setPaperSize(data.paperSize);
    if (data.sectionScales) setSectionScales(data.sectionScales);
    if (data.mutedSections) setMutedSections(data.mutedSections);
  };

  const applyDbResume = (resume: Resume) => {
    const personalInfo = resume.personal_info as ResumePersonalInfo;
    setCurrentResume(resume);
    setFormData({
      title: resume.title || "Untitled Resume",
      fullName: personalInfo.fullName || "",
      email: personalInfo.email || "",
      phone: personalInfo.phone || "",
      location: personalInfo.location || "",
      linkedin: personalInfo.linkedin || "",
      portfolio: personalInfo.portfolio || "",
      tagline: personalInfo.tagline || "",
      designation: personalInfo.designation || "",
      summary: resume.summary || "",
    });
    if (personalInfo.headerStyle) setHeaderStyle({ ...DEFAULT_HEADER_STYLE, ...personalInfo.headerStyle });
    if (resume.experience?.length) setExperiences(resume.experience as ExperienceItem[]);
    if (personalInfo.learnedExperiences?.length) setLearnedExperiences(personalInfo.learnedExperiences);
    if (personalInfo.references?.length) setReferences(personalInfo.references);
    if (personalInfo.languages?.length) setLanguages(personalInfo.languages);
    if (personalInfo.mutedSections) setMutedSections(personalInfo.mutedSections);
    if (personalInfo.paperSize && PAPER_SIZES[personalInfo.paperSize]) setPaperSize(personalInfo.paperSize);
    if (personalInfo.sectionScales) setSectionScales(personalInfo.sectionScales);
    if (typeof personalInfo.photoSize === "number") setPhotoSize(personalInfo.photoSize);
    if (typeof personalInfo.manualPageCount === "number") setManualPageCount(personalInfo.manualPageCount);
    if (personalInfo.photoPath) {
      setPhotoPath(personalInfo.photoPath);
      getPhotoUrl("resumes", personalInfo.photoPath).then((u) => u && setPhotoUrl(u));
    }
    if (resume.education?.length) setEducation(resume.education as EducationItem[]);
    if (resume.skills?.length) {
      const skills = resume.skills as (SkillGroup | { name?: string } | string)[];
      if (typeof skills[0] === "object" && skills[0] !== null && "category" in skills[0]) {
        setSkillGroups(skills as SkillGroup[]);
      } else {
        setSkillGroups([{ id: 1, category: "Technical Skills", items: skills.map((s) => typeof s === "string" ? s : "name" in s ? s.name || "" : "").filter(Boolean) }]);
      }
    }
    if (resume.projects?.length) setProjects(resume.projects as ProjectItem[]);
    if (resume.certifications?.length) setCertifications((resume.certifications as ({ name?: string } | string)[]).map((c) => typeof c === "string" ? c : c.name || "").filter(Boolean));
  };

  // Unified load: DB is source of truth; localStorage only overrides if newer than DB updated_at
  useEffect(() => {
    if (initialLoadDone) return;
    if (!id && user) {
      createResume().then((resume) => {
        if (resume) navigate(`/builder/${resume.id}`, { replace: true });
      });
      return;
    }
    if (!id || resumes.length === 0) return;

    const resume = resumes.find((r) => r.id === id);
    if (!resume) return;

    // Always load from DB first
    applyDbResume(resume);

    // Then check if localStorage has strictly newer unsaved edits
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY + id);
      if (saved) {
        const data = JSON.parse(saved);
        const localTime = typeof data.savedAt === "number" ? data.savedAt : 0;
        const dbTime = new Date(resume.updated_at).getTime();
        if (localTime > dbTime) {
          applyLocalData(data);
          setHasUnsavedChanges(true);
        } else {
          // Stale localStorage — clear it so it can't hide DB data later
          localStorage.removeItem(AUTOSAVE_KEY + id);
        }
      }
    } catch (e) {
      console.error("Failed to parse saved data", e);
      localStorage.removeItem(AUTOSAVE_KEY + id);
    }

    setInitialLoadDone(true);
  }, [id, resumes, user, initialLoadDone]);

  useEffect(() => {
    if (!resumePreviewRef.current) return;

    const updatePages = () => {
      const source = resumePreviewRef.current;
      if (!source) return;

      // Use the real resume content height so extra pages are created only after content crosses a page's printable area.
      const contentHeight = Math.max(source.scrollHeight, source.getBoundingClientRect().height, 1);
      const sourceRect = source.getBoundingClientRect();
      const blocks = Array.from(source.querySelectorAll<HTMLElement>("[data-resume-block]"))
        .map((block) => {
          const rect = block.getBoundingClientRect();
          return {
            top: Math.max(0, rect.top - sourceRect.top),
            bottom: Math.max(0, rect.bottom - sourceRect.top),
          };
        })
        .filter((block) => block.bottom - block.top > 4)
        .sort((a, b) => a.top - b.top);

      const nextOffsets = [0];
      let currentOffset = 0;
      let guard = 0;

      // Compute natural page breaks but cap at manualPageCount — pages are added only when the user clicks "+".
      while (
        nextOffsets.length < manualPageCount &&
        currentOffset + pageContentH(nextOffsets.length - 1) < contentHeight - 2 &&
        guard < 30
      ) {
        const currentPage = nextOffsets.length - 1;
        const capacity = pageContentH(currentPage);
        const idealBreak = currentOffset + capacity;
        let breakAt = idealBreak;

        const crossingBlock = blocks.find(
          (block) =>
            block.top < idealBreak &&
            block.bottom > idealBreak &&
            block.top > currentOffset + 48 &&
            block.bottom - block.top < capacity - 48
        );

        if (crossingBlock) {
          breakAt = crossingBlock.top;
        }

        if (breakAt <= currentOffset + 48) {
          breakAt = idealBreak;
        }

        currentOffset = Math.ceil(breakAt);
        nextOffsets.push(currentOffset);
        guard += 1;
      }

      // Pad with empty pages if the user requested more pages than content needs.
      while (nextOffsets.length < manualPageCount) {
        const last = nextOffsets[nextOffsets.length - 1];
        nextOffsets.push(last + pageContentH(nextOffsets.length - 1));
      }

      setPageOffsets((prev) => {
        const isSame = prev.length === nextOffsets.length && prev.every((offset, index) => offset === nextOffsets[index]);
        return isSame ? prev : nextOffsets;
      });
      setPageCount(nextOffsets.length);
    };

    const frame = requestAnimationFrame(updatePages);
    const observer = new ResizeObserver(updatePages);
    observer.observe(resumePreviewRef.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [activePaper.heightPx, activePaper.widthPx, pageContentH, sectionScales, formData, experiences, learnedExperiences, education, skillGroups, projects, certifications, references, manualPageCount]);

  const fitToPage = useCallback(() => {
    const pane = previewPaneRef.current;
    if (!pane) return;
    const availableWidth = pane.clientWidth - 48;
    const availableHeight = pane.clientHeight - 96;
    const nextZoom = Math.min(1, availableWidth / activePaper.widthPx, availableHeight / activePaper.heightPx);
    setZoom(Math.max(0.25, Number(nextZoom.toFixed(2))));
  }, [activePaper.heightPx, activePaper.widthPx]);

  useEffect(() => {
    const frame = requestAnimationFrame(fitToPage);
    return () => cancelAnimationFrame(frame);
  }, [fitToPage, paperSize]);

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !currentResume) return;
    setPhotoProcessing("upload");
    try {
      const resized = await resizeImage(file, 800);
      const path = await uploadPhoto("resumes", user.id, `${currentResume.id}/photo`, resized);
      const url = await getPhotoUrl("resumes", path);
      setPhotoPath(path);
      if (url) setPhotoUrl(url);
      toast({ title: "Photo uploaded", description: "Saved to your account." });
    } catch (err: unknown) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    } finally {
      setPhotoProcessing(null);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    setPhotoPath(null);
  };

  const handleRemoveBackground = async () => {
    if (!photoUrl || !user || !currentResume) return;
    setPhotoProcessing("bgremove");
    try {
      const resp = await fetch(photoUrl);
      const blob = await resp.blob();
      const cleaned = await removeImageBackground(blob);
      const path = await uploadPhoto("resumes", user.id, `${currentResume.id}/photo`, cleaned);
      const url = await getPhotoUrl("resumes", path);
      setPhotoPath(path);
      if (url) setPhotoUrl(url);
      toast({ title: "Background removed" });
    } catch (err: unknown) {
      toast({ title: "Background removal failed", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    } finally {
      setPhotoProcessing(null);
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
        designation: formData.designation,
        headerStyle,
        learnedExperiences,
        references,
        languages,
        paperSize,
        sectionScales,
        mutedSections,
        photoPath: photoPath ?? undefined,
        photoSize,
        manualPageCount,
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

  const handleDownloadPDF = async (compressed = false) => {
    if (!currentResume || !user) return;
    const pages = pageRefs.current.slice(0, pageCount).filter(Boolean) as HTMLDivElement[];
    if (!pages.length) return;

    setGenerating(true);
    try {
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: [activePaper.widthMm, activePaper.heightMm],
        compress: compressed,
      });

      const pxToMm = activePaper.widthMm / activePaper.widthPx;

      for (let i = 0; i < pages.length; i += 1) {
        const pageEl = pages[i];
        const canvas = await html2canvas(pageEl, {
          scale: 4,
          useCORS: true,
          allowTaint: true,
          logging: false,
          imageTimeout: 15000,
          backgroundColor: "#ffffff",
          windowWidth: activePaper.widthPx,
          windowHeight: activePaper.heightPx,
        });

        if (i > 0) pdf.addPage([activePaper.widthMm, activePaper.heightMm], "p");
        if (compressed) {
          pdf.addImage(
            canvas.toDataURL("image/jpeg", 0.95),
            "JPEG",
            0,
            0,
            activePaper.widthMm,
            activePaper.heightMm,
            undefined,
            "SLOW"
          );
        } else {
          pdf.addImage(
            canvas.toDataURL("image/png", 1.0),
            "PNG",
            0,
            0,
            activePaper.widthMm,
            activePaper.heightMm,
            undefined,
            "NONE"
          );
        }

        // Add clickable link annotations on top of the rendered image
        try {
          const pageRect = pageEl.getBoundingClientRect();
          const anchors = pageEl.querySelectorAll("a[href]");
          anchors.forEach((a) => {
            const href = (a as HTMLAnchorElement).href;
            if (!href || href.startsWith("javascript:")) return;
            const r = (a as HTMLAnchorElement).getBoundingClientRect();
            if (!r.width || !r.height) return;
            const x = (r.left - pageRect.left) * pxToMm;
            const y = (r.top - pageRect.top) * pxToMm;
            const w = r.width * pxToMm;
            const h = r.height * pxToMm;
            pdf.link(x, y, w, h, { url: href });
          });
        } catch (err) {
          console.warn("Link annotation failed", err);
        }
      }

      const pdfBlob = pdf.output("blob");
      const suffix = compressed ? "-compressed" : "";
      pdf.save(`${formData.title}${suffix}.pdf`);
      await supabase.storage.from("resumes").upload(`${user.id}/${currentResume.id}${suffix}.pdf`, pdfBlob, { upsert: true });
      toast({ title: compressed ? "Compressed PDF saved!" : "PDF saved!" });
    } catch (e) {
      console.error("PDF generation error:", e);
      toast({ title: "Error generating PDF", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const renderResumeContent = (contentRef: typeof resumePreviewRef | null = null, offsetY = 0, interactive = false) => (
    <div
      ref={contentRef ?? undefined}
      className="bg-white"
      style={{
        fontFamily: "'Inter', sans-serif",
        width: `${activePaper.widthPx}px`,
        transform: offsetY ? `translateY(-${offsetY}px)` : undefined,
      }}
    >
      {/* Header Section */}
      <ResizableSection id="header" interactive={interactive}>
      <div data-resume-block className="px-6 py-5" style={{ backgroundColor: headerStyle.bgColor || theme.headerBg }}>
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-bold tracking-wide leading-tight" style={{ fontSize: `${headerStyle.nameSize}px`, color: headerStyle.nameColor }}>{formData.fullName || "YOUR NAME"}</h1>
            <p className="mt-1 font-medium" style={{ fontSize: `${headerStyle.designationSize}px`, color: headerStyle.designationColor || theme.primary, opacity: formData.designation ? 1 : 0.5 }}>
              {formData.designation || "Your Designation / Job Title"}
            </p>
            <p className="mt-1 leading-snug" style={{ fontSize: `${headerStyle.taglineSize}px`, color: headerStyle.taglineColor, opacity: formData.tagline ? 1 : 0.5 }}>
              {formData.tagline || "Your tagline — a short summary of your career and passion."}
            </p>
          </div>
          {photoUrl ? (
            <div
              role="img"
              aria-label="Profile"
              style={{
                width: `${photoSize}px`,
                height: `${photoSize}px`,
                minWidth: `${photoSize}px`,
                minHeight: `${photoSize}px`,
                borderRadius: "50%",
                backgroundImage: `url(${photoUrl})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                flexShrink: 0,
                border: `3px solid ${theme.primary}`,
              }}
            />
          ) : (
            <div
              className="flex items-center justify-center"
              style={{
                backgroundColor: theme.primary,
                width: `${photoSize}px`,
                height: `${photoSize}px`,
                minWidth: `${photoSize}px`,
                minHeight: `${photoSize}px`,
                borderRadius: "50%",
                flexShrink: 0,
              }}
            >
              <User className="w-16 h-16 text-white" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-gray-300 text-[10px]">
          {formData.email && <a href={`mailto:${formData.email}`} className="flex items-center gap-1.5 no-underline text-inherit"><Mail className="w-3.5 h-3.5" style={{ color: theme.primary }} /><span>{formData.email}</span></a>}
          {formData.phone && <a href={`tel:${formData.phone}`} className="flex items-center gap-1.5 no-underline text-inherit"><Phone className="w-3.5 h-3.5" style={{ color: theme.primary }} /><span>{formData.phone}</span></a>}
          {formData.location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" style={{ color: theme.primary }} /><span>{formData.location}</span></div>}
          {formData.linkedin && <a href={formData.linkedin.startsWith("http") ? formData.linkedin : `https://${formData.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 no-underline text-inherit"><Linkedin className="w-3.5 h-3.5" style={{ color: theme.primary }} /><span>{formData.linkedin}</span></a>}
          {formData.portfolio && <a href={formData.portfolio.startsWith("http") ? formData.portfolio : `https://${formData.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 no-underline text-inherit"><Globe className="w-3.5 h-3.5" style={{ color: theme.primary }} /><span>{formData.portfolio}</span></a>}
        </div>
      </div>
      </ResizableSection>

      {/* Two Column Layout */}
      <div className="flex text-xs">
        {/* Left Column - 60% */}
        <div className="w-[60%] p-5 pr-4">
          {!isMuted("summary") && formData.summary && (
            <ResizableSection id="summary" interactive={interactive}>
              <div data-resume-block className="mb-5">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>Professional Summary</h2>
                <p className="text-[10px] text-gray-700 leading-relaxed whitespace-pre-line"><Linkify text={formData.summary} color={theme.primary} /></p>
              </div>
            </ResizableSection>
          )}
          {!isMuted("experience") && (
          <ResizableSection id="experience" interactive={interactive}>
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>Work Experience</h2>
              <div className="space-y-3">
                {experiences.filter((e) => e.company || e.title).map((exp) => (
                  <div key={exp.id} data-resume-block>
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
                          <li key={i} className="flex items-start gap-1"><span style={{ color: theme.primary }}>•</span><span><Linkify text={line.replace(/^[•-]\s*/, "")} color={theme.primary} /></span></li>

                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                {experiences.filter((e) => e.company || e.title).length === 0 && <p className="text-gray-400 italic text-[10px]">Add your work experience...</p>}
              </div>
            </div>
          </ResizableSection>
          )}

          {!isMuted("learned") && learnedExperiences.some((l) => l.title || l.description) && (
            <ResizableSection id="learned" interactive={interactive}>
              <div className="mb-5">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>Learned Experience</h2>
                <div className="space-y-2">
                  {learnedExperiences.filter((l) => l.title || l.description).map((item) => (
                    <div key={item.id} data-resume-block>
                      {item.title && <h3 className="font-semibold text-gray-900 text-[11px]">{item.title}</h3>}
                      {item.description && (
                        <ul className="mt-1 text-[10px] text-gray-600 space-y-0.5">
                          {item.description.split("\n").filter(Boolean).map((line, i) => (
                            <li key={i} className="flex items-start gap-1"><span style={{ color: theme.primary }}>•</span><span><Linkify text={line.replace(/^[•-]\s*/, "")} color={theme.primary} /></span></li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ResizableSection>
          )}

          {!isMuted("education") && (
          <ResizableSection id="education" interactive={interactive}>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>Education</h2>
              <div className="space-y-2">
                {education.filter((e) => e.institution || e.degree).map((edu) => (
                  <div key={edu.id} data-resume-block className="flex justify-between items-start">
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
          </ResizableSection>
          )}
        </div>

        {/* Right Column - 40% */}
        <div className="w-[40%] p-5 pl-4" style={{ backgroundColor: theme.light }}>
          {!isMuted("skills") && (
          <ResizableSection id="skills" interactive={interactive}>
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>Skills</h2>
              <div className="space-y-2">
                {skillGroups.map((group) => (
                  <div key={group.id} data-resume-block>
                    {group.category && <p className="font-medium text-gray-700 text-[10px] mb-1">{group.category}</p>}
                    <div className="flex flex-wrap gap-1">
                      {group.items.map((skill, j) => <span key={j} className="px-1.5 py-0.5 rounded text-[9px] text-gray-700 bg-white/70">{skill}</span>)}
                    </div>
                  </div>
                ))}
                {skillGroups.every((g) => g.items.length === 0) && <p className="text-gray-400 italic text-[10px]">Add your skills...</p>}
              </div>
            </div>
          </ResizableSection>
          )}

          {!isMuted("projects") && projects.some((p) => p.name) && (
            <ResizableSection id="projects" interactive={interactive}>
              <div className="mb-5">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>Projects</h2>
                <div className="space-y-2">
                  {projects.filter((p) => p.name).map((project) => (
                    <div key={project.id} data-resume-block>
                      <h3 className="font-semibold text-gray-900 text-[10px]">{project.name}</h3>
                      <p className="text-gray-600 text-[9px]"><Linkify text={project.description} color={theme.primary} /></p>
                      {project.link && <p className="text-[8px]"><a href={project.link.startsWith("http") ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: theme.primary }}>{project.link}</a></p>}

                    </div>
                  ))}
                </div>
              </div>
            </ResizableSection>
          )}

          {!isMuted("certifications") && certifications.length > 0 && (
            <ResizableSection id="certifications" interactive={interactive}>
              <div className="mb-5">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>Training & Certificates</h2>
                <ul className="space-y-1">
                  {certifications.map((cert, i) => (
                    <li key={i} data-resume-block className="flex items-start gap-1 text-[10px] text-gray-700"><span style={{ color: theme.primary }}>•</span><span>{cert}</span></li>
                  ))}
                </ul>
              </div>
            </ResizableSection>
          )}

          {!isMuted("languages") && languages.some((l) => l.name) && (
            <ResizableSection id="languages" interactive={interactive}>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>Languages</h2>
                <ul className="space-y-1">
                  {languages.filter((l) => l.name).map((lang) => (
                    <li key={lang.id} data-resume-block className="flex items-center justify-between text-[10px] text-gray-700">
                      <span className="font-medium text-gray-900">{lang.name}</span>
                      {lang.level && <span className="text-gray-500">{lang.level}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </ResizableSection>
          )}
        </div>
      </div>

      {!isMuted("references") && references.some((r) => (r.active !== false) && (r.name || r.organization)) && (
        <ResizableSection id="references" interactive={interactive}>
          <div className="px-5 py-4 border-t" style={{ borderColor: theme.primary }}>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: theme.primary, borderColor: theme.primary }}>References</h2>
            <div className="grid grid-cols-2 gap-4">
              {references.filter((r) => (r.active !== false) && (r.name || r.organization)).map((r) => (
                <div key={r.id} data-resume-block className="text-[10px] text-gray-700">
                  <p className="font-semibold text-gray-900 text-[11px]">{r.name}</p>
                  {r.designation && <p className="text-gray-600">{r.designation}</p>}
                  {r.organization && <p className="text-gray-600">{r.organization}</p>}
                  {r.email && <p className="flex items-center gap-1"><Mail className="w-2.5 h-2.5" style={{ color: theme.primary }} />{r.email}</p>}
                  {r.phone && <p className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" style={{ color: theme.primary }} />{r.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        </ResizableSection>
      )}
    </div>
  );

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
      <header className="bg-muted/30 border-b border-border/50 sticky top-0 z-50">
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
            <Link to="/dashboard" onClick={() => {}} className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <LayoutTemplate className="w-4 h-4" />Templates
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value as ResumeColorScheme)}
              className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium border-0 focus:ring-2 focus:ring-primary"
            >
              {Object.entries(resumeColorSchemes).map(([key, value]) => (
                <option key={key} value={key}>{value.name}</option>
              ))}
            </select>
            <Button variant="ghost" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline ml-1">Save</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="hero" size="sm" disabled={generating}>
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span className="hidden sm:inline ml-1">PDF</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDownloadPDF(false)}>
                  Full Quality (Larger file)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownloadPDF(true)}>
                  Compressed (Smaller file, same look)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Panel - Editor */}
        <div className="w-full md:w-1/2 border-r border-border bg-card overflow-auto p-6 space-y-4">
          {sections.map((section) => (
            <Collapsible key={section.id} open={section.isOpen} onOpenChange={() => toggleSection(section.id)}>
              <div className={`w-full flex items-center justify-between p-4 rounded-xl bg-muted/50 ${isMuted(section.id) ? "opacity-60" : ""}`}>
                <CollapsibleTrigger className="flex flex-1 items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-icy-blue-600/30 flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold">{section.title}{isMuted(section.id) && <span className="ml-2 text-xs text-muted-foreground">(hidden)</span>}</span>
                  </div>
                  {section.isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CollapsibleTrigger>
                {section.muteable && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleMute(section.id); }}
                    title={isMuted(section.id) ? "Show in resume" : "Hide from resume"}
                    className="ml-3 p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    {isMuted(section.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
              <CollapsibleContent className="p-4 space-y-4">
                {section.id === "personal" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Full Name</Label>
                      <Input placeholder="John Doe" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>Designation (job title — shown right below your name)</Label>
                      <Input placeholder="e.g. Machine Learning Engineer" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>Tagline (short description below the designation)</Label>
                      <Input placeholder="e.g. A passionate AI enthusiast and developer..." value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} />
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
                    <div className="col-span-2 mt-2 rounded-lg border border-border p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Header Style</p>
                        <Button type="button" size="sm" variant="outline" onClick={() => setHeaderStyle(DEFAULT_HEADER_STYLE)}>Reset</Button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs">Name size ({headerStyle.nameSize}px)</Label>
                          <Input type="range" min={14} max={48} value={headerStyle.nameSize} onChange={(e) => setHeaderStyle({ ...headerStyle, nameSize: +e.target.value })} />
                        </div>
                        <div>
                          <Label className="text-xs">Designation size ({headerStyle.designationSize}px)</Label>
                          <Input type="range" min={9} max={28} value={headerStyle.designationSize} onChange={(e) => setHeaderStyle({ ...headerStyle, designationSize: +e.target.value })} />
                        </div>
                        <div>
                          <Label className="text-xs">Tagline size ({headerStyle.taglineSize}px)</Label>
                          <Input type="range" min={8} max={22} value={headerStyle.taglineSize} onChange={(e) => setHeaderStyle({ ...headerStyle, taglineSize: +e.target.value })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Name color</Label>
                          <Input type="color" value={headerStyle.nameColor} onChange={(e) => setHeaderStyle({ ...headerStyle, nameColor: e.target.value })} className="h-9 p-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Designation color</Label>
                          <Input type="color" value={headerStyle.designationColor || theme.primary} onChange={(e) => setHeaderStyle({ ...headerStyle, designationColor: e.target.value })} className="h-9 p-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Tagline color</Label>
                          <Input type="color" value={headerStyle.taglineColor} onChange={(e) => setHeaderStyle({ ...headerStyle, taglineColor: e.target.value })} className="h-9 p-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Header background</Label>
                          <Input type="color" value={headerStyle.bgColor || theme.headerBg} onChange={(e) => setHeaderStyle({ ...headerStyle, bgColor: e.target.value })} className="h-9 p-1" />
                        </div>
                      </div>
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
                      <div className="flex flex-wrap gap-2">
                        <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                        <Button variant="outline" onClick={() => photoInputRef.current?.click()} disabled={photoProcessing !== null}>
                          {photoProcessing === "upload" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
                          {photoUrl ? "Change Photo" : "Upload Photo"}
                        </Button>
                        {photoUrl && (
                          <>
                            <Button variant="outline" size="sm" onClick={handleRemoveBackground} disabled={photoProcessing !== null}>
                              {photoProcessing === "bgremove" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                              Remove Background
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={handleRemovePhoto} disabled={photoProcessing !== null}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Photo size on resume</Label>
                        <span className="text-xs text-muted-foreground">{photoSize}px</span>
                      </div>
                      <Slider value={[photoSize]} min={80} max={220} step={4} onValueChange={([v]) => setPhotoSize(v)} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Photos are stored securely in your account and appear on every device you sign in from. First background removal may take a few seconds while the model loads.
                    </p>
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

                {section.id === "learned" && (
                  <>
                    {learnedExperiences.map((item, i) => (
                      <div key={item.id} className="p-4 border rounded-xl space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Item {i + 1}</span>
                          {learnedExperiences.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => setLearnedExperiences(learnedExperiences.filter((x) => x.id !== item.id))} className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <Input placeholder="Title (e.g. Leadership, Public Speaking)" value={item.title} onChange={(e) => setLearnedExperiences(learnedExperiences.map((x) => (x.id === item.id ? { ...x, title: e.target.value } : x)))} />
                        <Textarea placeholder="What you learned or how you applied it..." value={item.description} onChange={(e) => setLearnedExperiences(learnedExperiences.map((x) => (x.id === item.id ? { ...x, description: e.target.value } : x)))} rows={3} />
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => setLearnedExperiences([...learnedExperiences, { id: Date.now(), title: "", description: "" }])}>
                      <Plus className="w-4 h-4 mr-2" />Add Learned Experience
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
                    <p className="text-xs text-muted-foreground">Drag the handle to reorder. The resume preview updates instantly.</p>
                    {projects.map((project, idx) => (
                      <div
                        key={project.id}
                        draggable={projectDragArmed === project.id}
                        onDragStart={(e) => { setDragProjectIdx(idx); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", String(project.id)); } catch {} }}
                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (dragOverProjectIdx !== idx) setDragOverProjectIdx(idx); }}
                        onDragLeave={() => { if (dragOverProjectIdx === idx) setDragOverProjectIdx(null); }}
                        onDrop={(e) => { e.preventDefault(); if (dragProjectIdx !== null) reorderProjects(dragProjectIdx, idx); setDragProjectIdx(null); setDragOverProjectIdx(null); setProjectDragArmed(null); }}
                        onDragEnd={() => { setDragProjectIdx(null); setDragOverProjectIdx(null); setProjectDragArmed(null); }}
                        className={`p-4 border rounded-xl space-y-3 bg-background transition-colors ${dragOverProjectIdx === idx && dragProjectIdx !== idx ? "border-primary ring-2 ring-primary/30" : ""} ${dragProjectIdx === idx ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onMouseDown={() => setProjectDragArmed(project.id)}
                            onMouseUp={() => setProjectDragArmed((v) => (v === project.id ? null : v))}
                            onTouchStart={() => setProjectDragArmed(project.id)}
                            className="cursor-grab active:cursor-grabbing touch-none p-1 -ml-1 text-muted-foreground hover:text-foreground"
                            aria-label="Drag to reorder project"
                            title="Drag to reorder"
                          >
                            <GripVertical className="w-4 h-4" />
                          </button>
                          <Input placeholder="Project Name" value={project.name} onChange={(e) => setProjects(projects.map((p) => (p.id === project.id ? { ...p, name: e.target.value } : p)))} />
                          <Button variant="ghost" size="icon" onClick={() => setProjects(projects.filter((p) => p.id !== project.id))} aria-label="Remove project">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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

                {section.id === "languages" && (
                  <>
                    {languages.map((lang, i) => (
                      <div key={lang.id} className="p-4 border rounded-xl space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Language {i + 1}</span>
                          {languages.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => setLanguages(languages.filter((x) => x.id !== lang.id))} className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="Language (e.g. Bangla)" value={lang.name} onChange={(e) => setLanguages(languages.map((x) => x.id === lang.id ? { ...x, name: e.target.value } : x))} />
                          <Input placeholder="Proficiency (e.g. Native)" value={lang.level} onChange={(e) => setLanguages(languages.map((x) => x.id === lang.id ? { ...x, level: e.target.value } : x))} />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => setLanguages([...languages, { id: Date.now(), name: "", level: "" }])}>
                      <Plus className="w-4 h-4 mr-2" />Add Language
                    </Button>
                  </>
                )}


                {section.id === "references" && (
                  <>
                    {references.map((ref, i) => (
                      <div key={ref.id} className={`p-4 border rounded-xl space-y-3 ${ref.active === false ? "opacity-60" : ""}`}>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">Reference {i + 1}</span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{ref.active === false ? "Inactive" : "Active"}</span>
                              <Switch
                                checked={ref.active !== false}
                                onCheckedChange={(v) => setReferences(references.map((x) => x.id === ref.id ? { ...x, active: v } : x))}
                              />
                            </div>
                            {references.length > 1 && (
                              <Button variant="ghost" size="sm" onClick={() => setReferences(references.filter((x) => x.id !== ref.id))} className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="Full Name" value={ref.name} onChange={(e) => setReferences(references.map((x) => x.id === ref.id ? { ...x, name: e.target.value } : x))} />
                          <Input placeholder="Designation" value={ref.designation} onChange={(e) => setReferences(references.map((x) => x.id === ref.id ? { ...x, designation: e.target.value } : x))} />
                          <Input placeholder="Organization" value={ref.organization} onChange={(e) => setReferences(references.map((x) => x.id === ref.id ? { ...x, organization: e.target.value } : x))} className="col-span-2" />
                          <Input placeholder="Email" value={ref.email} onChange={(e) => setReferences(references.map((x) => x.id === ref.id ? { ...x, email: e.target.value } : x))} />
                          <Input placeholder="Phone" value={ref.phone} onChange={(e) => setReferences(references.map((x) => x.id === ref.id ? { ...x, phone: e.target.value } : x))} />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => setReferences([...references, { id: Date.now(), name: "", designation: "", organization: "", email: "", phone: "", active: true }])}>
                      <Plus className="w-4 h-4 mr-2" />Add Reference
                    </Button>
                  </>
                )}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Right Panel - Preview */}
        <div ref={previewPaneRef} className="hidden md:flex flex-1 flex-col items-center p-4 bg-muted/30 overflow-auto">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
            <div className="px-3 py-1 rounded-full bg-card border text-xs font-medium text-muted-foreground">
              {activePaper.label} Preview · {pageCount} {pageCount === 1 ? "page" : "pages"}
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-card border">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => setManualPageCount((c) => Math.max(1, c - 1))}
                disabled={manualPageCount <= 1}
                title="Remove last page"
              >
                −
              </Button>
              <span className="text-xs font-medium w-14 text-center">{manualPageCount} {manualPageCount === 1 ? "page" : "pages"}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => setManualPageCount((c) => Math.min(20, c + 1))}
                title="Add a new page"
              >
                +
              </Button>
            </div>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as PaperSize)}
              className="h-8 px-3 rounded-full bg-card border text-xs font-medium text-foreground focus:ring-2 focus:ring-primary"
            >
              {Object.entries(PAPER_SIZES).map(([key, paper]) => (
                <option key={key} value={key}>{paper.label}</option>
              ))}
            </select>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-card border">
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.05).toFixed(2)))}>−</Button>
              <span className="text-xs font-medium w-10 text-center">{Math.round(zoom * 100)}%</span>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.05).toFixed(2)))}>+</Button>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={fitToPage}>Fit</Button>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => setZoom(1)}>100%</Button>
            </div>
          </div>

          <div
            className="fixed top-0 pointer-events-none"
            style={{ left: "-10000px", width: `${activePaper.widthPx}px` }}
            aria-hidden="true"
          >
            {renderResumeContent(resumePreviewRef)}
            {Array.from({ length: pageCount }).map((_, i) => (
              <div
                key={`export-${paperSize}-${i}`}
                ref={(node) => { pageRefs.current[i] = node; }}
                className="relative bg-white overflow-hidden"
                style={{ width: `${activePaper.widthPx}px`, height: `${activePaper.heightPx}px` }}
              >
                <div style={{ paddingTop: `${pageTopPad(i)}px`, height: `${activePaper.heightPx}px`, overflow: "hidden" }}>
                  <div style={{ height: `${pageVisibleContentH(i)}px`, overflow: "hidden" }}>
                    {renderResumeContent(null, pageOffsetY(i), false)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6" style={{ width: `${activePaper.widthPx * zoom}px` }}>
            {Array.from({ length: pageCount }).map((_, i) => (
              <div
                key={`preview-${paperSize}-${i}`}
                style={{ width: `${activePaper.widthPx * zoom}px`, height: `${activePaper.heightPx * zoom}px` }}
              >
                <div
                  className="relative shadow-xl bg-white overflow-hidden"
                  style={{
                    width: `${activePaper.widthPx}px`,
                    height: `${activePaper.heightPx}px`,
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                  }}
                >
                  <div style={{ paddingTop: `${pageTopPad(i)}px`, height: `${activePaper.heightPx}px`, overflow: "hidden" }}>
                    <div style={{ height: `${pageVisibleContentH(i)}px`, overflow: "hidden" }}>
                      {renderResumeContent(null, pageOffsetY(i), true)}
                    </div>
                  </div>
                  {/* Visual gutter indicators */}
                  {i > 0 && (
                    <div className="absolute top-0 left-0 right-0 pointer-events-none border-b border-dashed border-muted-foreground/30" style={{ height: `${ONE_CM_PX}px`, background: "rgba(0,0,0,0.02)" }} />
                  )}
                  {i < pageCount - 1 && (
                    <div className="absolute bottom-0 left-0 right-0 pointer-events-none border-t border-dashed border-muted-foreground/30" style={{ height: `${ONE_CM_PX}px`, background: "rgba(0,0,0,0.02)" }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
