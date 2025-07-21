'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

// ✅ Create a new companion
export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('companions')
    .insert({ ...formData, author })
    .select();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create companion');
  }

  return data[0];
};

// ✅ Get all companions (with filters)
export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
  const supabase = createSupabaseClient();

  let query = supabase
    .from('companions')
    .select('*', { count: 'exact' });

  if (subject) {
    query = query.ilike('subject', `%${subject}%`);
  }

  if (topic && topic.toString().trim()) {
    const topicValue = Array.isArray(topic) ? topic[0] : topic;
    query = query.or(`topic.ilike.%${topicValue}%,name.ilike.%${topicValue}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return companions;
};

// ✅ Get single companion by ID
export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('companions')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

// ✅ Add companion to session history
export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('session_history')
    .insert({
      companion_id: companionId,
      user_id: userId,
    });

  if (error) throw new Error(error.message);

  return data;
};

// ✅ Get recent session companions
export const getRecentSessions = async (limit = 10) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('session_history')
    .select(`companion_id (*)`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data
    .map((entry) => entry.companion_id)
    .filter(Boolean);
};

// ✅ Get user's session companions
export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('session_history')
    .select(`companion_id (*)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data
    .map((entry) => entry.companion_id)
    .filter(Boolean);
};

// ✅ Get companions created by a user
export const getUserCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('companions')
    .select()
    .eq('author', userId);

  if (error) throw new Error(error.message);

  return data;
};
