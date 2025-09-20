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
            <p><strong>User ID:</strong> ${user.id}</p>
            <p><strong>Created:</strong> ${new Date(user.created_at).toLocaleString()}</p>
            <p><strong>Last Sign In:</strong> ${new Date(user.last_sign_in_at).toLocaleString()}</p>
        `

        // Fetch and display venues
        const { data: venues, error: venuesError } = await supabaseClient.from('venues').select('*')

        if (venuesError) {
            showMessage('Error loading venues: ' + venuesError.message, true)
        } else {
            document.getElementById('venues-count').textContent = venues.length
            const tbody = document.getElementById('venues-tbody')
            tbody.innerHTML = '' // Clear any existing rows
            venues.forEach(venue => {
                const row = document.createElement('tr')
                row.innerHTML = `
                    <td>${venue.id}</td>
                    <td><a href="/venue.html?id=${venue.id}">${venue.location_name}</a></td>
                    <td>${venue.address_1}${venue.address_2 ? ', ' + venue.address_2 : ''}</td>
                    <td>${venue.city}</td>
                    <td>${venue.country}</td>
                    <td>${new Date(venue.created_at).toLocaleString()}</td>
                `
                tbody.appendChild(row)
            })
        }

    } catch (error) {
        showMessage('Error loading dashboard data: ' + error.message, true)
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
