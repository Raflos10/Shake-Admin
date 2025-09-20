const SUPABASE_URL = window.SUPABASE_CONFIG?.url || ''
const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG?.key || ''

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables. Please check your .env file.')
}

const { createClient } = supabase
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

window.supabaseClient = supabaseClient

window.checkAuth = async function() {
    const { data: { session } } = await supabaseClient.auth.getSession()

    const currentPath = window.location.pathname
    const isLoginPage = currentPath === '/' || currentPath.includes('index.html')
    const isDashboardPage = currentPath.includes('dashboard')

    if (session && isLoginPage) {
        window.location.href = '/dashboard.html'
    } else if (!session && isDashboardPage) {
        window.location.href = '/'
    }

    return session
}
