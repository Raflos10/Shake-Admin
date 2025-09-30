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
        window.location.href = window.BASEURL + '/dashboard.html'
    } else if (!session && isDashboardPage) {
        window.location.href = window.BASEURL || '/'
    }

    return session
}

window.logout = async function() {
    try {
        const { error } = await window.supabaseClient.auth.signOut()
        if (error) {
            alert('Logout failed: ' + error.message)
        } else {
            alert('Logged out successfully!')
            setTimeout(() => {
                window.location.href = window.BASEURL || '/'
            }, 1000)
        }
    } catch (error) {
        alert('Logout failed: ' + error.message)
    }
}
