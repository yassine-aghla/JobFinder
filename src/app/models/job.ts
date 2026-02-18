export interface AdzunaJob {
  id: string;
  title: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
    area: string[];
  };
  description: string;
  created: string;
  redirect_url: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: number;
  contract_type?: string;
  category?: {
    label: string;
    tag: string;
  };
}

export interface AdzunaSearchResponse {
  results: AdzunaJob[];
  count: number;
  mean: number;
}

export interface JobSearchParams {
  what?: string;
  where?: string;
  results_per_page?: number;
  page?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  publishedDate: string;
  url: string;
  salary?: string;
  apiSource: string;
}
