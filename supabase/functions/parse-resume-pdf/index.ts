// Parse resume text into structured JSON via Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `You extract structured resume data from raw text.
Return ONLY valid JSON matching this exact shape (no prose, no markdown):
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "portfolio": "", "designation": "", "tagline": "" },
  "summary": "",
  "experience": [{ "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "description": "" }],
  "education": [{ "degree": "", "institution": "", "location": "", "startDate": "", "endDate": "", "gpa": "" }],
  "skills": ["skill1", "skill2"],
  "projects": [{ "name": "", "description": "", "technologies": "", "link": "" }],
  "certifications": ["cert1"],
  "languages": [{ "name": "", "proficiency": "" }],
  "references": [{ "name": "", "title": "", "company": "", "email": "", "phone": "" }]
}
Rules:
- If a field is unknown, use empty string "" (or [] for arrays).
- Keep dates in the format found (e.g. "Jan 2023", "2020-2024").
- description fields may include newlines / bullets.
- Do NOT invent data. Extract only what is present.
- "designation" = job title / role headline (e.g. "Machine Learning Engineer").
- "tagline" = short career summary sentence if separate from summary.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'text'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const truncated = text.slice(0, 25000);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Extract structured data from this resume text:\n\n${truncated}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const errTxt = await res.text();
      if (res.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (res.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway ${res.status}: ${errTxt}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {};
    }

    return new Response(JSON.stringify({ resume: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("parse-resume-pdf error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
