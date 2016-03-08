function toaster(type, text) {
    /* global noty */
    return noty({
        type: type,
        text: text,
        layout: 'topRight',
        theme: 'relax',
        dismissQueue: true,
        maxVisible: 5,
        animation: {
            open: {height: 'toggle'},
            close: {height: 'toggle'},
            easing: 'swing',
            speed: 500
        },
        timeout: 3000
    })
}

function ajaxRequest(fieldData, formMethod, apiUri, successMsg, successRelocate) {
    $.ajax({
        type: formMethod,
        data: fieldData,
        url: apiUri,
        dataType: 'JSON'
    }).done(function(response) {
        console.log('RESPONSE')
        $.get( "/message/success/" + successMsg)
        location.replace(successRelocate)
    })
}