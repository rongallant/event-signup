
function initAddButton(selectorId, maxLength, callback) {
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

function initTrash(selectorId, maxLength, callback) {
    $(selectorId).find('.listOut .item .trash').click(function() {
        $(this).closest('.item').remove()
        initAddButton(selectorId, maxLength)
        if (typeof(callback) !== 'undefined') {
            callback()
        }
    })
}

function initSelector(selectorId, maxListLength, rowItem, currentRows, formRules) {
    var $selector = $(selectorId)
    var $itemsModal = $(selectorId + 'Modal').modal() // init modal
    initAddButton(selectorId, maxListLength)
    initTrash(selectorId, maxListLength)
    $selector.find('.listOut').empty();
    if (rowItem && currentRows) {
        $.each(currentRows, function(i, fields) {
            $selector.find('.listOut').append(rowItem(fields))
        })
    }
    $itemsModal.find('form').form({
        fields: formRules,
        inline : true,
        onSuccess: function(event, fields) {
            $selector.find('.listOut').append(rowItem(fields))
            initAddButton(selectorId, maxListLength)
            initTrash(selectorId, maxListLength)
            $(this).form('reset')
            $itemsModal.modal('hide')
            return false
        }
    })
}
