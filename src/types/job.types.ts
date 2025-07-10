
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  seniority: string;
  salary_range: string;
  contract_type: string;
  application_url?: string;
  logo_url?: string;
  benefits?: string[];
  requirements?: string[];
  responsibilities?: string[];
  views?: number;
  applications?: number;
}

export interface JobResponse {
  id: string;
  title: string;
  description: string;
  work_model: string | null;
  experience_level: string | null;
  salary_range: string | null;
  contract_type: string | null;
  benefits: string | null;
  requirements: string[] | null;
  responsibilities: string[] | null;
  views_count: number | null;
  applications_count: number | null;
  external_link: string | null;
  companies?: {
    name: string;
    location: string | null;
    logo_url: string | null;
  } | null;
}

export interface JobsErrorStateProps {
  error: Error;
}

// Interface comum para banners da comunidade
export interface CommunityBanner {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  is_active: boolean;
  type: "INTRODUCTION" | "LEARNING" | "QUESTIONS" | "HOME_ADS";
  display: "MOBILE" | "DESKTOP";
  created_at: string;
}
