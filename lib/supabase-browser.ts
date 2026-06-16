"use client";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseEnabled } from "./supabase";

/** Cliente para Client Components (login, mutações via supabase-js) */
export function createSupabaseBrowser() {
  if (!isSupabaseEnabled) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
