
function initAddButton(selectorId, maxLength) {
    if ($(selectorId).find('.listOut .item').length >= maxLength) {
        $(selectorId).find('.addEntry').hide()
    } else {
        $(selectorId).find('.addEntry').show()
        $(selectorId).find('.addEntry').click(function(){
            $(selectorId + 'Modal')
                .modal('setting', 'transition', 'vertical flip')
                .modal('show')
        })
    }
}

function initTrash(selectorId, maxLength) {
    $(selectorId).find('.listOut .item .trash').click(function() {
        $(this).closest('.item').remove()
        initAddButton(selectorId, maxLength)
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
