$.noty.themes.eventManagerNotyTheme = Object.create($.noty.themes.defaultTheme);
$.noty.themes.eventManagerNotyTheme.name = 'eventManager';
$.noty.themes.eventManagerNotyTheme.style = function () {
    $.noty.themes.defaultTheme.style.apply(this);
};
$.noty.defaults = {
    layout: 'topRight',
    theme: 'eventManager', // or 'relax'
    dismissQueue: true,
    maxVisible: 5,
    animation: {
        open: {height: 'toggle'},
        close: {height: 'toggle'},
        easing: 'swing',
        speed: 500
    },
    timeout: 3000
}