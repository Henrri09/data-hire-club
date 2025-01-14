export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      candidates: {
        Row: {
          created_at: string
          experience_level: string | null
          id: string
          profile_id: string | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          experience_level?: string | null
          id?: string
          profile_id?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          experience_level?: string | null
          id?: string
          profile_id?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidates_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_banners: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          link_url: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_banners_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_external_links: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_external_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_pinned_rules: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_pinned_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          comments_count: number | null
          content: string
          created_at: string
          id: string
          likes_count: number | null
          post_type: string
          updated_at: string
        }
        Insert: {
          author_id: string
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          post_type: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          post_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          company_name: string
          created_at: string
          description: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          size: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          description?: string | null
          id: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          size?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          size?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      external_scripts: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          id: string
          is_active: boolean | null
          name: string
          script_type: Database["public"]["Enums"]["script_type"]
          tracking_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          script_type: Database["public"]["Enums"]["script_type"]
          tracking_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          script_type?: Database["public"]["Enums"]["script_type"]
          tracking_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_scripts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_levels: {
        Row: {
          badge_url: string | null
          created_at: string
          id: number
          level: number
          name: string
          points_required: number
          updated_at: string
        }
        Insert: {
          badge_url?: string | null
          created_at?: string
          id?: number
          level: number
          name: string
          points_required: number
          updated_at?: string
        }
        Update: {
          badge_url?: string | null
          created_at?: string
          id?: number
          level?: number
          name?: string
          points_required?: number
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          candidate_id: string
          cover_letter: string | null
          created_at: string
          deleted_at: string | null
          feedback: string | null
          feedback_date: string | null
          id: string
          job_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          candidate_id: string
          cover_letter?: string | null
          created_at?: string
          deleted_at?: string | null
          feedback?: string | null
          feedback_date?: string | null
          id?: string
          job_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          cover_letter?: string | null
          created_at?: string
          deleted_at?: string | null
          feedback?: string | null
          feedback_date?: string | null
          id?: string
          job_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          applications_count: number | null
          benefits: string | null
          career: string | null
          company_id: string
          contract_type: string | null
          created_at: string
          deleted_at: string | null
          description: string
          experience_level: string | null
          external_link: string | null
          id: string
          job_type: Database["public"]["Enums"]["job_type"]
          location: string | null
          max_applications: number | null
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
          skills_required: string[] | null
          status: string
          title: string
          updated_at: string
          views_count: number | null
          work_model: string | null
        }
        Insert: {
          applications_count?: number | null
          benefits?: string | null
          career?: string | null
          company_id: string
          contract_type?: string | null
          created_at?: string
          deleted_at?: string | null
          description: string
          experience_level?: string | null
          external_link?: string | null
          id?: string
          job_type: Database["public"]["Enums"]["job_type"]
          location?: string | null
          max_applications?: number | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          skills_required?: string[] | null
          status?: string
          title: string
          updated_at?: string
          views_count?: number | null
          work_model?: string | null
        }
        Update: {
          applications_count?: number | null
          benefits?: string | null
          career?: string | null
          company_id?: string
          contract_type?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string
          experience_level?: string | null
          external_link?: string | null
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          location?: string | null
          max_applications?: number | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          skills_required?: string[] | null
          status?: string
          title?: string
          updated_at?: string
          views_count?: number | null
          work_model?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      points_history: {
        Row: {
          action_type: string
          created_at: string
          id: string
          points: number
          reference_id: string | null
          reference_type: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          points: number
          reference_id?: string | null
          reference_type?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          points?: number
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          company_name: string | null
          company_size: string | null
          created_at: string
          email: string
          experience_level: string | null
          full_name: string | null
          github_url: string | null
          headline: string | null
          id: string
          industry: string | null
          is_admin: boolean | null
          linkedin_url: string | null
          location: string | null
          logo_url: string | null
          portfolio_url: string | null
          resume_url: string | null
          skills: Json | null
          updated_at: string
          user_type: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          email: string
          experience_level?: string | null
          full_name?: string | null
          github_url?: string | null
          headline?: string | null
          id: string
          industry?: string | null
          is_admin?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          logo_url?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          skills?: Json | null
          updated_at?: string
          user_type: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          email?: string
          experience_level?: string | null
          full_name?: string | null
          github_url?: string | null
          headline?: string | null
          id?: string
          industry?: string | null
          is_admin?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          logo_url?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          skills?: Json | null
          updated_at?: string
          user_type?: string
          website?: string | null
        }
        Relationships: []
      }
      user_points: {
        Row: {
          created_at: string
          current_level: number
          id: string
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: number
          id?: string
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: number
          id?: string
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_jobs_company_ids: {
        Args: Record<PropertyKey, never>
        Returns: {
          job_id: string
          company_id: string
        }[]
      }
    }
    Enums: {
      application_status: "pending" | "reviewed" | "accepted" | "rejected"
      job_type: "full-time" | "part-time" | "contract"
      script_type: "GA" | "GTM" | "META_PIXEL" | "OTHER"
      user_type: "candidate" | "company"
      user_type_enum: "candidate" | "company"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
