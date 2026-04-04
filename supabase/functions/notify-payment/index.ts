import { corsHeaders } from "@supabase/supabase-js/cors";

const ADMIN_BKASH_NUMBER = "01755945946";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userEmail, transactionId } = await req.json();

    // Log the payment notification (admin will see this in the dashboard)
    console.log(
      `[PAYMENT NOTIFICATION] New premium payment received!\n` +
      `User: ${userEmail}\n` +
      `Transaction ID: ${transactionId}\n` +
      `Admin bKash: ${ADMIN_BKASH_NUMBER}\n` +
      `Action: Login to admin panel to verify and activate premium.`
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment notification recorded. Admin will verify shortly.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
