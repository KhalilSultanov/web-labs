const evtSource = new EventSource('/products/events');

evtSource.addEventListener('new-product', (event) => {
    const product = JSON.parse(event.data);
    showToast(`🆕 Новый товар: ${product.name} (${product.price}₽)`, 'success');
});

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    const container = document.getElementById('toast-container');
    if (!container) return;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}
