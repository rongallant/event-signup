
$(function(){
    $('a.newItem').prop('href', '#{createAction}')
    $('[data-content], [data-title]').popup()
    $('[name=mainForm]').find('textarea[data-maxsize]').maxLengthCounter()

    var $topMenu = $('#mainMenuTop')

    // var $leftMenu = $('#mainMenuLeft')

    // $leftMenu.sidebar('setting', 'transition', 'overlay')

    // $('a.launch').click(function(){
    //     $leftMenu.sidebar('toggle')
    // })

    $topMenu.find('.ui.dropdown').dropdown()

    var $toolbar = $('#toolbar')
    $toolbar.find('.ui.dropdown').dropdown({action: 'hide'})
    $toolbar.visibility({
        type: 'fixed',
        continuous: true
    })
    $toolbar.find('.primary.submit').click(function(){
        $('[name=mainForm]').submit()
    })
    $toolbar.find('.secondary.reset').click(function(){
        $('[name=mainForm]').form('reset')
    })
})