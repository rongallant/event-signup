var debugMode = true

var googleAddressSearch = {
    apiSettings: {
        url: '//maps.googleapis.com/maps/api/geocode/json?address={query}'
    },
    fields: {
        results: 'results',
        category: 'geometry',
        title: 'formatted_address'
    },
    minCharacters : 3,
    debug: debugMode,
    verbose: debugMode
}

var googleAddressSearchAndPopulate = {
    apiSettings: {
        url: '//maps.googleapis.com/maps/api/geocode/json?&components=administrative_area&address={query}'
    },
    fields: {
        results: 'results',
        category: 'geometry',
        title: 'formatted_address'
    },
    minCharacters: 3,
    debug: debugMode,
    verbose: debugMode,
    onResults : function(response) {
        return response
    },
    onSelect: function(result, response) {
        var address = []
        var components = result.address_components
        for (var x in components) {
            switch(components[x]['types'][0]) {
                case 'locality':
                    $('#city').val(components[x]['short_name'])
                    break
                case 'administrative_area_level_1':
                    $('#state').val(components[x]['short_name'])
                    break
                case 'postal_code':
                    $('#postalCode').val(components[x]['short_name'])
                    break
                case 'country':
                    $('#country').val(components[x]['long_name'])
                    break
                case 'street_number':
                   address += partVal(components[x]['short_name'])
                    break
                case 'route':
                   address += ' ' + partVal(components[x]['short_name'])
                    break
            }
            $('#address2').val('')
            $('#address1').val(address)
        }
        var location = result.geometry.location.lat + ', ' + result.geometry.location.lng
        $('#location').val(location)
        updateMap(result.formatted_address)
        return false
    }
}

function updateMap(query) {
    if (query) {
        var gMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCszYBdD5JzHMDPJcdcCR0R7HWTcykLPpE&q=' + query
        $('#gMap').attr('data-url', gMap).embed().closest('rail').removeClass('hidden')
    } else {
        $('#gMap').closest('rail').addClass('hidden')
    }
}

function partVal(val) {
    return (val === 'undefined') ? '' : val
}

// Check var exists
function u(variabl) {
    if (typeof variabl === "undefined") {
        return ''
    } else if (variabl.length == 0) {
        return ''
    } else {
        return variabl
    }
}

var localPersonSearch = {
    apiSettings: {
        url: '/api/persons/search/{query}',
        onResponse: function(qResponse) {
            console.table(qResponse)
            if (!qResponse) return
            var response = {
                results: []
            }
            $.each(qResponse, function(index, value) {
                var maxResults = 8
                if (index >= maxResults) return false
                var v = value
                var desc = ''
                desc = ( u(v.nickName) ? v.nickName + '<br>' : '') + ( u(v.email) ? v.email : '')
                console.table(v)
                response.results.push({
                    title: v.fullName,
                    description: desc,
                    id: v.id
                })
            })
            console.table(response)
            return response;
        }
    },
    onSelect: function(result, response) {
        $(this).closest('.personSelector').find('input[type=hidden]').val(result.id)
    },
    minCharacters: 3,
    debug: debugMode,
    verbose: debugMode
}

var localAddressSearch = {
    apiSettings: {
        url: '/api/addresses/search/{query}',
        onResponse: function(qResponse) {
            if (!qResponse) return
            var response = {
                results: []
            }
            $.each(qResponse, function(index, value) {
                var maxResults = 8
                if (index >= maxResults) return false
                var v = value
                var title = ((v.name) ? v.name : v.shortAddress)
                var desc = ((v.fullAddress) ? v.fullAddress : '')
                response.results.push({
                    title: title,
                    description: desc,
                    id: v.id
                })
            })
            return response;
        }
    },
    onSelect: function(result, response) {
        $(this).closest('.addressSelector').find('input[type=hidden]').val(result.id)
    },
    minCharacters: 3,
    debug: debugMode,
    verbose: debugMode
}
