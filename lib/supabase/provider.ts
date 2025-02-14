import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "./client/supabase-client";
import { SupabaseMapper } from "./mapper";
import {
  IAuthCore,
  IAuthProvider,
  AuthSession,
  AuthCredentials,
  OAuthProvider,
  AuthEventPayload,
  AuthUser,
  AuthResult,
} from "../core";

export class SupabaseAuthProvider implements IAuthProvider {
  private client: SupabaseClient;

  constructor() {
    this.client = supabase;
  }

  async initialize(): Promise<void> {
    try {
      const {
        data: { session },
      } = await this.client.auth.getSession();
      if (!session) {
        console.log("No session found during initalization");
      }
    } catch (error) {
      console.error("Error initializing auth: ", error);
      throw error;
    }
  }

  async signIn(credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      return {
        data: SupabaseMapper.toAuthSession(data.session),
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: {
          code: error.code || "auth/unknown",
          message: error.message || "An error occured during sing in ",
          details: error.details,
        },
      };
    }
  }

  async signUp(credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
    try {
      const { data, error } = await this.client.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      return {
        data: SupabaseMapper.toAuthSession(data.session),
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: {
          code: error.code || "auth/unknown",
          message: error.message || "An error occurred during sign up",
          details: error.details,
        },
      };
    }
  }
  async signOut(): Promise<AuthResult<void>> {
    try {
      const { error } = await this.client.auth.signOut();
      if (error) throw error;
      return { data: null, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: {
          code: error.code || "auth/unknown",
          message: error.message || "An error occurred during sign out",
          details: error.details,
        },
      };
    }
  }
  async getUser(): Promise<AuthResult<AuthUser>> {
    try {
      const {
        data: { user },
        error,
      } = await this.client.auth.getUser();
      if (error) throw error;

      return {
        data: SupabaseMapper.toAuthUser(user),
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: {
          code: error.code || "auth/unknown",
          message: error.message || "Failed to get user",
          details: error.details,
        },
      };
    }
  }

  async updateUser(data: Partial<AuthUser>): Promise<AuthResult<AuthUser>> {
    try {
      const {
        data: { user },
        error,
      } = await this.client.auth.updateUser({
        email: data.email,
        data: data.metadata,
      });

      if (error) throw error;

      return {
        data: SupabaseMapper.toAuthUser(user),
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: {
          code: error.code || "auth/unknown",
          message: error.message || "Failed to update user",
          details: error.details,
        },
      };
    }
  }

  async resetPassword(email: string): Promise<AuthResult<void>> {
    try {
      const { error } = await this.client.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { data: null, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: {
          code: error.code || "auth/unknown",
          message: error.message || "Failed to reset password",
          details: error.details,
        },
      };
    }
  }

  async updatePassword(newPassword: string): Promise<AuthResult<void>> {
    try {
      const { error } = await this.client.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { data: null, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: {
          code: error.code || "auth/unknown",
          message: error.message || "Failed to update password",
          details: error.details,
        },
      };
    }
  }

  async destroy(): Promise<void> {
    await this.signOut();
  }
}
