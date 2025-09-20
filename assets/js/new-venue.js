document.addEventListener('DOMContentLoaded', async function() {
    const form = document.getElementById('new-venue-form')
    const messageDiv = document.getElementById('message')

    function showMessage(text, isError = false) {
        messageDiv.textContent = text
        messageDiv.style.color = isError ? 'red' : 'green'
    }

    const session = await window.checkAuth()

    if (!session) {
        showMessage('Not authenticated. Redirecting to login...', true)
        setTimeout(() => {
            window.location.href = '/'
        }, 2000)
        return
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault()

        const formData = new FormData(form)
        const venueData = {
            country: formData.get('country'),
            location_name: formData.get('location_name'),
            address_1: formData.get('address_1'),
            address_2: formData.get('address_2') || null,
            city: formData.get('city'),
            postal_code: formData.get('postal_code') || null,
            subdivision: formData.get('subdivision') || null,
            coordinates: formData.get('coordinates') || null
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('venues')
                .insert([venueData])

            if (error) {
                showMessage('Error creating venue: ' + error.message, true)
            } else {
                showMessage('Venue created successfully!')
                form.reset()
                setTimeout(() => {
                    window.location.href = '/dashboard.html'
                }, 2000)
            }
        } catch (error) {
            showMessage('Error: ' + error.message, true)
        }
    })
})