import { Mail, Phone, MapPin, Linkedin, Globe, User } from "lucide-react";

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  tagline: string;
  summary: string;
  experience: {
    id: number;
    company: string;
    title: string;
    type: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    id: number;
    institution: string;
    degree: string;
    year: string;
    grade: string;
  }[];
  skills: { category: string; items: string[] }[];
  projects: {
    id: number;
    name: string;
    description: string;
    link: string;
  }[];
  certifications: string[];
}

interface ResumeTemplatePreviewProps {
  data: ResumeData;
  colorScheme: "coral" | "royal-blue";
  className?: string;
}

const ResumeTemplatePreview = ({ data, colorScheme, className = "" }: ResumeTemplatePreviewProps) => {
  const colors = {
    coral: {
      primary: "hsl(16, 100%, 66%)",
      light: "hsl(16, 100%, 94%)",
      dark: "hsl(16, 100%, 26%)",
      headerBg: "hsl(220, 20%, 20%)",
      sectionTitle: "hsl(16, 100%, 66%)",
    },
    "royal-blue": {
      primary: "hsl(225, 73%, 57%)",
      light: "hsl(225, 73%, 92%)",
      dark: "hsl(225, 73%, 23%)",
      headerBg: "hsl(220, 20%, 20%)",
      sectionTitle: "hsl(225, 73%, 57%)",
    },
  };

  const theme = colors[colorScheme];

  return (
    <div className={`bg-white text-gray-800 text-xs ${className}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header Section - Dark background */}
      <div className="px-6 py-5" style={{ backgroundColor: theme.headerBg }}>
        {/* Profile and Name */}
        <div className="flex items-center gap-4 mb-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: theme.primary }}
          >
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              {data.fullName || "YOUR NAME"}
            </h1>
            <p className="text-gray-300 text-sm mt-0.5">
              {data.tagline || "A passionate professional ready to make an impact"}
            </p>
          </div>
        </div>

        {/* Contact Row */}
        <div className="flex flex-wrap gap-4 text-gray-300">
          {data.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              <span className="text-[10px]">{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              <span className="text-[10px]">{data.phone}</span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              <span className="text-[10px]">{data.location}</span>
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              <span className="text-[10px]">{data.linkedin}</span>
            </div>
          )}
          {data.portfolio && (
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              <span className="text-[10px]">{data.portfolio}</span>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex">
        {/* Left Column - 60% */}
        <div className="w-[60%] p-5 pr-4">
          {/* Work Experience */}
          <div className="mb-5">
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
              style={{ color: theme.sectionTitle, borderColor: theme.primary }}
            >
              Work Experience
            </h2>
            <div className="space-y-3">
              {data.experience.filter(e => e.company || e.title).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {exp.title || "Job Title"} {exp.type && `(${exp.type})`}
                      </h3>
                      <p className="text-gray-600 text-[10px]">{exp.company}</p>
                    </div>
                    <span className="text-[9px] text-gray-500 whitespace-nowrap">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  {exp.description && (
                    <ul className="mt-1.5 text-[10px] text-gray-600 space-y-0.5">
                      {exp.description.split("\n").filter(Boolean).map((line, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span style={{ color: theme.primary }}>•</span>
                          <span>{line.replace(/^[•\-]\s*/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {data.experience.filter(e => e.company || e.title).length === 0 && (
                <p className="text-gray-400 italic text-[10px]">Add your work experience...</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
              style={{ color: theme.sectionTitle, borderColor: theme.primary }}
            >
              Education
            </h2>
            <div className="space-y-2">
              {data.education.filter(e => e.institution || e.degree).map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-[11px]">{edu.degree || "Degree"}</h3>
                    <p className="text-gray-600 text-[10px]">{edu.institution}</p>
                    {edu.grade && <p className="text-gray-500 text-[9px]">CGPA: {edu.grade}</p>}
                  </div>
                  <span className="text-[9px] text-gray-500">{edu.year}</span>
                </div>
              ))}
              {data.education.filter(e => e.institution || e.degree).length === 0 && (
                <p className="text-gray-400 italic text-[10px]">Add your education...</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - 40% */}
        <div className="w-[40%] p-5 pl-4" style={{ backgroundColor: theme.light }}>
          {/* Skills */}
          <div className="mb-5">
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
              style={{ color: theme.sectionTitle, borderColor: theme.primary }}
            >
              Skills
            </h2>
            <div className="space-y-2">
              {data.skills.map((skillGroup, i) => (
                <div key={i}>
                  {skillGroup.category && (
                    <p className="font-medium text-gray-700 text-[10px] mb-1">{skillGroup.category}</p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {skillGroup.items.map((skill, j) => (
                      <span
                        key={j}
                        className="px-1.5 py-0.5 rounded text-[9px] text-gray-700"
                        style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {data.skills.length === 0 && (
                <p className="text-gray-400 italic text-[10px]">Add your skills...</p>
              )}
            </div>
          </div>

          {/* Projects */}
          {data.projects.length > 0 && (
            <div className="mb-5">
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                style={{ color: theme.sectionTitle, borderColor: theme.primary }}
              >
                Projects
              </h2>
              <div className="space-y-2">
                {data.projects.filter(p => p.name).map((project) => (
                  <div key={project.id}>
                    <h3 className="font-semibold text-gray-900 text-[10px]">{project.name}</h3>
                    <p className="text-gray-600 text-[9px]">{project.description}</p>
                    {project.link && (
                      <p className="text-[8px]" style={{ color: theme.primary }}>{project.link}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div>
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                style={{ color: theme.sectionTitle, borderColor: theme.primary }}
              >
                Training & Certificates
              </h2>
              <ul className="space-y-1">
                {data.certifications.map((cert, i) => (
                  <li key={i} className="flex items-start gap-1 text-[10px] text-gray-700">
                    <span style={{ color: theme.primary }}>•</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplatePreview;
