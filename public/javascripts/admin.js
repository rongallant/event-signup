
$(function(){
    $('a.newItem').prop('href', '#{createAction}')
    $('[data-content], [data-title]').popup()
    $('[name=mainForm]').find('textarea[data-maxsize]').maxLengthCounter()

    var $topMenu = $('#mainMenuTop')

    var $leftMenu = $('#mainMenuLeft')

    $leftMenu.sidebar('setting', 'transition', 'overlay')

    $('.launch.icon').click(function(){
        $leftMenu.sidebar('toggle')
    })

    $topMenu.find('.ui.dropdown').dropdown()
    $('#toolbar .ui.dropdown').dropdown({
        action: 'hide'
    })

    var $toolbar = $('#toolbar')

    $toolbar.visibility({
        type: 'fixed'
    })
    $toolbar.find('.primary.submit').click(function(){
        $('[name=mainForm]').submit()
    })
    $toolbar.find('.secondary.reset').click(function(){
        $('[name=mainForm]').form('reset')
    })
})