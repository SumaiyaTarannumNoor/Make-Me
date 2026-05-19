import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const callerClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })
    const { data: { user: caller } } = await callerClient.auth.getUser()
    if (!caller) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { data: roles } = await adminClient
      .from('user_roles').select('role').eq('user_id', caller.id).eq('role', 'admin')

    if (!roles?.length) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Fetch profiles
    const { data: profiles } = await adminClient
      .from('profiles')
      .select('user_id, email, full_name, is_premium, created_at')
      .order('created_at', { ascending: false })

    // Fetch auth users for last_sign_in_at (paginate)
    const authUsersMap = new Map<string, { last_sign_in_at: string | null; created_at: string }>()
    let page = 1
    while (true) {
      const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 1000 })
      if (error) break
      for (const u of data.users) {
        authUsersMap.set(u.id, { last_sign_in_at: u.last_sign_in_at ?? null, created_at: u.created_at })
      }
      if (data.users.length < 1000) break
      page++
    }

    const ACTIVE_WINDOW_MS = 5 * 60 * 1000 // active if signed in within last 5 minutes
    const now = Date.now()

    const users = (profiles ?? []).map((p: any) => {
      const auth = authUsersMap.get(p.user_id)
      const last = auth?.last_sign_in_at ?? null
      const isActive = last ? (now - new Date(last).getTime()) < ACTIVE_WINDOW_MS : false
      return {
        ...p,
        last_sign_in_at: last,
        is_active: isActive,
        registered_at: auth?.created_at ?? p.created_at,
      }
    })

    return new Response(JSON.stringify({ users }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
