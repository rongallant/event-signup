/* jQuery MaxLength for INPUT and TEXTAREA fields v1.0
 * Last updated: Feb 7th, 2015. This notice must stay intact for usage
 * Author: Ron Gallant (rongallant.com)
 * USAGE: $("input[data-maxsize], textarea[data-maxsize]").maxLength()
 */

$.fn.maxLengthCounter = function(options) {

    var $fields = $(this)

    // This is the easiest way to have default options.
    var settings = $.extend({
        // These are the defaults.
        thresholdcolors: [['20%','darkred'], ['10%','red']], // [chars_left_in_pct, CSS color to apply to output]
        uncheckedkeycodes: /(8)|(13)|(16)|(17)|(18)/, // keycodes that are not checked, even when limit has been reached.
        optsize: '',
        optoutputdiv: ''
    }, options)

    //sort thresholdcolors by percentage, ascending
    settings.thresholdcolors.sort(function(a,b){return parseInt(a[0])-parseInt(b[0])})

    function setformfieldsize($fields, optsize, optoutputdiv) {
    	$fields.each(function(i){
    		var $field=$(this)
    		$field.data('maxsize', optsize || parseInt($field.attr('data-maxsize'))) //max character limit
    		var statusdivid=optoutputdiv || $field.attr('data-output') //id of DIV to output status
    		$field.data('$statusdiv', $('#'+statusdivid).length==1? $('#'+statusdivid) : null)
    		$field.unbind('keypress.restrict').bind('keypress.restrict', function(e){
    			setformfieldsize.restrict($field, e)
    		})
    		$field.unbind('keyup.show').bind('keyup.show', function(e){
    			setformfieldsize.showlimit($field)
    		})
    		setformfieldsize.showlimit($field) //show status to start
    	})
    }

    setformfieldsize.restrict=function($field, e){
    	var keyunicode=e.charCode || e.keyCode
    	if (!settings.uncheckedkeycodes.test(keyunicode)){
    		if ($field.val().length >= $field.data('maxsize')){ //if characters entered exceed allowed
    			if (e.preventDefault)
    				e.preventDefault()
    			return false
    		}
    	}
    }

    setformfieldsize.showlimit=function($field){
    	if ($field.val().length > $field.data('maxsize')){
    		var trimmedtext=$field.val().substring(0, $field.data('maxsize'))
    		$field.val(trimmedtext)
    	}
    	if ($field.data('$statusdiv')){
    		$field.data('$statusdiv').css('color', '').html($field.val().length)
    		var pctremaining=($field.data('maxsize')-$field.val().length)/$field.data('maxsize')*100 //calculate chars remaining in terms of percentage
    		for (var i=0; i<settings.thresholdcolors.length; i++){
    			if (pctremaining<=parseInt(settings.thresholdcolors[i][0])){
    				$field.data('$statusdiv').css('color', settings.thresholdcolors[i][1])
    				break
    			}
    		}
    	}
    }

    setformfieldsize($fields, settings.optsize, settings.optoutputdiv)

    return this
}