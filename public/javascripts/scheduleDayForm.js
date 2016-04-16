/* global $ */

function scheduleEventFormScripts(dataId, apiUrl) {
    $('#editEvent')
        .form({
            fields: {
                dateField: 'empty',
                startTime: 'empty',
                endTime: 'empty',
                location: 'empty'
            }
        }
    )
    $('.ui.delete.button').click(function(){
        // deleteEntry(dataId)
        $.ajax({
            url: apiUrl + dataId,
            type: 'DELETE',
            success: function(result) {
                window.location.replace(apiUrl)
            }
        })
    })
    $('#dateField').daterangepicker(
      {
        format: 'MM/DD/YYYY',
        startDate: new Date(),
        singleDatePicker: true,
        timePicker: false
      }
    )

    var timePickerDefaults = {
        forceRoundTime: false,
        minTime: '5:00am',
        maxTime: '12:00am',
        useSelect: true,
        className: 'dropdown'

    }
    var endTime = $('#endTime')
    endTime.timepicker(timePickerDefaults)
    $('#startTime').timepicker(
        timePickerDefaults, {
            setTime: '#{data.startTime}'
        }
    )
        // .on('changeTime', function(settings) {
        //     endTime.timepicker(timePickerDefaults, {
        //         minTime: target('ui-timepicker-value')
    //         })
    //     }
    // )
    endTime.timepicker(timePickerDefaults)
}