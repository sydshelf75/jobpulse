import * as cheerio from 'cheerio';

export interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  experience?: string;
  salary?: string;
  url: string;
  source: string;
  postedAt?: string;
  tags?: string[];
}

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

// 1. Naukri - scrape search results page
export async function scrapeNaukri(query: string, location?: string): Promise<ScrapedJob[]> {
  try {
    const slug = query.toLowerCase().replace(/\s+/g, '-');
    const locSlug = location ? location.toLowerCase().replace(/\s+/g, '-') : '';
    const url = locSlug
      ? `https://www.naukri.com/${slug}-jobs-in-${locSlug}`
      : `https://www.naukri.com/${slug}-jobs`;

    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    $('article.jobTuple, .cust-job-tuple, .srp-jobtuple-wrapper').each((_, el) => {
      const $el = $(el);
      const title = $el.find('.title, .jobTitle, a[class*=title]').first().text().trim();
      const company = $el.find('.comp-name, .companyName, [class*=comp]').first().text().trim();
      const loc = $el.find('.locWdth, .location, [class*=loc]').first().text().trim();
      const exp = $el.find('.expwdth, [class*=exp]').first().text().trim();
      const sal = $el.find('.sal, [class*=sal]').first().text().trim();
      const href = $el.find('a[href*=naukri]').first().attr('href') ?? '';
      if (title && company) {
        jobs.push({
          title,
          company,
          location: loc,
          experience: exp || undefined,
          salary: sal || undefined,
          url: href.startsWith('http') ? href : `https://www.naukri.com${href}`,
          source: 'Naukri',
        });
      }
    });
    return jobs.slice(0, 5);
  } catch { return []; }
}

// 2. RemoteOK - free public API, no auth
export async function scrapeRemoteOK(query: string): Promise<ScrapedJob[]> {
  try {
    const res = await fetch('https://remoteok.com/api', {
      headers: { ...HEADERS, 'Accept': 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json() as Array<{
      position?: string;
      company?: string;
      location?: string;
      tags?: string[];
      url?: string;
      date?: string;
      salary_min?: number;
      salary_max?: number;
    }>;
    const q = query.toLowerCase();
    return data
      .filter(j => j.position && (
        j.position.toLowerCase().includes(q) ||
        j.tags?.some(t => t.toLowerCase().includes(q))
      ))
      .slice(0, 5)
      .map(j => ({
        title: j.position ?? '',
        company: j.company ?? '',
        location: j.location ?? 'Remote',
        salary: j.salary_min
          ? `$${j.salary_min.toLocaleString()}–$${(j.salary_max ?? j.salary_min).toLocaleString()}`
          : undefined,
        tags: j.tags?.slice(0, 4),
        url: j.url ?? 'https://remoteok.com',
        source: 'RemoteOK',
        postedAt: j.date,
      }));
  } catch { return []; }
}

// 3. ArbeitNow - free public API, no auth, worldwide jobs
export async function scrapeArbeitNow(query: string): Promise<ScrapedJob[]> {
  try {
    const res = await fetch(
      `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(query)}&page=1`,
      { headers: HEADERS },
    );
    if (!res.ok) return [];
    const data = await res.json() as {
      data: Array<{
        title: string;
        company_name: string;
        location: string;
        tags: string[];
        url: string;
        created_at: string;
        remote: boolean;
      }>;
    };
    return (data.data ?? []).slice(0, 5).map(j => ({
      title: j.title,
      company: j.company_name,
      location: j.remote ? 'Remote' : j.location,
      tags: j.tags?.slice(0, 4),
      url: j.url,
      source: 'ArbeitNow',
      postedAt: j.created_at,
    }));
  } catch { return []; }
}

// 4. Wellfound (AngelList) - scrape public search
export async function scrapeWellfound(query: string): Promise<ScrapedJob[]> {
  try {
    const res = await fetch(`https://wellfound.com/jobs?q=${encodeURIComponent(query)}`, {
      headers: HEADERS,
    });
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    $('[class*=JobListing], [data-test*=job], .job-listing').each((_, el) => {
      const $el = $(el);
      const title = $el.find('h2, h3, [class*=title], [class*=Title]').first().text().trim();
      const company = $el.find('[class*=company], [class*=Company], [class*=startup]').first().text().trim();
      const loc = $el.find('[class*=location], [class*=Location]').first().text().trim();
      const sal = $el.find('[class*=salary], [class*=Salary], [class*=comp]').first().text().trim();
      const href = $el.find('a').first().attr('href') ?? '';
      if (title && company) {
        jobs.push({
          title,
          company,
          location: loc || 'Remote',
          salary: sal || undefined,
          url: href.startsWith('http') ? href : `https://wellfound.com${href}`,
          source: 'Wellfound',
        });
      }
    });
    return jobs.slice(0, 5);
  } catch { return []; }
}

// Aggregate all sources in parallel
export async function searchAllPlatforms(query: string, location?: string): Promise<ScrapedJob[]> {
  const [naukri, remoteok, arbeit, wellfound] = await Promise.allSettled([
    scrapeNaukri(query, location),
    scrapeRemoteOK(query),
    scrapeArbeitNow(query),
    scrapeWellfound(query),
  ]);
  return [
    ...(naukri.status === 'fulfilled' ? naukri.value : []),
    ...(remoteok.status === 'fulfilled' ? remoteok.value : []),
    ...(arbeit.status === 'fulfilled' ? arbeit.value : []),
    ...(wellfound.status === 'fulfilled' ? wellfound.value : []),
  ];
}

export function formatJobsForClaude(jobs: ScrapedJob[]): string {
  if (!jobs.length) return 'No live jobs found right now. Try different keywords.';
  return jobs.map((j, i) => [
    `${i + 1}. **${j.title}** — ${j.company} _(${j.source})_`,
    j.location ? `   📍 ${j.location}` : '',
    j.experience ? `   💼 ${j.experience}` : '',
    j.salary ? `   💰 ${j.salary}` : '',
    j.tags?.length ? `   🏷 ${j.tags.join(', ')}` : '',
    `   🔗 ${j.url}`,
  ].filter(Boolean).join('\n')).join('\n\n');
}
