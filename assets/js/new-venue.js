document.addEventListener('DOMContentLoaded', async function() {
    const searchInput = document.getElementById('search-input')
    const searchBtn = document.getElementById('search-btn')
    const resultsDiv = document.getElementById('results')
    const messageDiv = document.getElementById('message')

    function showMessage(text, isError = false) {
        messageDiv.textContent = text
        messageDiv.style.color = isError ? 'red' : 'green'
    }

    const session = await window.checkAuth()

    if (!session) {
        showMessage('Not authenticated. Redirecting to login...', true)
        setTimeout(() => {
            window.location.href = window.BASEURL || '/'
        }, 2000)
        return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const initialQuery = urlParams.get('query')

    if (initialQuery) {
        searchInput.value = initialQuery
        performSearch(initialQuery)
    }

    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault()
        const query = searchInput.value.trim()
        if (!query) {
            showMessage('Please enter a search query.', true)
            return
        }
        window.location.search = '?query=' + encodeURIComponent(query)
    })

    async function performSearch(query) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=en`)
            const results = await response.json()
            if (results.length > 0) {
                displayResults(results)
            } else {
                showMessage('No results found.', true)
            }
        } catch (error) {
            showMessage('Error searching: ' + error.message, true)
        }
    }

    function displayResults(places) {
        resultsDiv.innerHTML = '<h3>Select a location:</h3>'
        places.forEach(place => {
            const div = document.createElement('div')
            const osmId = place.osm_type.charAt(0).toUpperCase() + place.osm_id
            div.innerHTML = `<p><a href="${window.BASEURL}/new-venue-info.html?place_id=${osmId}"><strong>${place.display_name}</strong></a></p>`
            resultsDiv.appendChild(div)
        })
    }


})