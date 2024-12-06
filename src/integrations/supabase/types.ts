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
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          company_name: string | null
          company_size: string | null
          created_at: string
          email: string
          full_name: string | null
          headline: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
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
          full_name?: string | null
          headline?: string | null
          id: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
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
          full_name?: string | null
          headline?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          resume_url?: string | null
          skills?: Json | null
          updated_at?: string
          user_type?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status: "pending" | "reviewed" | "accepted" | "rejected"
      job_type: "full-time" | "part-time" | "contract"
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
