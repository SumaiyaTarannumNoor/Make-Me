// Parse uploaded resume text into structured resume data using Lovable AI Gateway.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You extract structured resume information from raw text.
Return ONLY valid JSON matching this exact schema — omit any field you cannot find (do not invent values):
{
  "fullName": string,
  "email": string,
  "phone": string,
  "location": string,
  "linkedin": string,
  "portfolio": string,
  "designation": string,
  "tagline": string,
  "summary": string,
  "experiences": [{ "company": string, "title": string, "type": string, "startDate": string, "endDate": string, "description": string }],
  "education": [{ "institution": string, "degree": string, "year": string, "grade": string }],
  "skills": [string],
  "projects": [{ "name": string, "description": string, "link": string }],
  "certifications": [string],
  "languages": [{ "name": string, "level": string }]
}
Dates should be short like "Jan 2023". Descriptions may contain newline-separated bullets. Return JSON only, no markdown fences.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'AI gateway not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing resume text' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const trimmed = text.slice(0, 40000);

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Extract resume data from the following text:\n\n${trimmed}` },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error('AI gateway error:', aiRes.status, errText);
      return new Response(JSON.stringify({ error: 'AI parsing failed', status: aiRes.status }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiJson = await aiRes.json();
    const content: string = aiJson?.choices?.[0]?.message?.content ?? '{}';
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch { parsed = {}; }
      }
    }

    return new Response(JSON.stringify({ data: parsed }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('parse-resume error:', err);
    return new Response(JSON.stringify({ error: 'Unexpected error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
