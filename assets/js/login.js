document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form')
    const messageDiv = document.getElementById('message')

    function showMessage(text, isError = false) {
        messageDiv.textContent = text
        messageDiv.style.color = isError ? 'red' : 'green'
    }

    window.checkAuth()

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault()

        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        try {
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            })

            if (error) {
                showMessage('Login failed: ' + error.message, true)
            } else {
                showMessage('Login successful! Redirecting...')
                setTimeout(() => {
                    window.location.href = '/dashboard.html'
                }, 1000)
            }
        } catch (error) {
            showMessage('Login failed: ' + error.message, true)
        }
    })
})
