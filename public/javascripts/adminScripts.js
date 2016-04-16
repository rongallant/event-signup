/* global $ tinymce */
$(function(){
    $('a.newItem').prop('href', '#{createAction}')
    var $toolbar = $('#toolbar')
    $toolbar.find('.ui.dropdown').dropdown({action: 'hide'})
    $toolbar.find('.primary.submit').click(function(){
        $('[name=mainForm]').submit()
    })
    $toolbar.find('.secondary.reset').click(function(){
        $('[name=mainForm]').form('reset')
    })
    $('.personSelector.ui.dropdown')
        .dropdown({
            apiSettings: {
                url: '/api/persons/dropdown/results?simple=1'
            }
        }
    )
    $('.countries.ui.dropdown').dropdown()
})
var tinymceConfig = {
    skin: 'light',
    theme: 'modern',
    plugins: "code",
    toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | code",
    menubar: false,
    content_css: [
        '/lib/semantic/dist/semantic.min.css',
        '/stylesheets/style.css'
    ],
    setup: function (editor) {
        editor.on('change', function () {
            tinymce.triggerSave()
        })
    }
}
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