import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Eye, EyeOff, Mail, Lock } from "lucide-react";
import logo from "@/assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src={logo} alt="MakeMe Logo" className="w-10 h-10 object-cover rounded-full" />
            <span className="font-display font-bold text-xl">
              Make<span className="text-gradient">Me</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Log in to continue building your resume</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" required />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-pearl-aqua-500 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-aquamarine-500 font-medium hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.3)_100%)]" />
        <div className="relative z-10 text-center p-12">
          <div className="w-32 h-32 rounded-2xl gradient-button shadow-glow mx-auto mb-8 flex items-center justify-center animate-float">
            <img src={logo} alt="MakeMe Logo" className="w-20 h-20 object-cover rounded-full" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Your resume, reimagined</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">Professional tools to help you craft the perfect resume and land your dream job.</p>
        </div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-aquamarine-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-royal-violet-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-turquoise-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-indigo-bloom-500/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Login;
