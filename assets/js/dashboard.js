document.addEventListener('DOMContentLoaded', async function() {
    const userEmailSpan = document.getElementById('user-email')
    const logoutBtn = document.getElementById('logout-btn')
    const userDataDiv = document.getElementById('user-data')
    const messageDiv = document.getElementById('message')

    function showMessage(text, isError = false) {
        messageDiv.textContent = text
        messageDiv.style.color = isError ? 'red' : 'green'
    }

    const session = await window.checkAuth()

    try {
        const { data: { session: currentSession }, error } = await window.supabaseClient.auth.getSession()

        if (error || !currentSession) {
            showMessage('Not authenticated. Redirecting to login...', true)
            setTimeout(() => {
                window.location.href = '/'
            }, 2000)
            return
        }

        const user = currentSession.user
        userEmailSpan.textContent = user.email

        userDataDiv.innerHTML = `
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>User ID:</strong> ${user.id}</p>
            <p><strong>Created:</strong> ${new Date(user.created_at).toLocaleString()}</p>
            <p><strong>Last Sign In:</strong> ${new Date(user.last_sign_in_at).toLocaleString()}</p>
        `

    } catch (error) {
        showMessage('Error loading user data: ' + error.message, true)
    }

    logoutBtn.addEventListener('click', async function() {
        try {
            const { error } = await window.supabaseClient.auth.signOut()

            if (error) {
                showMessage('Logout failed: ' + error.message, true)
            } else {
                showMessage('Logged out successfully! Redirecting...')
                setTimeout(() => {
                    window.location.href = '/'
                }, 1000)
            }
        } catch (error) {
            showMessage('Logout failed: ' + error.message, true)
        }
    })
})
