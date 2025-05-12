(function () {
    let start = new Date().getTime();

    window.addEventListener('load', function () {
        var load = new Date().getTime() - start;

        var serverElapsed = '??';
        var serverElement = document.getElementById('server-time');
        if (serverElement) {
            serverElapsed = serverElement.dataset.elapsed || '??';
        }

        var loadState = document.createElement('div');
        loadState.style.position = 'fixed';
        loadState.style.bottom = '0';
        loadState.style.right = '0';
        loadState.style.backgroundColor = '#f0f0f0';
        loadState.style.color = '#000';
        loadState.style.padding = '6px 12px';
        loadState.style.borderRadius = '6px';
        loadState.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
        loadState.style.fontSize = '12px';
        loadState.style.zIndex = '9999';

        loadState.innerHTML =
            'Сервер: ' + serverElapsed + ' | Клиент: ' + load + ' мс';

        document.body.appendChild(loadState);
    });
})();
