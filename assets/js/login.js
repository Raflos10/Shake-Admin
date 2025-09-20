document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form')
    const signupBtn = document.getElementById('signup-btn')
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

    signupBtn.addEventListener('click', async function() {
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        if (!email || !password) {
            showMessage('Please enter email and password first', true)
            return
        }

        try {
            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password
            })

            if (error) {
                showMessage('Signup failed: ' + error.message, true)
            } else {
                showMessage('Signup successful! Check your email for verification.')
            }
        } catch (error) {
            showMessage('Signup failed: ' + error.message, true)
        }
    })
})
