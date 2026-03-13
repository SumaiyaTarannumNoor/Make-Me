import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Sparkles, Mail, KeyRound, ArrowLeft, Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    try {
      // Check if email exists in the database
      const { data, error } = await supabase.functions.invoke("check-email", {
        body: { email },
      });

      if (error) throw error;

      if (!data.exists) {
        toast({
          title: "No matched User email",
          description: "Please Complete Registration.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Email exists — send Supabase password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setEmailSent(true);
      toast({
        title: "Reset link sent!",
        description: "Check your email for a password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-sky-aqua-500" />
            </div>
            <span className="font-display font-bold text-xl">
              Make<span className="text-gradient">Me</span>
            </span>
          </Link>

          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />Back to login
          </Link>

          {!emailSent ? (
            <>
              <div className="mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">Forgot Password?</h1>
                <p className="text-muted-foreground">Enter your registered email and we'll send you a reset link.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" />Checking...</>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-electric-sapphire-500/20 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-electric-sapphire-500" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">Check your email</h1>
              <p className="text-muted-foreground">
                We sent a password reset link to <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Didn't receive it? Check your spam folder or{" "}
                <button onClick={() => setEmailSent(false)} className="text-neon-pink-500 hover:underline">
                  try again
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.3)_100%)]" />
        <div className="relative z-10 text-center p-12">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-electric-sapphire-500 to-indigo-bloom-500 shadow-glow mx-auto mb-8 flex items-center justify-center animate-float">
            <KeyRound className="w-16 h-16 text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Reset your password</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">We'll help you get back into your account securely.</p>
        </div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-energy-400/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-raspberry-plum-400/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-sky-aqua-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-10 w-24 h-24 bg-vivid-royal-400/30 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default ForgotPassword;
