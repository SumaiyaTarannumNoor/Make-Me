import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Lock, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") { setIsValidSession(true); setChecking(false); }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsValidSession(true);
      setChecking(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast({ title: "Passwords don't match", variant: "destructive" }); return; }
    if (newPassword.length < 6) { toast({ title: "Password too short", description: "Must be at least 6 characters", variant: "destructive" }); return; }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Password updated!", description: "You can now log in with your new password." });
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error: any) {
      toast({ title: "Reset failed", description: error.message, variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  if (checking) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-pearl-aqua-500" /></div>;

  if (!isValidSession) return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="font-display text-2xl font-bold text-foreground">Invalid or expired link</h1>
        <p className="text-muted-foreground">This password reset link is invalid or has expired.</p>
        <Link to="/forgot-password"><Button variant="hero">Request a new reset link</Button></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-aquamarine-500" />
            </div>
            <span className="font-display font-bold text-xl">Make<span className="text-gradient">Me</span></span>
          </Link>
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Set New Password</h1>
            <p className="text-muted-foreground">Create a strong password for your account.</p>
          </div>
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="newPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-10 pr-10 h-12" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-12" required minLength={6} />
              </div>
            </div>
            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Updating...</> : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.3)_100%)]" />
        <div className="relative z-10 text-center p-12">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-royal-violet-500 to-indigo-bloom-500 shadow-glow mx-auto mb-8 flex items-center justify-center animate-float">
            <KeyRound className="w-16 h-16 text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Almost there!</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">Set your new password and get back to building your resume.</p>
        </div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-slate-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-aquamarine-500/20 rounded-full blur-3xl animate-float-delayed" />
      </div>
    </div>
  );
};

export default ResetPassword;
