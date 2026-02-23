import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { candidate, job } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are a job matching expert. Calculate compatibility between a candidate and job based on skill overlap, experience, location, and job description similarity.",
          },
          {
            role: "user",
            content: `Calculate compatibility score.\n\nCandidate:\nSkills: ${(candidate.skills || []).join(", ")}\nExperience: ${candidate.experience_years || 0} years\nLocation: ${candidate.location || "Unknown"}\nBio: ${candidate.bio || ""}\n\nJob:\nTitle: ${job.title}\nDescription: ${job.description || ""}\nRequired Skills: ${(job.skills_required || []).join(", ")}\nLocation: ${job.location || "Unknown"}\nSalary: ${job.salary_range || "Not specified"}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_score",
              description: "Return compatibility score and summary",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "0-100 compatibility percentage" },
                  summary: { type: "string", description: "One sentence explaining the match" },
                  strengths: { type: "array", items: { type: "string" }, description: "Top 3 matching strengths" },
                },
                required: ["score", "summary", "strengths"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_score" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : { score: 0, summary: "", strengths: [] };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("compatibility-score error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
