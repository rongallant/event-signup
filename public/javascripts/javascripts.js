function toaster(type, text) {
    return noty({
        layout: 'bottomLeft',
        type: type,
        theme: 'relax',
        text: text,
        dismissQueue: true,
        animation: {
            open: {height: 'toggle'},
            close: {height: 'toggle'},
            easing: 'swing',
            speed: 500
            },
        timeout: 3000
    })
}