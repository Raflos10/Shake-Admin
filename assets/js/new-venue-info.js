document.addEventListener('DOMContentLoaded', async function() {
    const detailsDiv = document.getElementById('place-details')
    const createBtn = document.getElementById('create-venue-btn')
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

    const urlParams = new URLSearchParams(window.location.search)
    const placeId = urlParams.get('place_id')

    if (!placeId) {
        showMessage('No place ID provided.', true)
        return
    }

    let place
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/lookup?format=json&osm_ids=${placeId}`)
        const results = await response.json()
        if (results.length === 0) {
            showMessage('Place not found.', true)
            return
        }
        place = results[0]
    } catch (error) {
        showMessage('Error fetching place details: ' + error.message, true)
        return
    }

    // Display place details
    const address = place.address || {}
    detailsDiv.innerHTML = `
        <p><strong>Display Name:</strong> ${place.display_name}</p>
        <p><strong>OSM Type:</strong> ${place.osm_type}</p>
        <p><strong>OSM ID:</strong> ${place.osm_id}</p>
        <p><strong>Place ID:</strong> ${place.place_id}</p>
        <p><strong>Bounding Box:</strong> ${place.boundingbox ? place.boundingbox.join(', ') : 'N/A'}</p>
        <p><strong>Country:</strong> ${address.country || 'N/A'}</p>
        <p><strong>City:</strong> ${address.city || address.town || address.village || 'N/A'}</p>
        <p><strong>Postal Code:</strong> ${address.postcode || 'N/A'}</p>
        <p><strong>Subdivision:</strong> ${address.state || 'N/A'}</p>
        <p><strong>Coordinates:</strong> ${place.lat}, ${place.lon}</p>
    `

    createBtn.addEventListener('click', async function() {
        const venueData = {
            country: (address.country_code || '').toUpperCase(),
            location_name: place.display_name.split(',')[0],
            address_1: (address.house_number ? address.house_number + ' ' : '') + (address.road || ''),
            address_2: address.suburb || address.neighbourhood || '',
            city: address.city || address.town || address.village || address.hamlet || '',
            postal_code: address.postcode || '',
            subdivision: address.state || address.county || '',
            coordinates: { x: parseFloat(place.lat), y: parseFloat(place.lon) }
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('venues')
                .insert([venueData])

            if (error) {
                showMessage('Error creating venue: ' + error.message, true)
            } else {
                showMessage('Venue created successfully!')
                setTimeout(() => {
                    window.location.href = '/dashboard.html'
                }, 2000)
            }
        } catch (error) {
            showMessage('Error: ' + error.message, true)
        }
    })
})