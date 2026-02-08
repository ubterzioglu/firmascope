export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          link_url: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          link_url?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          link_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          banner_url: string | null
          city: string | null
          company_type: string | null
          created_at: string
          description: string | null
          id: string
          initials: string
          logo_url: string | null
          name: string
          sector: string | null
          size: string | null
          slug: string
          status: string | null
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          city?: string | null
          company_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          initials?: string
          logo_url?: string | null
          name: string
          sector?: string | null
          size?: string | null
          slug: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          city?: string | null
          company_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          initials?: string
          logo_url?: string | null
          name?: string
          sector?: string | null
          size?: string | null
          slug?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_admins: {
        Row: {
          company_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_admins_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_claims: {
        Row: {
          admin_note: string | null
          company_id: string
          created_at: string
          id: string
          message: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          company_id: string
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          company_id?: string
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_claims_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_suggestions: {
        Row: {
          admin_note: string | null
          city: string | null
          company_name: string
          created_at: string
          description: string | null
          id: string
          sector: string | null
          status: string
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          admin_note?: string | null
          city?: string | null
          company_name: string
          created_at?: string
          description?: string | null
          id?: string
          sector?: string | null
          status?: string
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          admin_note?: string | null
          city?: string | null
          company_name?: string
          created_at?: string
          description?: string | null
          id?: string
          sector?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      interviews: {
        Row: {
          company_id: string
          created_at: string
          difficulty: string | null
          experience: string | null
          id: string
          position: string
          result: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          difficulty?: string | null
          experience?: string | null
          id?: string
          position: string
          result?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          difficulty?: string | null
          experience?: string | null
          id?: string
          position?: string
          result?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          admin_note: string | null
          created_at: string
          details: string | null
          id: string
          reason: string
          status: string
          target_id: string
          target_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          status?: string
          target_id: string
          target_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          status?: string
          target_id?: string
          target_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          company_id: string
          cons: string | null
          created_at: string
          id: string
          pros: string | null
          rating: number
          recommends: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          cons?: string | null
          created_at?: string
          id?: string
          pros?: string | null
          rating: number
          recommends?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          cons?: string | null
          created_at?: string
          id?: string
          pros?: string | null
          rating?: number
          recommends?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      salaries: {
        Row: {
          company_id: string
          created_at: string
          currency: string | null
          experience_years: number | null
          id: string
          job_title: string
          salary_amount: number
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          currency?: string | null
          experience_years?: number | null
          id?: string
          job_title: string
          salary_amount: number
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          currency?: string | null
          experience_years?: number | null
          id?: string
          job_title?: string
          salary_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salaries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_logs: {
        Row: {
          action_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string
          id: string
          target_id: string
          target_type: string
          user_id: string
          vote_type: number
        }
        Insert: {
          created_at?: string
          id?: string
          target_id: string
          target_type: string
          user_id: string
          vote_type: number
        }
        Update: {
          created_at?: string
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string
          vote_type?: number
        }
        Relationships: []
      }
    }
    Views: {
      interviews_public: {
        Row: {
          company_id: string | null
          created_at: string | null
          difficulty: string | null
          experience: string | null
          id: string | null
          position: string | null
          result: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          difficulty?: string | null
          experience?: string | null
          id?: string | null
          position?: string | null
          result?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          difficulty?: string | null
          experience?: string | null
          id?: string | null
          position?: string | null
          result?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews_public: {
        Row: {
          company_id: string | null
          cons: string | null
          created_at: string | null
          id: string | null
          pros: string | null
          rating: number | null
          recommends: boolean | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          cons?: string | null
          created_at?: string | null
          id?: string | null
          pros?: string | null
          rating?: number | null
          recommends?: boolean | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          cons?: string | null
          created_at?: string | null
          id?: string | null
          pros?: string | null
          rating?: number | null
          recommends?: boolean | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      salaries_public: {
        Row: {
          company_id: string | null
          created_at: string | null
          currency: string | null
          experience_years: number | null
          id: string | null
          job_title: string | null
          salary_amount: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          experience_years?: number | null
          id?: string | null
          job_title?: string | null
          salary_amount?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          experience_years?: number | null
          id?: string | null
          job_title?: string | null
          salary_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "salaries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_submitted_salary: { Args: { p_user_id: string }; Returns: boolean }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_company_admin: {
        Args: { _company_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "company_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "company_admin"],
    },
  },
} as const
