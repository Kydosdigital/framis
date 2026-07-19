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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      code_reviews: {
        Row: {
          assignment_id: number
          feedback: Json
          id: number
          scores: Json
          submitted_at: string
        }
        Insert: {
          assignment_id: number
          feedback?: Json
          id?: never
          scores?: Json
          submitted_at?: string
        }
        Update: {
          assignment_id?: number
          feedback?: Json
          id?: never
          scores?: Json
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_reviews_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: true
            referencedRelation: "review_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: number
          lesson_id: number | null
          project_id: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: never
          lesson_id?: number | null
          project_id?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: never
          lesson_id?: number | null
          project_id?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      community_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: number
          post_id: number
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: never
          post_id: number
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: never
          post_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "community_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      student_plan: {
        Row: { student_id: string; mission: string | null; vision: string | null; how_to_achieve: string | null; updated_at: string }
        Insert: { student_id: string; mission?: string | null; vision?: string | null; how_to_achieve?: string | null; updated_at?: string }
        Update: { student_id?: string; mission?: string | null; vision?: string | null; how_to_achieve?: string | null; updated_at?: string }
        Relationships: [
          {
            foreignKeyName: "student_plan_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_goals: {
        Row: {
          id: string
          student_id: string
          title: string
          detail: string | null
          progress_pct: number
          target_date: string | null
          achieved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          title: string
          detail?: string | null
          progress_pct?: number
          target_date?: string | null
          achieved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          title?: string
          detail?: string | null
          progress_pct?: number
          target_date?: string | null
          achieved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_goals_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_entries: {
        Row: {
          id: string
          student_id: string
          learnt: string | null
          stuck_on: string | null
          note: string | null
          entry_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          learnt?: string | null
          stuck_on?: string | null
          note?: string | null
          entry_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          learnt?: string | null
          stuck_on?: string | null
          note?: string | null
          entry_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_entries_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_track_session_overrides: {
        Row: {
          id: string
          student_id: string
          track_session_id: string
          title: string | null
          description: string | null
          mentor_note: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          track_session_id: string
          title?: string | null
          description?: string | null
          mentor_note?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          track_session_id?: string
          title?: string | null
          description?: string | null
          mentor_note?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_track_session_overrides_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_track_session_overrides_track_session_id_fkey"
            columns: ["track_session_id"]
            isOneToOne: false
            referencedRelation: "curriculum_track_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_questions: {
        Row: {
          id: string
          student_id: string
          lesson_id: string | null
          lesson_title: string | null
          body: string
          resolved_at: string | null
          assigned_mentor_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          lesson_id?: string | null
          lesson_title?: string | null
          body: string
          resolved_at?: string | null
          assigned_mentor_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          lesson_id?: string | null
          lesson_title?: string | null
          body?: string
          resolved_at?: string | null
          assigned_mentor_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_questions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_question_replies: {
        Row: { id: string; question_id: string; author_id: string; body: string; created_at: string }
        Insert: { id?: string; question_id: string; author_id: string; body: string; created_at?: string }
        Update: { id?: string; question_id?: string; author_id?: string; body?: string; created_at?: string }
        Relationships: [
          {
            foreignKeyName: "lesson_question_replies_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "lesson_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_question_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          created_at: string
          due_at: string | null
          id: string
          instructions: string | null
          mentor_id: string
          status: string
          student_id: string
          title: string
          track_session_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_at?: string | null
          id?: string
          instructions?: string | null
          mentor_id: string
          status?: string
          student_id: string
          title: string
          track_session_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_at?: string | null
          id?: string
          instructions?: string | null
          mentor_id?: string
          status?: string
          student_id?: string
          title?: string
          track_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_track_session_id_fkey"
            columns: ["track_session_id"]
            isOneToOne: false
            referencedRelation: "curriculum_track_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_submissions: {
        Row: {
          assignment_id: string
          content: string | null
          created_at: string
          id: string
          link_url: string | null
          mentor_feedback: string | null
          reviewed_at: string | null
          student_id: string
          submitted_at: string
          updated_at: string
        }
        Insert: {
          assignment_id: string
          content?: string | null
          created_at?: string
          id?: string
          link_url?: string | null
          mentor_feedback?: string | null
          reviewed_at?: string | null
          student_id: string
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          assignment_id?: string
          content?: string | null
          created_at?: string
          id?: string
          link_url?: string | null
          mentor_feedback?: string | null
          reviewed_at?: string | null
          student_id?: string
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: true
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_track_sessions: {
        Row: {
          description: string | null
          id: string
          month: number | null
          session_number: number
          title: string
          track_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          month?: number | null
          session_number: number
          title: string
          track_id: string
        }
        Update: {
          description?: string | null
          id?: string
          month?: number | null
          session_number?: number
          title?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_track_sessions_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "curriculum_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_tracks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      student_track_enrollments: {
        Row: {
          enrolled_at: string
          id: string
          student_id: string
          track_id: string
        }
        Insert: {
          enrolled_at?: string
          id?: string
          student_id: string
          track_id: string
        }
        Update: {
          enrolled_at?: string
          id?: string
          student_id?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_track_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_track_enrollments_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "curriculum_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      student_track_progress: {
        Row: {
          completed_at: string | null
          id: string
          status: string
          student_id: string
          track_session_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          status?: string
          student_id: string
          track_session_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          status?: string
          student_id?: string
          track_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_track_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_track_progress_track_session_id_fkey"
            columns: ["track_session_id"]
            isOneToOne: false
            referencedRelation: "curriculum_track_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: Json
          created_at: string
          description: string | null
          difficulty: string
          estimated_minutes: number | null
          id: number
          learning_outcomes: string[]
          module_id: number
          order_index: number
          published_at: string | null
          title: string
        }
        Insert: {
          content?: Json
          created_at?: string
          description?: string | null
          difficulty?: string
          estimated_minutes?: number | null
          id?: never
          learning_outcomes?: string[]
          module_id: number
          order_index: number
          published_at?: string | null
          title: string
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string | null
          difficulty?: string
          estimated_minutes?: number | null
          id?: never
          learning_outcomes?: string[]
          module_id?: number
          order_index?: number
          published_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_engagement_events: {
        Row: {
          created_at: string
          event_type: string
          event_value: Json
          id: string
          lesson_id: string
          module_id: string
          phase: number
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          event_value?: Json
          id?: string
          lesson_id: string
          module_id: string
          phase: number
          session_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          event_value?: Json
          id?: string
          lesson_id?: string
          module_id?: string
          phase?: number
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_engagement_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_engagement_summary: {
        Row: {
          engagement_score: number
          explain_simpler_used: boolean
          explainer_opens_count: number
          last_visited_at: string | null
          lesson_id: string
          max_scroll_pct: number
          module_id: string
          phase: number
          quiz_attempts: number
          quiz_best_score: number | null
          sandbox_attempted: boolean
          sandbox_completed: boolean
          total_time_seconds: number
          user_id: string
          visit_count: number
        }
        Insert: {
          engagement_score?: number
          explain_simpler_used?: boolean
          explainer_opens_count?: number
          last_visited_at?: string | null
          lesson_id: string
          max_scroll_pct?: number
          module_id?: string
          phase?: number
          quiz_attempts?: number
          quiz_best_score?: number | null
          sandbox_attempted?: boolean
          sandbox_completed?: boolean
          total_time_seconds?: number
          user_id: string
          visit_count?: number
        }
        Update: {
          engagement_score?: number
          explain_simpler_used?: boolean
          explainer_opens_count?: number
          last_visited_at?: string | null
          lesson_id?: string
          max_scroll_pct?: number
          module_id?: string
          phase?: number
          quiz_attempts?: number
          quiz_best_score?: number | null
          sandbox_attempted?: boolean
          sandbox_completed?: boolean
          total_time_seconds?: number
          user_id?: string
          visit_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_engagement_summary_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_assignments: {
        Row: {
          active: boolean
          assigned_at: string
          assigned_by: string | null
          id: string
          mentor_id: string
          student_id: string
          unassigned_at: string | null
        }
        Insert: {
          active?: boolean
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          mentor_id: string
          student_id: string
          unassigned_at?: string | null
        }
        Update: {
          active?: boolean
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          mentor_id?: string
          student_id?: string
          unassigned_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentor_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_assignments_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          mentor_id: string
          read_at: string | null
          sender_id: string
          student_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          mentor_id: string
          read_at?: string | null
          sender_id: string
          student_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          mentor_id?: string
          read_at?: string | null
          sender_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_messages_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_messages_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_session_notes: {
        Row: {
          created_at: string
          id: string
          mentor_id: string
          notes: string
          session_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentor_id: string
          notes?: string
          session_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          mentor_id?: string
          notes?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_session_notes_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_session_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "mentor_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_sessions: {
        Row: {
          ai_generated_summary: string | null
          created_at: string
          duration_minutes: number
          id: string
          mentor_id: string
          recording_url: string | null
          scheduled_at: string
          status: string
          student_id: string
          student_summary: string | null
          track_session_id: string | null
          updated_at: string
        }
        Insert: {
          ai_generated_summary?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          mentor_id: string
          recording_url?: string | null
          scheduled_at: string
          status?: string
          student_id: string
          student_summary?: string | null
          track_session_id?: string | null
          updated_at?: string
        }
        Update: {
          ai_generated_summary?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          mentor_id?: string
          recording_url?: string | null
          scheduled_at?: string
          status?: string
          student_id?: string
          student_summary?: string | null
          track_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_sessions_track_session_id_fkey"
            columns: ["track_session_id"]
            isOneToOne: false
            referencedRelation: "curriculum_track_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_applications: {
        Row: {
          created_at: string
          email: string
          id: number
          name: string
          portfolio_url: string | null
          status: string
          timezone: string
          why_mentor: string
          years_experience: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: never
          name: string
          portfolio_url?: string | null
          status?: string
          timezone: string
          why_mentor: string
          years_experience: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: never
          name?: string
          portfolio_url?: string | null
          status?: string
          timezone?: string
          why_mentor?: string
          years_experience?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          created_at: string
          description: string | null
          id: number
          module_number: number
          phase: number
          title: string
          weeks_label: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: never
          module_number: number
          phase: number
          title: string
          weeks_label?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: never
          module_number?: number
          phase?: number
          title?: string
          weeks_label?: string | null
        }
        Relationships: []
      }
      portfolio_testimonials: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: number
          portfolio_id: number
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: never
          portfolio_id: number
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: never
          portfolio_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_testimonials_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          bio: string | null
          created_at: string
          featured_project_ids: number[]
          id: number
          is_public: boolean
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          featured_project_ids?: number[]
          id?: never
          is_public?: boolean
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          featured_project_ids?: number[]
          id?: never
          is_public?: boolean
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email_frequency: string
          full_name: string | null
          id: string
          learning_goal: string | null
          location: string | null
          onboarding_completed_at: string | null
          placement_answers: Json | null
          public_portfolio: boolean
          setup_checklist: Json | null
          theme: string
          updated_at: string
          username: string
          welcome_email_day: number
          is_admin: boolean
          role: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email_frequency?: string
          full_name?: string | null
          id: string
          learning_goal?: string | null
          location?: string | null
          onboarding_completed_at?: string | null
          placement_answers?: Json | null
          public_portfolio?: boolean
          setup_checklist?: Json | null
          theme?: string
          updated_at?: string
          username: string
          welcome_email_day?: number
          is_admin?: boolean
          role?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email_frequency?: string
          full_name?: string | null
          id?: string
          learning_goal?: string | null
          location?: string | null
          onboarding_completed_at?: string | null
          placement_answers?: Json | null
          public_portfolio?: boolean
          setup_checklist?: Json | null
          theme?: string
          updated_at?: string
          username?: string
          welcome_email_day?: number
          is_admin?: boolean
          role?: string
        }
        Relationships: []
      }
      project_submissions: {
        Row: {
          auto_check_results: Json
          created_at: string
          demo_video_url: string | null
          deployed_url: string | null
          github_url: string | null
          id: number
          project_id: number
          status: string
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_check_results?: Json
          created_at?: string
          demo_video_url?: string | null
          deployed_url?: string | null
          github_url?: string | null
          id?: never
          project_id: number
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_check_results?: Json
          created_at?: string
          demo_video_url?: string | null
          deployed_url?: string | null
          github_url?: string | null
          id?: never
          project_id?: number
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_submissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string | null
          duration_label: string | null
          hints: Json
          id: number
          module_id: number | null
          order_index: number | null
          requirements: Json
          rubric: Json
          slug: string
          solo_or_pair: string
          starter_repo_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration_label?: string | null
          hints?: Json
          id?: never
          module_id?: number | null
          order_index?: number | null
          requirements?: Json
          rubric?: Json
          slug: string
          solo_or_pair?: string
          starter_repo_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration_label?: string | null
          hints?: Json
          id?: never
          module_id?: number | null
          order_index?: number | null
          requirements?: Json
          rubric?: Json
          slug?: string
          solo_or_pair?: string
          starter_repo_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      review_assignments: {
        Row: {
          assigned_at: string
          due_at: string | null
          id: number
          reviewer_id: string
          status: string
          submission_id: number
        }
        Insert: {
          assigned_at?: string
          due_at?: string | null
          id?: never
          reviewer_id: string
          status?: string
          submission_id: number
        }
        Update: {
          assigned_at?: string
          due_at?: string | null
          id?: never
          reviewer_id?: string
          status?: string
          submission_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "review_assignments_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "project_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          id: number
          lesson_id: number
          quiz_score: number | null
          started_at: string
          status: string
          time_spent_seconds: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: never
          lesson_id: number
          quiz_score?: number | null
          started_at?: string
          status?: string
          time_spent_seconds?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: never
          lesson_id?: number
          quiz_score?: number | null
          started_at?: string
          status?: string
          time_spent_seconds?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      set_user_role: {
        Args: { p_user_id: string; p_role: string }
        Returns: undefined
      }
      get_due_onboarding_emails: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string | null
          full_name: string | null
          next_day: number
        }[]
      }
      get_capstone_gallery: {
        Args: Record<PropertyKey, never>
        Returns: {
          project_title: string
          project_slug: string
          github_url: string | null
          deployed_url: string | null
          submitted_at: string | null
          author_name: string | null
          portfolio_slug: string
        }[]
      }
      recompute_lesson_engagement_summary: {
        Args: { p_user_id: string; p_lesson_id: string }
        Returns: undefined
      }
      is_super_admin: {
        Args: { p_user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
