export type SerpResearchRequest = {
  country: string;
  sector: string;
  intent: "investment" | "export";
  count: number;
};

export type SerpResearchResult = {
  name: string;
  website: string;
  country: string;
  sector: string;
  contact: string;
  source: string;
  businessEmail?: string;
  businessPhone?: string;
  contactVerified: false;
  fact: string;
  fit: string;
  confidence: "High" | "Medium";
  isDemo: boolean;
};

type SerpOrganicResult = {
  title?: string;
  link?: string;
  snippet?: string;
  displayed_link?: string;
};

function extractEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/i)?.[0];
}

function extractPhone(text: string) {
  return text.match(/(?:\\+?\\d[\\d .()\\-]{7,}\\d)/)?.[0]?.trim();
}

function cleanName(title: string) {
  return title.replace(/\s+[|—-].*$/, "").trim() || title;
}

function demoFallback(request: SerpResearchRequest): SerpResearchResult[] {
  return ["BITC demo prospect", "Botswana market opportunity", "Public research placeholder"].slice(0, request.count).map<SerpResearchResult>((name, index) => ({
    name,
    website: "https://www.bitc.co.bw/",
    country: request.country,
    sector: request.sector,
    contact: "https://www.bitc.co.bw/",
    source: "https://www.bitc.co.bw/",
    businessEmail: undefined,
    businessPhone: undefined,
    contactVerified: false,
    fact: "Demo fallback record. Connect and verify a live public source before any outreach.",
    fit: request.intent === "export" ? "Demo-only export buyer placeholder." : "Demo-only investment prospect placeholder.",
    confidence: (index === 0 ? "High" : "Medium") as "High" | "Medium",
    isDemo: true,
  }));
}

export async function searchPublicProspects(request: SerpResearchRequest): Promise<SerpResearchResult[]> {
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) return demoFallback(request);

  const target = request.intent === "export" ? "buyers importers distributors" : "investors investment funds companies";
  const query = `${target} ${request.sector} ${request.country}`;
  const params = new URLSearchParams({
    engine: "google",
    q: query,
    num: String(Math.min(Math.max(request.count, 1), 10)),
    api_key: apiKey,
  });

  const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
  const body = await response.json() as { organic_results?: SerpOrganicResult[]; error?: string };
  if (!response.ok) return demoFallback(request);

  const liveResults = (body.organic_results ?? [])
    .filter(item => item.title && item.link)
    .slice(0, request.count)
    .map<SerpResearchResult>((item, index) => {
      const source = item.link as string;
      const name = cleanName(item.title as string);
      const snippet = item.snippet?.trim() || "";
      const fact = snippet || "Public search result found; verify details on the source page before outreach.";
      return {
        name,
        website: source,
        country: request.country,
        sector: request.sector,
        contact: source,
        source,
        businessEmail: extractEmail(snippet),
        businessPhone: extractPhone(snippet),
        contactVerified: false,
        fact,
        fit: request.intent === "export"
          ? `Potential export-buyer lead for Botswana’s ${request.sector.toLowerCase()} opportunities; verify buying mandate and contact route.`
          : `Potential investment lead for Botswana’s ${request.sector.toLowerCase()} opportunities; verify investment mandate and contact route.`,
        confidence: index === 0 ? "High" : "Medium",
        isDemo: false,
      };
    });

  return liveResults.length > 0 ? liveResults : demoFallback(request);
}
