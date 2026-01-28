import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";
import {
  FileText, Sparkles, Plus, Search, MoreHorizontal, Download, Share2, Trash2,
  Edit, Clock, LayoutGrid, List, User, Settings, LogOut, Crown, Loader2,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { resumes, loading, createResume, deleteResume } = useResumes();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateResume = async () => {
    const resume = await createResume();
    if (resume) navigate(`/builder/${resume.id}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCompleteness = (resume: any) => {
    let score = 0;
    if (resume.personal_info && Object.keys(resume.personal_info).length > 0) score += 20;
    if (resume.summary) score += 15;
    if (resume.experience && resume.experience.length > 0) score += 25;
    if (resume.education && resume.education.length > 0) score += 20;
    if (resume.skills && resume.skills.length > 0) score += 20;
    return Math.min(score, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg gradient-button flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary-foreground" />
                </div>
                <Sparkles className="absolute -top-0.5 -right-0.5 w-3 h-3 text-baby-pink" />
              </div>
              <span className="font-display font-bold text-lg">Make<span className="text-gradient">Me</span></span>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="hero" size="sm">
                <Crown className="w-4 h-4 mr-1" />
                Upgrade to Pro
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-icy-blue-400 to-sky-blue-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="font-medium text-sm">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">Free Plan</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile"><User className="w-4 h-4 mr-2" />Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem><Settings className="w-4 h-4 mr-2" />Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">My Resumes</h1>
            <p className="text-muted-foreground mt-1">Create and manage your professional resumes</p>
          </div>
          <Button variant="hero" onClick={handleCreateResume}>
            <Plus className="w-5 h-5 mr-1" />New Resume
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input type="text" placeholder="Search resumes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-11" />
          </div>
          <div className="flex bg-muted rounded-lg p-1">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
          {viewMode === "grid" && (
            <button onClick={handleCreateResume} className="group aspect-[3/4] rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-card/50 hover:bg-card flex flex-col items-center justify-center gap-4 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-icy-blue-600/30 transition-colors">
                <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="font-medium text-muted-foreground group-hover:text-foreground">Create New Resume</span>
            </button>
          )}

          {filteredResumes.map((resume) => {
            const completeness = getCompleteness(resume);
            return viewMode === "grid" ? (
              <div key={resume.id} className="group relative aspect-[3/4] rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-card-hover overflow-hidden transition-all">
                <div className="absolute inset-0 p-4 bg-gradient-to-br from-icy-blue-600/20 to-pastel-petal-600/20">
                  <div className="w-full h-full bg-card rounded-lg shadow-sm p-3">
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-full bg-muted" />
                      <div className="h-2 bg-muted rounded w-2/3" />
                      <div className="h-2 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="flex gap-2 w-full">
                    <Link to={`/builder/${resume.id}`} className="flex-1">
                      <Button variant="hero" size="sm" className="w-full"><Edit className="w-4 h-4 mr-1" />Edit</Button>
                    </Link>
                    <Button variant="glass" size="sm"><Download className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-foreground truncate">{resume.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />{new Date(resume.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md hover:bg-muted"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Share2 className="w-4 h-4 mr-2" />Share</DropdownMenuItem>
                        <DropdownMenuItem><Download className="w-4 h-4 mr-2" />Download</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteResume(resume.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Completeness</span>
                      <span className="font-medium text-foreground">{completeness}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full gradient-button rounded-full transition-all" style={{ width: `${completeness}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div key={resume.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all">
                <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-icy-blue-600/20 to-pastel-petal-600/20 flex-shrink-0 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{resume.title}</h3>
                  <p className="text-sm text-muted-foreground">Updated {new Date(resume.updated_at).toLocaleDateString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-32">
                      <div className="h-full gradient-button rounded-full" style={{ width: `${completeness}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{completeness}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/builder/${resume.id}`}><Button variant="hero" size="sm"><Edit className="w-4 h-4 mr-1" />Edit</Button></Link>
                  <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteResume(resume.id)}><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>

        {filteredResumes.length === 0 && resumes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">No resumes yet</h3>
            <p className="text-muted-foreground mb-6">Create your first resume to get started</p>
            <Button variant="hero" onClick={handleCreateResume}>
              <Plus className="w-5 h-5 mr-1" />Create Resume
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
