const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY!;
const JSEARCH_BASE = 'https://jsearch.p.rapidapi.com';

export interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_employment_type?: string;
  job_apply_link: string;
  job_description?: string;
  job_posted_at_datetime_utc?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_required_skills?: string[];
  job_is_remote?: boolean;
}

export interface SearchJobsParams {
  query: string;
  location?: string;
  remoteOnly?: boolean;
  employmentType?: string; // FULLTIME, PARTTIME, CONTRACTOR
  page?: number;
  numPages?: number;
}

export async function searchJobs(params: SearchJobsParams): Promise<JSearchJob[]> {
  const q = params.location ? `${params.query} in ${params.location}` : params.query;

  const url = new URL(`${JSEARCH_BASE}/search`);
  url.searchParams.set('query', q);
  url.searchParams.set('page', String(params.page ?? 1));
  url.searchParams.set('num_pages', String(params.numPages ?? 1));
  if (params.remoteOnly) url.searchParams.set('remote_jobs_only', 'true');
  if (params.employmentType) url.searchParams.set('employment_types', params.employmentType);

  const res = await fetch(url.toString(), {
    headers: {
      'x-rapidapi-key': JSEARCH_API_KEY,
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
    },
  });

  if (!res.ok) throw new Error(`JSearch API error: ${res.status} ${res.statusText}`);
  const data = await res.json() as { data: JSearchJob[] };
  return data.data ?? [];
}

export function formatJobsForClaude(jobs: JSearchJob[]): string {
  if (!jobs.length) return 'No jobs found for this search.';
  return jobs.map((j, i) => {
    const location = [j.job_city, j.job_state, j.job_country].filter(Boolean).join(', ');
    const salary = j.job_min_salary && j.job_max_salary
      ? `Salary: ${j.job_min_salary.toLocaleString()}–${j.job_max_salary.toLocaleString()}`
      : '';
    const type = j.job_is_remote ? 'Remote' : (j.job_employment_type ?? '');
    return [
      `${i + 1}. *${j.job_title}* — ${j.employer_name}`,
      location ? `   📍 ${location}` : '',
      type ? `   💼 ${type}` : '',
      salary ? `   💰 ${salary}` : '',
      `   🔗 ${j.job_apply_link}`,
    ].filter(Boolean).join('\n');
  }).join('\n\n');
}
