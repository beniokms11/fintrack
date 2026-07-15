import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Detect if Supabase is unconfigured (using placeholder URL)
  const isSupabasePlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                                process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

  if (isSupabasePlaceholder) {
    return supabaseResponse
  }

  // Fetch session to refresh auth token if needed
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect all non-auth routes
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register') || request.nextUrl.pathname.startsWith('/forgot-password')
  
  // Public routes (if any)
  const isPublicRoute = request.nextUrl.pathname.startsWith('/api/') || request.nextUrl.pathname === '/manifest.json' || request.nextUrl.pathname.startsWith('/auth/callback') || request.nextUrl.pathname.startsWith('/update-password')

  const isOfflineMode = request.cookies.get('fintrack_mode')?.value === 'offline'

  if (isOfflineMode) {
    if (isAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  if (!user && !isAuthRoute && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
