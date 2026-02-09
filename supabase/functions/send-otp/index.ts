import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory OTP storage (in production, use a database table)
const otpStore = new Map<string, { otp: string; expiry: number }>();

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (to: string, otp: string): Promise<void> => {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    throw new Error("Email service not configured");
  }

  console.log("Attempting to send email to:", to);
  console.log("Using API key starting with:", RESEND_API_KEY.substring(0, 10) + "...");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "MakeMe Resume <onboarding@resend.dev>",
      to: [to],
      subject: "Your Password Reset Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
        </head>
        <body style="font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #f72585 0%, #b5179e 50%, #7209b7 100%); padding: 40px; margin: 0;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.15);">
            <h1 style="font-size: 24px; font-weight: 700; color: #170225; margin: 0 0 8px 0;">Password Reset</h1>
            <p style="color: #666; margin: 0 0 24px 0;">Use this code to reset your password:</p>
            
            <div style="background: linear-gradient(135deg, #f72585 0%, #7209b7 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: white;">${otp}</span>
            </div>
            
            <p style="color: #888; font-size: 14px; margin: 0;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
          </div>
        </body>
        </html>
      `,
    }),
  });

  const responseText = await res.text();
  console.log("Resend API response status:", res.status);
  console.log("Resend API response:", responseText);

  if (!res.ok) {
    console.error("Resend error:", responseText);
    
    // Parse error for more detail
    try {
      const errorData = JSON.parse(responseText);
      if (errorData.statusCode === 403) {
        throw new Error("Email domain not verified. Please verify your domain in Resend dashboard.");
      }
      throw new Error(errorData.message || "Failed to send email");
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error("Failed to send email: " + responseText);
      }
      throw e;
    }
  }

  console.log("Email sent successfully to:", to);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email, action, otp, resetToken, newPassword } = body;

    console.log("Received request:", { email, action });

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === "send") {
      // Check if user exists
      const { data: users, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) {
        console.error("Error listing users:", userError);
        return new Response(
          JSON.stringify({ error: "Failed to verify email" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const userExists = users.users.some(u => u.email?.toLowerCase() === email.toLowerCase());
      console.log("User exists check:", userExists, "for email:", email);
      
      if (!userExists) {
        // For security, still return success but don't send email
        console.log("User not found, returning fake success for security");
        return new Response(
          JSON.stringify({ success: true, message: "If email exists, OTP has been sent" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Generate OTP
      const newOtp = generateOTP();
      const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Store OTP
      otpStore.set(email.toLowerCase(), { otp: newOtp, expiry });
      console.log("OTP stored for email:", email.toLowerCase());

      // Send email
      try {
        await sendEmail(email, newOtp);
        console.log("OTP email sent successfully to:", email);
      } catch (emailError: any) {
        console.error("Failed to send email:", emailError);
        return new Response(
          JSON.stringify({ error: emailError.message || "Failed to send email. Please try again." }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "OTP sent successfully" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } 
    
    if (action === "verify") {
      const stored = otpStore.get(email.toLowerCase());

      if (!stored) {
        return new Response(
          JSON.stringify({ error: "No OTP found for this email. Please request a new one." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (Date.now() > stored.expiry) {
        otpStore.delete(email.toLowerCase());
        return new Response(
          JSON.stringify({ error: "OTP has expired. Please request a new one." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (stored.otp !== otp) {
        return new Response(
          JSON.stringify({ error: "Invalid OTP. Please try again." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // OTP verified, generate a token for password reset
      const newResetToken = crypto.randomUUID();
      otpStore.set(`reset_${email.toLowerCase()}`, { otp: newResetToken, expiry: Date.now() + 15 * 60 * 1000 });
      otpStore.delete(email.toLowerCase());

      return new Response(
        JSON.stringify({ success: true, resetToken: newResetToken }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (action === "reset") {
      const stored = otpStore.get(`reset_${email.toLowerCase()}`);

      if (!stored || stored.otp !== resetToken || Date.now() > stored.expiry) {
        return new Response(
          JSON.stringify({ error: "Invalid or expired reset token. Please start over." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Get user and update password
      const { data: users } = await supabase.auth.admin.listUsers();
      const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

      if (!user) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });

      if (updateError) {
        console.error("Error updating password:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update password" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      otpStore.delete(`reset_${email.toLowerCase()}`);

      return new Response(
        JSON.stringify({ success: true, message: "Password updated successfully" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
