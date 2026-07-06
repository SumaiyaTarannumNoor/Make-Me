import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state ?? {}) as { email?: string; notice?: string };
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(routeState.email ?? "");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notice] = useState<string | null>(routeState.notice ?? null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;
    setIsLoading(true);
    try {
      await signUp(email, password, name);
      navigate("/dashboard");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.3)_100%)]" />
        <div className="relative z-10 text-center p-12">
          <div className="w-32 h-32 rounded-2xl gradient-pink shadow-glow mx-auto mb-8 flex items-center justify-center animate-float">
            <Sparkles className="w-16 h-16 text-primary-foreground" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Start your journey</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">Join thousands of students building professional resumes with ease.</p>

          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-aquamarine-500">10K+</p>
              <p className="text-sm text-muted-foreground">Users</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-turquoise-500">50K+</p>
              <p className="text-sm text-muted-foreground">Resumes</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-pearl-aqua-500">95%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-turquoise-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-royal-violet-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/3 left-10 w-32 h-32 bg-slate-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-fresh-sky-500/20 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src={logo} alt="MakeMe Logo" className="w-10 h-10 object-cover rounded-full" />
            <span className="font-display font-bold text-xl">
              Make<span className="text-gradient">Me</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create your account</h1>
            <p className="text-muted-foreground">Start building your professional resume today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-12" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-12" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                I agree to the{" "}
                <Link to="/terms" className="text-sky-surge-500 hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-sky-surge-500 hover:underline">Privacy Policy</Link>
              </Label>
            </div>
            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading || !agreedToTerms}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-aquamarine-500 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
