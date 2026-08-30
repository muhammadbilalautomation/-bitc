export type ResearchReportItem = {
  name: string;
  businessEmail?: string;
  businessPhone?: string;
};

export function formatResearchReport(items: ResearchReportItem[]) {
  const names = items.slice(0, 4).map(item => item.name).join(", ");
  const contactFields = items.reduce((total, item) => total + Number(Boolean(item.businessEmail)) + Number(Boolean(item.businessPhone)), 0);
  return `Research complete: ${items.length} companies found — ${names}. Public fields captured (not saved to an external system): company, website, sector, source, and ${contactFields} unverified contact hints. Every source needs human review.`;
}
