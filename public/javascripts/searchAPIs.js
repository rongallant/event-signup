var debugMode = false

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
        console.log(response)
        return response
    },
    onSelect: function(result, response) {
        var address = []
        var components = result.address_components
        for (var x in components) {
            // convert to object
            switch(components[x]['types'][0]) {
                case 'street_number':
                   address += partVal(components[x]['short_name'])
                    break
                case 'route':
                   address += ' ' + partVal(components[x]['short_name'])
                    break
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
            }
            $('#address1').val(address)
            $('#address2').val('')
        }

        var location = result.geometry.location.lat + ', ' + result.geometry.location.lng
        $('#location').val(location)

        updateMap(result.formatted_address)
    }
}

function updateMap(query)
{
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

var localPersonSearch = {
    apiSettings: {
        url: '/api/person/search/{query}',
        onResponse: function(qResponse) {
            if (!qResponse) return
            var response = {
                results: []
            }
            $.each(qResponse.results, function(index, value) {
                var maxResults = 8
                if (index >= maxResults) return false
                var v = value['obj']
                response.results.push({
                    title: v.fullName,
                    description: v.nickName + '<br>' + v.email,
                    id: v.id
                })
            })
            return response;
        }
    },
    onSelect: function(result, response) {
        $('#mainPersonId').val(result.id)
    },
    minCharacters: 3,
    debug: debugMode,
    verbose: debugMode
}
