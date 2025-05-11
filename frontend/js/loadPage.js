(function() {
    let start = new Date().getTime();

    window.addEventListener('load', function(){
        var load = new Date().getTime() - start;

        var loadState = document.createElement('div');
        loadState.style.position = 'fixed';
        loadState.style.bottom = '0';
        loadState.style.right = '0';
        loadState.style.backgroundColor = 'gray';
        loadState.style.color = 'black';
        loadState.innerHTML = 'Страница загружена за ' + load + ' мс';

        document.body.appendChild(loadState);
    });
})();