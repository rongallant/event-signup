
$.fn.setPhoneValue = function(value) {
    $(this).attr('href', 'tel:' + value).html(value)
    return this
}

$.fn.setEmailValue = function(value) {
    $(this).attr('href', 'mailto:' + value).html(value)
    return this
}

$.fn.emergencyContactScripts = function(ecData)
{
    var $instance = this
    var $ecadd = $instance.find('.ecadd')
    var $ecview = $instance.find('.ecview')
    var $ecedit = $instance.find('.ecedit')

    this.ecData = ecData
    this.ajaxCall
    this.contactId

    this.setAjaxCall = function(uri) {
        this.ajaxCall = uri
        return this
    }

    this.populateView = function() {
        $ecview.find('[data-fullName]').html(ecData.fullName)
        $ecview.find('[data-phone]').setPhoneValue(ecData.phone)
        $ecview.find('[data-email]').setEmailValue(ecData.email)
        return this
    }

    this.newContactButton = function()
    {
        $ecadd.find('.add.button').click(function(){
             $ecadd.transition({
                animation : 'scale out',
                onComplete: function() {
                    $ecedit.transition('scale in')
                    return false
                }
            })
            return false
        })
        return this
    }

    this.editContactButton = function()
    {
        $ecview.find('.edit.button').click(function(){
             $ecview.transition({
                animation: 'scale out',
                onComplete: function() {
                    $instance.initForm()
                    $ecedit.transition('scale in')
                    return false
                }
            })
            return false
        })
        return this
    }

    this.cancelEdit = function() {
        $ecedit.transition({
            animation: 'scale out',
            onComplete: function() {
                 $ecview.transition('scale in')
                return false
            }
        })
        return this
    }
    this.cancelEditButton = function()
    {
        $ecedit.find('.cancel.button').click(function(){
            $instance.cancelEdit()
            return false
        })
        return this
    }

    // CREATE / SAVE
    this.initForm = function()
    {
        var $form =  $('form[name=emergencyContactForm]')

        $form.form({
            fields: {
                fullName : {rules:[{type:'empty'}, {type:'maxLength[70]'}]},
                phone : {rules:[{type:'empty'}, {type:'maxLength[15]'}]},
                email : {rules:[{type:'maxLength[254]'}, {type:'email'}]}
            },
            keyboardShortcuts: false,
            onSuccess: function(event, fields) {
                $.ajax( $instance.ajaxCall(fields) )
                .error(function(response) {
                    console.error('AJAX ERROR')
                    console.error(response)
                    console.error(JSON.parse(response.responseText).message)
                    var formErrors = []
                    var p = JSON.parse(response.responseText).errors
                    for (var key in p) {
                        if (p.hasOwnProperty(key)) {
                            formErrors.push(p[key].message)
                        }
                    }
                    if (formErrors.length > 0) {
                        $form.form('add errors', formErrors)
                    }
                    toaster('error', JSON.parse(response.responseText).message)
                    return false
                })
                .done(function(response) {
                    this.cancelEdit()
                })
                return false
            }
        })
        .form('reset')
        .form('set values', ecData)

        return false
    }

    this.init = function() {
        this.newContactButton()
        this.editContactButton()
        this.cancelEditButton()
        if (this.ecData != 'undefined' && this.ecData) {
            this.populateView()
            $ecview.show()
        } else {
            $ecadd.show()
        }
    }

    return this
}
