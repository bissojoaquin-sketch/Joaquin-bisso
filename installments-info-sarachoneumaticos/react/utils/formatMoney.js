function formatARPrice(amount, showDecimals = true) {
    const numValue = Number(amount);
    if (isNaN(numValue)) return '';
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: showDecimals ? 2 : 0,
        maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(numValue);
}

export default formatARPrice