/* global $ toaster tinymce tinymceConfig, tinyMCE $ */

/**
* Initilize Selector JS.
*
* selectorId - String id that will be used to make this selector unique.
* maxListLength - Max length list can take.
* formRules - Form field rules for Semantic UI form validator.
* rowItem - function(index, fields) { return item } representing each row
*           outputed. "fields" vars based on what is passed into rowItem.
*           rowsGlobalVariableName - Global variable name representing the
*           JSON array of objects that from database.
*
* var tasksSelectorSettings =
* {
*     selectorId: 'tasks',
*     eventId: '#{data.id}',
*     maxListLength: 50,
*     listUri: '#{apiUri.secure.tasks.byEvent}',
*     crudUri: '#{apiUri.secure.task}',
*     formUrl: '/admin/meals/modal/',
*     results: [],
*     rowItem: function(rowObj) { return rowObj.name + ' - ' + rowObj.startTime },
*     formRules: {name:{rules:[{type:'empty'},{type:'maxLength[70]'}]},description:[{type:'maxLength[2000]'}],startTime:{rules:[{type:'empty'}]},duration:{rules:[{type:'empty'}]}}
* }
* var tasksSelector = updateSelectorRowsFromModel(tasksSelectorSettings)
*/

// Ajax Call to retreive lists and update list panel.
var updateSelectorRowsFromModel = function(conf) {
    var $dimmer = $('#' + conf.selectorId).find('.dimmer')
    $dimmer.addClass('active')
    $.ajax({ url: conf.listUri + conf.eventId }).done(function(response) {
        conf.results = response.data
        selectorPopulateRows(conf)
        $dimmer.removeClass('active')
    })
    return false
}

// Ajax create/update Call
var createItem = function(conf, fields) {
    console.log('Try to create/update')
    $.ajax({
        type: 'POST',
        url: conf.crudUri,
        data: fields,
        dataType: 'JSON'
    })
    .error(function(response) {
        if (response.message) {
            toaster('error', response.message)
        } else {
            toaster('error', response.statusText)
        }
    })
    .done(function(response) {
        updateSelectorRowsFromModel(conf)
        if (response.message) {
            toaster('success', response.message)
        } else {
            toaster('success', response.statusText)
        }

        $(conf.modalJQID).modal('hide')
    })
    return false
}

// Ajax Delete Call
var deleteItem = function(conf, itemId) {
    $.ajax({
        type: 'delete',
        url: conf.crudUri + itemId,
        dataType: 'JSON'
    })
    .error(function(data, textStatus, errorThrown) {
        switch (errorThrown.toLowerCase()) {
            case 'not found':
                toaster('warning', "Item not found")
                break;
            default:
                toaster('error', "Could not delete")
                break;
        }
    })
    .done(function(data, textStatus, jqXHR) {
        updateSelectorRowsFromModel(conf)
        $('.ui.modal').modal('hide')
        toaster('success', data.message)
    })
    return false
}

/**
 * Add/Create button.
 */
var initCreateNewItemButton = function(conf) {
    var $selector = $('#' + conf.selectorId)
    if (conf.results !== null && conf.results.length >= conf.maxListLength) {
        $selector.find('.addEntry').hide() // Honor max length
    } else {
        $selector.find('.addEntry').show().click(function(){
             $.ajax({
                url: conf.formUrl
            })
            .done(function(formHtml) {
                var $modal = $(conf.modalJQID)
                $modal.find('.formFields').html(formHtml)
                $modal.find('.formFields').find('input#_event').val(conf.eventId)
                $modal.find('.delete.button').hide()
                initMainModal(conf)
                initModalForm(conf)
                conf.formInitCallback(conf)
            })
        })
    }
    return false
}

// Edit Item
var initEditListItembuttons = function(conf) {
    var $listItems = $(conf.selectorJQID).find('.listOut .item .edit')
    $listItems.click(function(index, value) {
        $.ajax({
            url: conf.crudUri + conf.results[$listItems.index(this)]._id
        })
        .done(function(response) {
            $.ajax({
                url: conf.formUrl + response.data._id
            })
            .done(function(formHtml) {
                $(conf.modalJQID).find('.formFields').html(formHtml)
                initMainModal(conf)
                initDeleteModal(conf, response)
                initModalForm(conf)
                conf.formInitCallback(conf)
            })
        })
    })
    return false
}

var selectorPopulateRows = function(conf) {
    // Pre populate list
    var $selector = $('#' + conf.selectorId)
    var $list = $selector.find('.listOut')
    var rowWrapper = function(value){ return '<div class="item">' + value + '<div class="right floated content" title="Edit Item"><i class="edit icon link"></i></div></div>' }
    $list.empty() // Empty list
    $.each(conf.results, function(index, value) {
        if (value !== 'undefined' && value) {
            if (index !== 'undefined' && index) index = 0
            $list.append(rowWrapper(conf.rowItem(value)))
        }
    })
    $selector.find('.selectorCount').html((conf.results.length) + ' of ' + conf.maxListLength)
    initCreateNewItemButton(conf)
    initEditListItembuttons(conf)
    return false
}

var initModalForm = function(conf) {
    conf.currentModalForm = $(conf.modalJQID).find('.ui.form').form({
        fields: conf.formRules,
        inline : true,
        keyboardShortcuts: false,
        onSuccess: function(event, fields) {
            if (conf.results.length < conf.maxListLength) { // TODO validate this check still works.
                createItem(conf, fields)
            } else {
                console.error('\nFailed adding row')
                console.error(conf.selectorId + ' results = ' + conf.results.length + ' of ' + conf.maxListLength)
            }
            return false
        }
    })
    conf.currentModalForm.form('attach events', conf.modalJQID + ' .submit.button') // init submit
    return conf.currentModalForm
}

var initDeleteModal = function(conf, response) {
    return $(conf.deleteModalJQID)
        .modal('attach events', conf.modalJQID + ' .delete.button') // init delete modal
        .modal({
            onApprove: function() {
                deleteItem(conf, response.data.id)
                return false
            }
        }
    )
}

var initMainModal = function(conf) {
    $(conf.modalJQID).modal({
        onApprove: function() {
            // SUBMIT FORM
            conf.currentModalForm.form('submit')
            return false
        }
    }).modal('show')
    return false
}

var initSelector = function(conf) {
    conf.selectorJQID = '#' + conf.selectorId
    conf.modalJQID = '#' + conf.selectorId + 'Modal'
    conf.deleteModalJQID = '#' + conf.selectorId + 'DeleteModal'
    updateSelectorRowsFromModel(conf)
    return false
}
