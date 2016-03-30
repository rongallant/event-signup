
// Ajax Delete Call
function deleteSelection(apiUri) {
    /* global toaster */
    $.ajax({
        type: 'delete',
        url: apiUri,
        dataType: 'JSON',
        statusCode: {
            501: function() {
                $.get('/message/error/Error deleting')
            }
        }
    })
    .error(function(response) {
        console.log('error deleting')
        console.log(response)
        if (response.message) {
            toaster('error', response.message)
        } else {
            toaster('error', response.statusText)
        }
    })
    .done(function(response) {
        console.log('deleted')
        console.log(response)
        if (response.message) {
            toaster('success', response.message)
        } else {
            toaster('success', response.statusText)
        }
    })
}

// Ajax create Call
function createItem(apiUri, fields) {
    /* global toaster */
    $.ajax({
        type: 'post',
        url: apiUri,
        data: fields,
        dataType: 'JSON',
        statusCode: {
            501: function() {
                $.get('/message/error/Error creating')
            }
        }
    })
    .error(function(response) {
        console.log('error creating')
        console.log(response)
        if (response.message) {
            toaster('error', response.message)
        } else {
            toaster('error', response.statusText)
        }
    })
    .done(function(response) {
        console.log('created')
        console.log(response)
        if (response.message) {
            toaster('success', response.message)
        } else {
            toaster('success', response.statusText)
        }
    })
}

function initSelectorModalButton(selectorId, maxLength, callback) {
    if ($(selectorId).find('.listOut .item').length >= maxLength) {
        $(selectorId).find('.addEntry').hide()
    } else {
        $(selectorId).find('.addEntry').show()
        $(selectorId).find('.addEntry').click(function(){
            $(selectorId + 'Modal')
                .modal('setting', 'transition', 'vertical flip')
                .modal('show')
            if (callback !== 'undefined' && callback) {
                callback(selectorId + 'Modal')
            }
        })
    }
}

// Delete Item
function initTrash(selectorId, maxListLength, rowItem, currentRows, apiUri) {
    var $listItems = $(selectorId).find('.listOut .item .trash')
    $listItems.click(function(index, value) {
        if (apiUri !== 'undefined' && apiUri) {
            var deleted = deleteSelection(apiUri + currentRows[$listItems.index(this)]._id)
            console.log(deleted)
        }
        currentRows.splice($listItems.index(this), 1) // Delete from array
        selectorPopulateRows(selectorId, maxListLength, rowItem, currentRows, apiUri)
    })
}

function selectorPopulateRows(selectorId, maxListLength, rowItem, currentRows, apiUri)
{
    // Pre populate list
    var $selector = $(selectorId)
    $selector.find('.listOut').empty() // Empty list
    $.each(currentRows, function(index, value) {
        if (value !== 'undefined' && value) {
            if (index !== 'undefined' && index) index = 0
            $selector.find('.listOut').append(rowItem(index, value))
        }
    })
    $selector.find('.selectorCount').html((currentRows.length) + ' of ' + maxListLength)
    initTrash(selectorId, maxListLength, rowItem, currentRows, apiUri)
    initSelectorModalButton(selectorId, maxListLength)
}

function initSelector(selectorId, maxListLength, rowItem, currentRows, formRules, apiUri) {
    var $itemsModal = $(selectorId + 'Modal').modal()
    initSelectorModalButton(selectorId, maxListLength)
    selectorPopulateRows(selectorId, maxListLength, rowItem, currentRows, apiUri)
    $itemsModal.find('form').form({
        fields: formRules,
        inline : true,
        onSuccess: function(event, fields)
        {
            if (currentRows.length < maxListLength) {
                initSelectorModalButton(selectorId, maxListLength)
                if (apiUri !== 'undefined' && apiUri) {
                    createItem(apiUri, fields)
                }
                currentRows.push(fields) // Add to array
                selectorPopulateRows(selectorId, maxListLength, rowItem, currentRows, apiUri)
                $(this).form('reset')
                $itemsModal.modal('hide')
            } else {
                console.error('\nFailed adding row')
                console.error('currentRow = ' + JSON.stringify(currentRows))
                console.error(selectorId + ' results = ' + currentRows.length + ' of ' + maxListLength)
            }
            return false
        }
    })
}
