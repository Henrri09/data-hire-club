
export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_description?: string;
  last_updated_by?: string;
  created_at: string;
  updated_at: string;
  published: boolean;
}
