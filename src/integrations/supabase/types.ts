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
      scrape_jobs: {
        Row: {
          config: Json
          created_at: string
          created_by: string | null
          finished_at: string | null
          id: string
          seed_urls: string[]
          source: string
          started_at: string | null
          stats: Json
          status: string
        }
        Insert: {
          config?: Json
          created_at?: string
          created_by?: string | null
          finished_at?: string | null
          id?: string
          seed_urls?: string[]
          source: string
          started_at?: string | null
          stats?: Json
          status?: string
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string | null
          finished_at?: string | null
          id?: string
          seed_urls?: string[]
          source?: string
          started_at?: string | null
          stats?: Json
          status?: string
        }
        Relationships: []
      }
      scrape_job_items: {
        Row: {
          attempt: number
          created_at: string
          entity_key: string | null
          error_code: string | null
          error_message: string | null
          http_status: number | null
          id: string
          job_id: string
          status: string
          url: string
        }
        Insert: {
          attempt?: number
          created_at?: string
          entity_key?: string | null
          error_code?: string | null
          error_message?: string | null
          http_status?: number | null
          id?: string
          job_id: string
          status?: string
          url: string
        }
        Update: {
          attempt?: number
          created_at?: string
          entity_key?: string | null
          error_code?: string | null
          error_message?: string | null
          http_status?: number | null
          id?: string
          job_id?: string
          status?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "scrape_job_items_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      company_import_staging: {
        Row: {
          city: string | null
          created_at: string
          dedupe_status: string
          description: string | null
          facebook_url: string | null
          id: string
          instagram_url: string | null
          job_id: string
          linkedin_url: string | null
          matched_company_id: string | null
          name: string
          normalized: Json
          review_status: string
          sector: string | null
          size: string | null
          slug: string
          source_url: string
          twitter_url: string | null
          website_url: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          dedupe_status?: string
          description?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          job_id: string
          linkedin_url?: string | null
          matched_company_id?: string | null
          name: string
          normalized?: Json
          review_status?: string
          sector?: string | null
          size?: string | null
          slug: string
          source_url: string
          twitter_url?: string | null
          website_url?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          dedupe_status?: string
          description?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          job_id?: string
          linkedin_url?: string | null
          matched_company_id?: string | null
          name?: string
          normalized?: Json
          review_status?: string
          sector?: string | null
          size?: string | null
          slug?: string
          source_url?: string
          twitter_url?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_import_staging_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      crawl_job_logs: {
        Row: {
          context: Json
          created_at: string
          id: string
          job_id: string
          level: string
          message: string
        }
        Insert: {
          context?: Json
          created_at?: string
          id?: string
          job_id: string
          level?: string
          message: string
        }
        Update: {
          context?: Json
          created_at?: string
          id?: string
          job_id?: string
          level?: string
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "crawl_job_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          banner_url: string | null
          city: string | null
          company_type: string | null
          created_by_admin_user_id: string | null
          created_via: string
          created_at: string
          description: string | null
          facebook_url: string | null
          id: string
          initials: string
          instagram_url: string | null
          linkedin_url: string | null
          logo_url: string | null
          name: string
          provenance_tag: string
          sector: string | null
          size: string | null
          slug: string
          status: string | null
          twitter_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          banner_url?: string | null
          city?: string | null
          company_type?: string | null
          created_by_admin_user_id?: string | null
          created_via?: string
          created_at?: string
          description?: string | null
          facebook_url?: string | null
          id?: string
          initials?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          name: string
          provenance_tag?: string
          sector?: string | null
          size?: string | null
          slug: string
          status?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          banner_url?: string | null
          city?: string | null
          company_type?: string | null
          created_by_admin_user_id?: string | null
          created_via?: string
          created_at?: string
          description?: string | null
          facebook_url?: string | null
          id?: string
          initials?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          name?: string
          provenance_tag?: string
          sector?: string | null
          size?: string | null
          slug?: string
          status?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      company_seo_profiles: {
        Row: {
          candidate_takeaway: string | null
          company_id: string
          cons_summary: string | null
          created_at: string
          culture_summary: string | null
          external_links_json: Json
          faq_items_json: Json
          generated_at: string | null
          generation_status: string
          id: string
          interview_summary: string | null
          intro_summary: string | null
          keywords_json: Json
          prompt_version: string
          pros_summary: string | null
          salary_summary: string | null
          source_snapshot_json: Json
          updated_at: string
          word_count: number
        }
        Insert: {
          candidate_takeaway?: string | null
          company_id: string
          cons_summary?: string | null
          created_at?: string
          culture_summary?: string | null
          external_links_json?: Json
          faq_items_json?: Json
          generated_at?: string | null
          generation_status?: string
          id?: string
          interview_summary?: string | null
          intro_summary?: string | null
          keywords_json?: Json
          prompt_version?: string
          pros_summary?: string | null
          salary_summary?: string | null
          source_snapshot_json?: Json
          updated_at?: string
          word_count?: number
        }
        Update: {
          candidate_takeaway?: string | null
          company_id?: string
          cons_summary?: string | null
          created_at?: string
          culture_summary?: string | null
          external_links_json?: Json
          faq_items_json?: Json
          generated_at?: string | null
          generation_status?: string
          id?: string
          interview_summary?: string | null
          intro_summary?: string | null
          keywords_json?: Json
          prompt_version?: string
          pros_summary?: string | null
          salary_summary?: string | null
          source_snapshot_json?: Json
          updated_at?: string
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_seo_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
          has_case_study: boolean | null
          id: string
          interview_type: string | null
          interview_year: number | null
          offered_salary_amount: number | null
          offered_salary_currency: string | null
          position: string
          response_time_days: number | null
          result: string | null
          salary_discussed: boolean | null
          stage_count: number | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          difficulty?: string | null
          experience?: string | null
          has_case_study?: boolean | null
          id?: string
          interview_type?: string | null
          interview_year?: number | null
          offered_salary_amount?: number | null
          offered_salary_currency?: string | null
          position: string
          response_time_days?: number | null
          result?: string | null
          salary_discussed?: boolean | null
          stage_count?: number | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          difficulty?: string | null
          experience?: string | null
          has_case_study?: boolean | null
          id?: string
          interview_type?: string | null
          interview_year?: number | null
          offered_salary_amount?: number | null
          offered_salary_currency?: string | null
          position?: string
          response_time_days?: number | null
          result?: string | null
          salary_discussed?: boolean | null
          stage_count?: number | null
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
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          linkedin_url: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          linkedin_url?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          linkedin_url?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          company_id: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          position: string | null
          post_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          position?: string | null
          post_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          position?: string | null
          post_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      posts_public: {
        Row: {
          author_avatar_url: string | null
          author_display_name: string | null
          company_id: string | null
          company_name: string | null
          company_slug: string | null
          content: string | null
          created_at: string | null
          id: string | null
          image_url: string | null
          position: string | null
          post_type: string | null
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
          benefits: string[] | null
          company_id: string
          cons: string | null
          created_at: string
          department: string | null
          id: string
          position_level: string | null
          pros: string | null
          rating: number
          rating_career_growth: number | null
          rating_communication: number | null
          rating_compensation_benefits: number | null
          rating_manager_behavior: number | null
          rating_tasks: number | null
          rating_team_spirit: number | null
          rating_work_atmosphere: number | null
          rating_work_life_balance: number | null
          recommends: boolean | null
          reviewer_relationship: string | null
          title: string
          updated_at: string
          user_id: string
          work_model: string | null
        }
        Insert: {
          benefits?: string[] | null
          company_id: string
          cons?: string | null
          created_at?: string
          department?: string | null
          id?: string
          position_level?: string | null
          pros?: string | null
          rating: number
          rating_career_growth?: number | null
          rating_communication?: number | null
          rating_compensation_benefits?: number | null
          rating_manager_behavior?: number | null
          rating_tasks?: number | null
          rating_team_spirit?: number | null
          rating_work_atmosphere?: number | null
          rating_work_life_balance?: number | null
          recommends?: boolean | null
          reviewer_relationship?: string | null
          title: string
          updated_at?: string
          user_id: string
          work_model?: string | null
        }
        Update: {
          benefits?: string[] | null
          company_id?: string
          cons?: string | null
          created_at?: string
          department?: string | null
          id?: string
          position_level?: string | null
          pros?: string | null
          rating?: number
          rating_career_growth?: number | null
          rating_communication?: number | null
          rating_compensation_benefits?: number | null
          rating_manager_behavior?: number | null
          rating_tasks?: number | null
          rating_team_spirit?: number | null
          rating_work_atmosphere?: number | null
          rating_work_life_balance?: number | null
          recommends?: boolean | null
          reviewer_relationship?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          work_model?: string | null
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
          benefits: string[] | null
          bonus_amount_yearly: number | null
          company_id: string
          created_at: string
          currency: string | null
          department: string | null
          employment_type: string | null
          equity_or_stock: string | null
          experience_years: number | null
          id: string
          job_title: string
          location_city: string | null
          salary_amount: number
          salary_basis: string | null
          seniority_level: string | null
          user_id: string
          work_model: string | null
        }
        Insert: {
          benefits?: string[] | null
          bonus_amount_yearly?: number | null
          company_id: string
          created_at?: string
          currency?: string | null
          department?: string | null
          employment_type?: string | null
          equity_or_stock?: string | null
          experience_years?: number | null
          id?: string
          job_title: string
          location_city?: string | null
          salary_amount: number
          salary_basis?: string | null
          seniority_level?: string | null
          user_id: string
          work_model?: string | null
        }
        Update: {
          benefits?: string[] | null
          bonus_amount_yearly?: number | null
          company_id?: string
          created_at?: string
          currency?: string | null
          department?: string | null
          employment_type?: string | null
          equity_or_stock?: string | null
          experience_years?: number | null
          id?: string
          job_title?: string
          location_city?: string | null
          salary_amount?: number
          salary_basis?: string | null
          seniority_level?: string | null
          user_id?: string
          work_model?: string | null
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
          has_case_study: boolean | null
          id: string | null
          interview_type: string | null
          interview_year: number | null
          offered_salary_amount: number | null
          offered_salary_currency: string | null
          position: string | null
          response_time_days: number | null
          result: string | null
          salary_discussed: boolean | null
          stage_count: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          difficulty?: string | null
          experience?: string | null
          has_case_study?: boolean | null
          id?: string | null
          interview_type?: string | null
          interview_year?: number | null
          offered_salary_amount?: number | null
          offered_salary_currency?: string | null
          position?: string | null
          response_time_days?: number | null
          result?: string | null
          salary_discussed?: boolean | null
          stage_count?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          difficulty?: string | null
          experience?: string | null
          has_case_study?: boolean | null
          id?: string | null
          interview_type?: string | null
          interview_year?: number | null
          offered_salary_amount?: number | null
          offered_salary_currency?: string | null
          position?: string | null
          response_time_days?: number | null
          result?: string | null
          salary_discussed?: boolean | null
          stage_count?: number | null
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
          benefits: string[] | null
          company_id: string | null
          cons: string | null
          created_at: string | null
          department: string | null
          id: string | null
          position_level: string | null
          pros: string | null
          rating: number | null
          rating_career_growth: number | null
          rating_communication: number | null
          rating_compensation_benefits: number | null
          rating_manager_behavior: number | null
          rating_tasks: number | null
          rating_team_spirit: number | null
          rating_work_atmosphere: number | null
          rating_work_life_balance: number | null
          recommends: boolean | null
          reviewer_relationship: string | null
          title: string | null
          updated_at: string | null
          work_model: string | null
        }
        Insert: {
          benefits?: string[] | null
          company_id?: string | null
          cons?: string | null
          created_at?: string | null
          department?: string | null
          id?: string | null
          position_level?: string | null
          pros?: string | null
          rating?: number | null
          rating_career_growth?: number | null
          rating_communication?: number | null
          rating_compensation_benefits?: number | null
          rating_manager_behavior?: number | null
          rating_tasks?: number | null
          rating_team_spirit?: number | null
          rating_work_atmosphere?: number | null
          rating_work_life_balance?: number | null
          recommends?: boolean | null
          reviewer_relationship?: string | null
          title?: string | null
          updated_at?: string | null
          work_model?: string | null
        }
        Update: {
          benefits?: string[] | null
          company_id?: string | null
          cons?: string | null
          created_at?: string | null
          department?: string | null
          id?: string | null
          position_level?: string | null
          pros?: string | null
          rating?: number | null
          rating_career_growth?: number | null
          rating_communication?: number | null
          rating_compensation_benefits?: number | null
          rating_manager_behavior?: number | null
          rating_tasks?: number | null
          rating_team_spirit?: number | null
          rating_work_atmosphere?: number | null
          rating_work_life_balance?: number | null
          recommends?: boolean | null
          reviewer_relationship?: string | null
          title?: string | null
          updated_at?: string | null
          work_model?: string | null
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
          benefits: string[] | null
          bonus_amount_yearly: number | null
          company_id: string | null
          created_at: string | null
          currency: string | null
          department: string | null
          employment_type: string | null
          equity_or_stock: string | null
          experience_years: number | null
          id: string | null
          job_title: string | null
          location_city: string | null
          salary_amount: number | null
          salary_basis: string | null
          seniority_level: string | null
          work_model: string | null
        }
        Insert: {
          benefits?: string[] | null
          bonus_amount_yearly?: number | null
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          department?: string | null
          employment_type?: string | null
          equity_or_stock?: string | null
          experience_years?: number | null
          id?: string | null
          job_title?: string | null
          location_city?: string | null
          salary_amount?: number | null
          salary_basis?: string | null
          seniority_level?: string | null
          work_model?: string | null
        }
        Update: {
          benefits?: string[] | null
          bonus_amount_yearly?: number | null
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          department?: string | null
          employment_type?: string | null
          equity_or_stock?: string | null
          experience_years?: number | null
          id?: string | null
          job_title?: string | null
          location_city?: string | null
          salary_amount?: number | null
          salary_basis?: string | null
          seniority_level?: string | null
          work_model?: string | null
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
      create_company_admin: {
        Args: {
          p_banner_url?: string
          p_city?: string
          p_company_type?: string
          p_created_via?: string
          p_description?: string
          p_initials?: string
          p_logo_url?: string
          p_name: string
          p_provenance_tag?: string
          p_sector?: string
          p_size?: string
          p_slug: string
        }
        Returns: Database["public"]["Tables"]["companies"]["Row"]
      }
      execute_company_import_sql: {
        Args: { sql_text: string }
        Returns: Json
      }
      approve_company_import: {
        Args: { p_staging_id: string }
        Returns: Json
      }
      reject_company_import: {
        Args: { p_staging_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      get_salary_stats: {
        Args: { p_company_id: string }
        Returns: {
          avg_amount: number
          job_title: string
          location_city: string
          max_amount: number
          min_amount: number
          sample_count: number
        }[]
      }
      has_submitted_salary: { Args: { p_user_id: string }; Returns: boolean }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_company_admin: {
        Args: { _company_id: string; _user_id: string }
        Returns: boolean
      }
      is_super_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
      set_user_role_admin: {
        Args: { _enabled?: boolean; _target_user_id: string }
        Returns: undefined
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
