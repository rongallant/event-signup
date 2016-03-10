
function initSelectorModalButton(selectorId, maxLength, callback) {
    if ($(selectorId).find('.listOut .item').length >= maxLength) {
        $(selectorId).find('.addEntry').hide()
    } else {
        $(selectorId).find('.addEntry').show()
        $(selectorId).find('.addEntry').click(function(){
            $(selectorId + 'Modal')
                .modal('setting', 'transition', 'vertical flip')
                .modal('show')
            if (typeof(callback) !== 'undefined') {
                callback(selectorId + 'Modal')
            }
        })
    }
}

function initTrash(selectorId, maxListLength, rowItem, currentRows, callback) {
    var $listItems = $(selectorId).find('.listOut .item .trash')
    $listItems.click(function(index, value) {
        currentRows.splice($listItems.index(this), 1) // Delete from array
        selectorPopulateRows(selectorId, maxListLength, rowItem, currentRows)
        if (typeof(callback) !== 'undefined') {
            callback()
        }
    })
}

function selectorPopulateRows(selectorId, maxListLength, rowItem, currentRows)
{
    // Pre populate list
    var $selector = $(selectorId)
    $selector.find('.listOut').empty() // Empty list
    $.each(currentRows, function(index, value) {
        if (typeof value != 'undefined') {
            if (typeof index == 'undefined') index = 0
            $selector.find('.listOut').append(rowItem(index, value))
        }
    })
    $selector.find('.selectorCount').html((currentRows.length) + ' of ' + maxListLength)
    initTrash(selectorId, maxListLength, rowItem, currentRows)
    initSelectorModalButton(selectorId, maxListLength)
}

function initSelector(selectorId, maxListLength, rowItem, currentRows, formRules) {
    var $itemsModal = $(selectorId + 'Modal').modal()
    initSelectorModalButton(selectorId, maxListLength)
    selectorPopulateRows(selectorId, maxListLength, rowItem, currentRows)
    $itemsModal.find('form').form({
        fields: formRules,
        inline : true,
        onSuccess: function(event, fields)
        {
            if (currentRows.length < maxListLength) {
                currentRows.push(fields) // Add to array
                selectorPopulateRows(selectorId, maxListLength, rowItem, currentRows)
                initSelectorModalButton(selectorId, maxListLength)
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
