/* global location $ noty */

function toaster(type, text) {
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

$.fn.formatPhone = function() {
    $(this).each(function(index) {
        $(this).html($(this).text().replace(/(\d{3})\-?(\d{3})\-?(\d{4})/, '$1-$2-$3'))
    })
}

$(function() {
    $.fn.modal.settings.allowMultiple = false
    $.fn.modal.settings.transition = 'vertical flip'
    $('.tel').formatPhone()
    $('[data-content], [data-title]').popup()
    var maxLengthCounterOptions = {
        optoutputdiv: ''
    }
    $('textarea[data-maxsize]').maxLengthCounter()
})
