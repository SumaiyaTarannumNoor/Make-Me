import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Sparkles, Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";

type Step = "email" | "otp" | "newPassword";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { email, action: "send" },
      });

      if (error) throw error;

      toast({
        title: "OTP Sent",
        description: "If your email exists in our system, you'll receive a code shortly.",
      });
      setStep("otp");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter a 6-digit code", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { email, otp, action: "verify" },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setResetToken(data.resetToken);
      toast({ title: "OTP Verified", description: "You can now set a new password." });
      setStep("newPassword");
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Must be at least 6 characters", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { email, resetToken, newPassword, action: "reset" },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({
        title: "Password Reset!",
        description: "You can now log in with your new password.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset password",
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
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-neon-pink-400" />
            </div>
            <span className="font-display font-bold text-xl">
              Make<span className="text-gradient">Me</span>
            </span>
          </Link>

          {/* Back Link */}
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          {/* Step: Email */}
          {step === "email" && (
            <>
              <div className="mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">Forgot Password?</h1>
                <p className="text-muted-foreground">Enter your email and we'll send you a verification code.</p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-6">
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
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending...</> : "Send Verification Code"}
                </Button>
              </form>
            </>
          )}

          {/* Step: OTP */}
          {step === "otp" && (
            <>
              <div className="mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">Enter Code</h1>
                <p className="text-muted-foreground">We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span></p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="pl-10 h-12 text-center text-2xl tracking-widest font-mono"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : "Verify Code"}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
                >
                  Didn't receive code? Try again
                </button>
              </form>
            </>
          )}

          {/* Step: New Password */}
          {step === "newPassword" && (
            <>
              <div className="mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">Set New Password</h1>
                <p className="text-muted-foreground">Create a strong password for your account.</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 h-12"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-12"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Resetting...</> : "Reset Password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.3)_100%)]" />
        
        <div className="relative z-10 text-center p-12">
          <div className="w-32 h-32 rounded-2xl gradient-button shadow-glow mx-auto mb-8 flex items-center justify-center animate-float">
            <KeyRound className="w-16 h-16 text-primary-foreground" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Reset your password
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            We'll help you get back into your account securely.
          </p>
        </div>

        <div className="absolute top-20 left-20 w-40 h-40 bg-neon-pink-400/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-indigo-bloom-400/30 rounded-full blur-3xl animate-float-delayed" />
      </div>
    </div>
  );
};

export default ForgotPassword;
