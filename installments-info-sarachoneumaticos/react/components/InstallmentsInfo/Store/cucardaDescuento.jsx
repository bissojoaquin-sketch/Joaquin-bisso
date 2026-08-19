import React from 'react';
import { useProduct } from 'vtex.product-context';
import { useCssHandles } from 'vtex.css-handles';
import './cucardaDescuento.global.css';

const CSS_HANDLES = [
    'cucardaDescuentoContainer',
    'cucardaDescuentoBadge',
    'cucardaDescuentoPorcentaje'
];

function CucardaDescuento() {
    const { handles } = useCssHandles(CSS_HANDLES);
    const product = useProduct();

    const listPrice = product?.product?.priceRange?.listPrice?.highPrice ||
        product?.selectedItem?.sellers?.[0]?.commertialOffer?.ListPrice || 0;

    const properties = product?.product?.properties || [];
    const promocionPrecioUnitario = properties.find(prop =>
        prop.name === 'Promocion Precio Unitario' || prop.name === 'PromocionPrecioUnitario'
    )?.values?.[0] || '';

    const promoPrice = parseFloat(promocionPrecioUnitario);

    if (!promoPrice || !listPrice || listPrice <= promoPrice) {
        return null;
    }

    const descuento = Math.round(((listPrice - promoPrice) / listPrice) * 100);

    if (descuento <= 0) {
        return null;
    }

    return (
        <div className={`${handles.cucardaDescuentoContainer} cucarda-descuento-container`}>
            <div className={`${handles.cucardaDescuentoBadge} cucarda-descuento-badge`}>
                <span className={`${handles.cucardaDescuentoPorcentaje} cucarda-descuento-porcentaje`}>{descuento}%</span>
            </div>
        </div>
    );
}

export default CucardaDescuento;
