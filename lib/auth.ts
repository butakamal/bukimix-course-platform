import { cache } from 'react'
import { createClient } from './supabase/server'

export const getAuthUser = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  return { supabase, userId: data?.claims?.sub ?? null }
})
