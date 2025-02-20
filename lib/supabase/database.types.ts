export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null;
          description: string | null;
          icon_url: string | null;
          id: number;
          name: string;
          requirement_type: string;
          requirement_value: number | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          icon_url?: string | null;
          id?: number;
          name: string;
          requirement_type: string;
          requirement_value?: number | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          icon_url?: string | null;
          id?: number;
          name?: string;
          requirement_type?: string;
          requirement_value?: number | null;
        };
        Relationships: [];
      };
      audio_messages: {
        Row: {
          audio_url: string;
          created_at: string | null;
          duration: number | null;
          id: number;
          language_id: number | null;
          receiver_id: string | null;
          sender_id: string;
          transcript: string | null;
        };
        Insert: {
          audio_url: string;
          created_at?: string | null;
          duration?: number | null;
          id?: number;
          language_id?: number | null;
          receiver_id?: string | null;
          sender_id: string;
          transcript?: string | null;
        };
        Update: {
          audio_url?: string;
          created_at?: string | null;
          duration?: number | null;
          id?: number;
          language_id?: number | null;
          receiver_id?: string | null;
          sender_id?: string;
          transcript?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audio_messages_language_id_fkey";
            columns: ["language_id"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audio_messages_receiver_id_fkey";
            columns: ["receiver_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audio_messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      badges: {
        Row: {
          category: string | null;
          created_at: string | null;
          criteria: string | null;
          description: string | null;
          icon_url: string | null;
          id: number;
          name: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          criteria?: string | null;
          description?: string | null;
          icon_url?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          criteria?: string | null;
          description?: string | null;
          icon_url?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      flashcard_decks: {
        Row: {
          created_at: string | null;
          creator_id: string;
          description: string | null;
          id: number;
          is_public: boolean | null;
          language_id: number | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          creator_id: string;
          description?: string | null;
          id?: number;
          is_public?: boolean | null;
          language_id?: number | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          creator_id?: string;
          description?: string | null;
          id?: number;
          is_public?: boolean | null;
          language_id?: number | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "flashcard_decks_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "flashcard_decks_language_id_fkey";
            columns: ["language_id"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["id"];
          },
        ];
      };
      flashcards: {
        Row: {
          back_content: string;
          created_at: string | null;
          deck_id: number;
          example_sentence: string | null;
          front_content: string;
          id: number;
        };
        Insert: {
          back_content: string;
          created_at?: string | null;
          deck_id: number;
          example_sentence?: string | null;
          front_content: string;
          id?: number;
        };
        Update: {
          back_content?: string;
          created_at?: string | null;
          deck_id?: number;
          example_sentence?: string | null;
          front_content?: string;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "flashcards_deck_id_fkey";
            columns: ["deck_id"];
            isOneToOne: false;
            referencedRelation: "flashcard_decks";
            referencedColumns: ["id"];
          },
        ];
      };
      follows: {
        Row: {
          created_at: string | null;
          follower_id: string;
          following_id: string;
          id: number;
        };
        Insert: {
          created_at?: string | null;
          follower_id: string;
          following_id: string;
          id?: number;
        };
        Update: {
          created_at?: string | null;
          follower_id?: string;
          following_id?: string;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey";
            columns: ["follower_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "follows_following_id_fkey";
            columns: ["following_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      languages: {
        Row: {
          code: string;
          id: number;
          name: string;
        };
        Insert: {
          code: string;
          id?: number;
          name: string;
        };
        Update: {
          code?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      matching_preferences: {
        Row: {
          availability_hours: Json | null;
          created_at: string | null;
          id: number;
          learning_goals: string[] | null;
          preferred_age_max: number | null;
          preferred_age_min: number | null;
          preferred_gender: string[] | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          availability_hours?: Json | null;
          created_at?: string | null;
          id?: number;
          learning_goals?: string[] | null;
          preferred_age_max?: number | null;
          preferred_age_min?: number | null;
          preferred_gender?: string[] | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          availability_hours?: Json | null;
          created_at?: string | null;
          id?: number;
          learning_goals?: string[] | null;
          preferred_age_max?: number | null;
          preferred_age_min?: number | null;
          preferred_gender?: string[] | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matching_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      matching_preferred_languages: {
        Row: {
          created_at: string | null;
          id: number;
          language_id: number | null;
          matching_preference_id: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          language_id?: number | null;
          matching_preference_id?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          language_id?: number | null;
          matching_preference_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "matching_preferred_languages_language_id_fkey";
            columns: ["language_id"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matching_preferred_languages_matching_preference_id_fkey";
            columns: ["matching_preference_id"];
            isOneToOne: false;
            referencedRelation: "matching_preferences";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          created_at: string | null;
          id: number;
          is_read: boolean | null;
          receiver_id: string | null;
          sender_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: number;
          is_read?: boolean | null;
          receiver_id?: string | null;
          sender_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: number;
          is_read?: boolean | null;
          receiver_id?: string | null;
          sender_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey";
            columns: ["receiver_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      post_comments: {
        Row: {
          content: string;
          created_at: string | null;
          id: number;
          post_id: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: number;
          post_id: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: number;
          post_id?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      post_likes: {
        Row: {
          created_at: string | null;
          id: number;
          post_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          post_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          post_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          content: string;
          created_at: string | null;
          id: number;
          language_id: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: number;
          language_id?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: number;
          language_id?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "posts_language_id_fkey";
            columns: ["language_id"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      proficiency_levels: {
        Row: {
          code: string;
          description: string | null;
          id: number;
          name: string;
          order_sequence: number;
        };
        Insert: {
          code: string;
          description?: string | null;
          id?: number;
          name: string;
          order_sequence: number;
        };
        Update: {
          code?: string;
          description?: string | null;
          id?: number;
          name?: string;
          order_sequence?: number;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          bio: string | null;
          country: string | null;
          created_at: string | null;
          dob: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          native_language: number | null;
          profile_picture_url: string | null;
          target_language: number | null;
          updated_at: string | null;
        };
        Insert: {
          bio?: string | null;
          country?: string | null;
          created_at?: string | null;
          dob?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          native_language?: number | null;
          profile_picture_url?: string | null;
          target_language?: number | null;
          updated_at?: string | null;
        };
        Update: {
          bio?: string | null;
          country?: string | null;
          created_at?: string | null;
          dob?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          native_language?: number | null;
          profile_picture_url?: string | null;
          target_language?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_native_language_fkey";
            columns: ["native_language"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_target_language_fkey";
            columns: ["target_language"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["id"];
          },
        ];
      };
      reports: {
        Row: {
          admin_notes: string | null;
          content_id: string;
          content_type: string;
          created_at: string | null;
          description: string | null;
          id: number;
          report_type: string;
          reported_id: string;
          reporter_id: string;
          resolved_at: string | null;
          status: string | null;
        };
        Insert: {
          admin_notes?: string | null;
          content_id: string;
          content_type: string;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          report_type: string;
          reported_id: string;
          reporter_id: string;
          resolved_at?: string | null;
          status?: string | null;
        };
        Update: {
          admin_notes?: string | null;
          content_id?: string;
          content_type?: string;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          report_type?: string;
          reported_id?: string;
          reporter_id?: string;
          resolved_at?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reports_reported_id_fkey";
            columns: ["reported_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_reporter_id_fkey";
            columns: ["reporter_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      reputation_points: {
        Row: {
          action_type: string;
          awarded_at: string | null;
          awarded_by: string | null;
          content_id: string | null;
          content_type: string | null;
          id: number;
          points: number;
          user_id: string;
        };
        Insert: {
          action_type: string;
          awarded_at?: string | null;
          awarded_by?: string | null;
          content_id?: string | null;
          content_type?: string | null;
          id?: number;
          points: number;
          user_id: string;
        };
        Update: {
          action_type?: string;
          awarded_at?: string | null;
          awarded_by?: string | null;
          content_id?: string | null;
          content_type?: string | null;
          id?: number;
          points?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reputation_points_awarded_by_fkey";
            columns: ["awarded_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reputation_points_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      subscription_tiers: {
        Row: {
          created_at: string | null;
          description: string | null;
          features: Json | null;
          id: number;
          is_active: boolean | null;
          name: string;
          price: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          features?: Json | null;
          id?: number;
          is_active?: boolean | null;
          name: string;
          price: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          features?: Json | null;
          id?: number;
          is_active?: boolean | null;
          name?: string;
          price?: number;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          achievement_id: number;
          completed: boolean | null;
          earned_at: string | null;
          id: number;
          progress: number | null;
          user_id: string;
        };
        Insert: {
          achievement_id: number;
          completed?: boolean | null;
          earned_at?: string | null;
          id?: number;
          progress?: number | null;
          user_id: string;
        };
        Update: {
          achievement_id?: number;
          completed?: boolean | null;
          earned_at?: string | null;
          id?: number;
          progress?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey";
            columns: ["achievement_id"];
            isOneToOne: false;
            referencedRelation: "achievements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_badges: {
        Row: {
          badge_id: number;
          earned_at: string | null;
          id: number;
          times_earned: number | null;
          user_id: string;
        };
        Insert: {
          badge_id: number;
          earned_at?: string | null;
          id?: number;
          times_earned?: number | null;
          user_id: string;
        };
        Update: {
          badge_id?: number;
          earned_at?: string | null;
          id?: number;
          times_earned?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "badges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_badges_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_flashcards: {
        Row: {
          created_at: string | null;
          ease_factor: number | null;
          flashcard_id: number;
          id: number;
          interval: number | null;
          next_review: string | null;
          review_count: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          ease_factor?: number | null;
          flashcard_id: number;
          id?: number;
          interval?: number | null;
          next_review?: string | null;
          review_count?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          ease_factor?: number | null;
          flashcard_id?: number;
          id?: number;
          interval?: number | null;
          next_review?: string | null;
          review_count?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_flashcards_flashcard_id_fkey";
            columns: ["flashcard_id"];
            isOneToOne: false;
            referencedRelation: "flashcards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_flashcards_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_languages: {
        Row: {
          id: number;
          language_id: number | null;
          type: string | null;
          user_id: string | null;
        };
        Insert: {
          id?: number;
          language_id?: number | null;
          type?: string | null;
          user_id?: string | null;
        };
        Update: {
          id?: number;
          language_id?: number | null;
          type?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_languages_language_id_fkey";
            columns: ["language_id"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_languages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_proficiency: {
        Row: {
          assessed_at: string | null;
          id: number;
          language_id: number;
          level_id: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          assessed_at?: string | null;
          id?: number;
          language_id: number;
          level_id: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          assessed_at?: string | null;
          id?: number;
          language_id?: number;
          level_id?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_proficiency_language_id_fkey";
            columns: ["language_id"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_proficiency_level_id_fkey";
            columns: ["level_id"];
            isOneToOne: false;
            referencedRelation: "proficiency_levels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_proficiency_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_streaks: {
        Row: {
          created_at: string | null;
          current_streak: number | null;
          id: number;
          last_activity_date: string | null;
          longest_streak: number | null;
          streak_start_date: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          current_streak?: number | null;
          id?: number;
          last_activity_date?: string | null;
          longest_streak?: number | null;
          streak_start_date?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          current_streak?: number | null;
          id?: number;
          last_activity_date?: string | null;
          longest_streak?: number | null;
          streak_start_date?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_streaks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null;
          created_at: string | null;
          end_date: string | null;
          id: number;
          payment_provider: string | null;
          provider_subscription_id: string | null;
          start_date: string;
          status: string | null;
          tier_id: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          auto_renew?: boolean | null;
          created_at?: string | null;
          end_date?: string | null;
          id?: number;
          payment_provider?: string | null;
          provider_subscription_id?: string | null;
          start_date: string;
          status?: string | null;
          tier_id: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          auto_renew?: boolean | null;
          created_at?: string | null;
          end_date?: string | null;
          id?: number;
          payment_provider?: string | null;
          provider_subscription_id?: string | null;
          start_date?: string;
          status?: string | null;
          tier_id?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_tier_id_fkey";
            columns: ["tier_id"];
            isOneToOne: false;
            referencedRelation: "subscription_tiers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          account_status: string | null;
          created_at: string | null;
          email: string;
          email_verified: boolean | null;
          id: string;
          is_active: boolean | null;
          is_deleted: boolean | null;
          last_login: string | null;
          updated_at: string | null;
          username: string;
        };
        Insert: {
          account_status?: string | null;
          created_at?: string | null;
          email: string;
          email_verified?: boolean | null;
          id: string;
          is_active?: boolean | null;
          is_deleted?: boolean | null;
          last_login?: string | null;
          updated_at?: string | null;
          username: string;
        };
        Update: {
          account_status?: string | null;
          created_at?: string | null;
          email?: string;
          email_verified?: boolean | null;
          id?: string;
          is_active?: boolean | null;
          is_deleted?: boolean | null;
          last_login?: string | null;
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [];
      };
      visits: {
        Row: {
          id: number;
          is_anonymous: boolean | null;
          visited_at: string | null;
          visited_id: string;
          visitor_id: string;
        };
        Insert: {
          id?: number;
          is_anonymous?: boolean | null;
          visited_at?: string | null;
          visited_id: string;
          visitor_id: string;
        };
        Update: {
          id?: number;
          is_anonymous?: boolean | null;
          visited_at?: string | null;
          visited_id?: string;
          visitor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "visits_visited_id_fkey";
            columns: ["visited_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "visits_visitor_id_fkey";
            columns: ["visitor_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
