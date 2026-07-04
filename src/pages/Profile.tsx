import { useState, useRef, useEffect } from "react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { resizeImage, uploadPhoto, getPhotoUrl, removeImageBackground } from "@/lib/photoUpload";
import {
  User, Mail, Phone, MapPin, Linkedin, Globe, Save, ArrowLeft, Loader2, Camera, Trash2,
} from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoProcessing, setPhotoProcessing] = useState<null | "upload" | "bgremove">(null);
  const [formData, setFormData] = useState({
    full_name: "", phone: "", location: "", linkedin: "", portfolio: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "", phone: profile.phone || "",
        location: profile.location || "", linkedin: profile.linkedin || "",
        portfolio: profile.portfolio || "",
      });
      if (profile.avatar_url) {
        getPhotoUrl("avatars", profile.avatar_url).then((u) => u && setPhotoUrl(u));
      } else {
        setPhotoUrl(null);
      }
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); await updateProfile(formData); setSaving(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setPhotoProcessing("upload");
    try {
      const resized = await resizeImage(file, 512);
      const path = await uploadPhoto("avatars", user.id, "avatar", resized);
      const url = await getPhotoUrl("avatars", path);
      if (url) setPhotoUrl(url);
      await updateProfile({ avatar_url: path });
    } catch (err: unknown) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    } finally {
      setPhotoProcessing(null);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const handleRemoveBackground = async () => {
    if (!photoUrl || !user) return;
    setPhotoProcessing("bgremove");
    try {
      const resp = await fetch(photoUrl);
      const blob = await resp.blob();
      const cleaned = await removeImageBackground(blob);
      const path = await uploadPhoto("avatars", user.id, "avatar", cleaned);
      const url = await getPhotoUrl("avatars", path);
      if (url) setPhotoUrl(url);
      await updateProfile({ avatar_url: path });
    } catch (err: unknown) {
      toast({ title: "Background removal failed", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    } finally {
      setPhotoProcessing(null);
    }
  };

  const handleRemovePhoto = async () => {
    setPhotoUrl(null);
    await updateProfile({ avatar_url: null });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen">
      <header className="bg-muted/30 border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" /><span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="MakeMe Logo" className="w-10 h-10 object-cover rounded-full" />
                <span className="font-display font-bold text-lg">Make<span className="text-gradient">Me</span></span>
              </Link>
            </div>
            <Button variant="ghost" onClick={signOut}>Log out</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-card rounded-2xl border border-border p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cloudy-sky-400 to-aquamarine-500 flex items-center justify-center overflow-hidden">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-primary-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-foreground">{profile?.full_name || "Your Profile"}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                <Button type="button" variant="outline" size="sm" onClick={() => photoInputRef.current?.click()} disabled={photoProcessing !== null}>
                  {photoProcessing === "upload" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
                  {photoUrl ? "Change" : "Upload photo"}
                </Button>
                {photoUrl && (
                  <>
                    <Button type="button" variant="outline" size="sm" onClick={handleRemoveBackground} disabled={photoProcessing !== null}>
                      {photoProcessing === "bgremove" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Remove background
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={handleRemovePhoto} disabled={photoProcessing !== null}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="full_name" placeholder="John Doe" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="pl-10 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="email" type="email" value={user?.email || ""} disabled className="pl-10 h-12 bg-muted" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="phone" placeholder="+880 1234-567890" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="pl-10 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="location" placeholder="Dhaka, Bangladesh" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="pl-10 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="linkedin" placeholder="linkedin.com/in/johndoe" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="pl-10 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="portfolio" placeholder="johndoe.com" value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} className="pl-10 h-12" />
                </div>
              </div>
            </div>
            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={saving}>
              {saving ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Saving...</> : <><Save className="w-5 h-5 mr-2" />Save Profile</>}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
