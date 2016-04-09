/* global $ */
$(function(){
    $('a.newItem').prop('href', '#{createAction}')

    var $toolbar = $('#toolbar')

    $toolbar.find('.ui.dropdown').dropdown({action: 'hide'})
    // $toolbar.visibility({ // duplicates menu.
    //     type: 'fixed',
    //     continuous: true
    // })
    $toolbar.find('.primary.submit').click(function(){
        $('[name=mainForm]').submit()
    })
    $toolbar.find('.secondary.reset').click(function(){
        $('[name=mainForm]').form('reset')
    })
})

// for mixin formToolbar
var deleteConfirmation = function(deleteApiUri, formValues, doneCallback) {
    var $deleteModal = $('#toolbar .ui.delete.modal')
    $deleteModal.modal({
        onApprove: function(){
            $.ajax({
                type: 'delete',
                data:  formValues,
                url: deleteApiUri,
                dataType: 'JSON',
                statusCode: {
                    204: function() {
                        $.get('/message/success/Deleted successfully')
                    },
                    501: function() {
                        $.get('/message/error/Error deleting')
                    }
                }
            })
            .done(function(response) {
               doneCallback()
            })
        }
    })
    $('#toolbar .delete.button').click(function(){
        $deleteModal.modal('show')
    })
}