/* global $ */

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
        return response
    },
    onSelect: function(result, response) {
        var address = []
        var point_of_interest = null
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
                    var countryField = $('#countryField')
                    countryField.dropdown('set value', components[x]['short_name'].toUpperCase())
                    countryField.dropdown({action: 'activate'})
                    break
                case 'point_of_interest':
                    point_of_interest = partVal(components[x]['short_name'])
                    break
                case 'street_number':
                    address += partVal(components[x]['short_name'])
                    break
                case 'route':
                    address += ' ' + partVal(components[x]['short_name'])
                    break
            }
        }
        if (point_of_interest != null) {
            $('#address1').val(point_of_interest)
            $('#address2').val(address)
        } else {
            $('#address1').val(address)
            $('#address2').val('')
        }
        var location = result.geometry.location.lat + ', ' + result.geometry.location.lng
        $('#location').val(location)
        updateMap(result.formatted_address)
        return false
    }
}

var updateMap = function(query) {
    if (query) {
        var gMap = '//www.google.com/maps/embed/v1/place?key=AIzaSyCszYBdD5JzHMDPJcdcCR0R7HWTcykLPpE&q=' + query
        $('#gMap').attr('data-url', gMap).embed().closest('rail').removeClass('hidden')
    } else {
        $('#gMap').closest('rail').addClass('hidden')
    }
}

var partVal = function(val) {
    return (val === 'undefined') ? '' : val
}

var u = function(variabl) {
    if (typeof variabl === "undefined") {
        return ''
    } else if (variabl.length == 0) {
        return ''
    } else {
        return variabl
    }
}

var localAddressSearch = {
    apiSettings: {
        url: '/api/addresses?q={query}',
        onResponse: function(qResponse) {
            if (!qResponse) return
            var response = {
                results: []
            }
            $.each(qResponse.docs, function(index, value) {
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
