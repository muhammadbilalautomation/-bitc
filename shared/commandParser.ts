export type CommandIntent = "investment" | "export";

export type ParsedCommand = {
  intent: CommandIntent;
  country: string;
  sector: string;
  count: number;
  raw: string;
};

const countryMap: Array<[RegExp, string]> = [
  [/\b(?:uae|united arab emirates|dubai)\b/i, "United Arab Emirates"],
  [/\b(?:south africa|rsa)\b/i, "South Africa"],
  [/\b(?:kenya)\b/i, "Kenya"],
  [/\b(?:india)\b/i, "India"],
  [/\b(?:china)\b/i, "China"],
  [/\b(?:botswana)\b/i, "Botswana"],
];

const sectorMap: Array<[RegExp, string]> = [
  [/renewable energy|solar|energy|power|infrastructure/i, "Energy & infrastructure"],
  [/mining|minerals|diamond|copper|coal|uranium/i, "Mining & mineral beneficiation"],
  [/agriculture|agribusiness|food|beef|leather/i, "Agriculture & food processing"],
  [/technology|tech|software|ict|digital/i, "ICT & innovation"],
  [/health|pharma|medical/i, "Health"],
  [/finance|financial|bank|investment fund/i, "Financial & business services"],
  [/logistics|freight|cargo|warehouse|transport/i, "Cargo, freight & logistics"],
];

export function parseThaboCommand(input: string): ParsedCommand {
  const raw = input.trim();
  const lower = raw.toLowerCase();
  const intent: CommandIntent = /buyer|buyers|export|importer|distributor|market access|purchase|purchas/i.test(lower) ? "export" : "investment";
  const country = countryMap.find(([pattern]) => pattern.test(raw))?.[1] ?? "United Arab Emirates";
  const sector = sectorMap.find(([pattern]) => pattern.test(raw))?.[1] ?? "Energy & infrastructure";
  const countMatch = raw.match(/\b([1-9]|10)\b/);
  const count = countMatch ? Number(countMatch[1]) : 3;

  return { intent, country, sector, count, raw };
}
