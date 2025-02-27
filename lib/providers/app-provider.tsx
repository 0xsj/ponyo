import { createAuthModule } from '@/api/auth/auth.module';
import { supabase, TypedSupabaseClient } from '../supabase/client/supabase-client';
import React from 'react';

const authModule = createAuthModule(supabase);