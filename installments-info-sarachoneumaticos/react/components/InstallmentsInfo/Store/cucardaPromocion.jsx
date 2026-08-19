import React from 'react'
import { useProduct } from 'vtex.product-context';
import { useCssHandles } from 'vtex.css-handles';
import './cucardaPromocion.global.css'

const CSS_HANDLES = [
    'cucardaPromocionContainer',
    'cucardaBadge',
];

function CucardaPromocion({ attributeName }) {
    const { handles } = useCssHandles(CSS_HANDLES);
    const product = useProduct();

    const properties = product?.product?.properties || [];

    const attr = properties.find(prop =>
        prop.name === attributeName
    );

    const value = attr?.values?.[0] || '';

    if (!value) {
        return null;
    }

    return (
        <div className={`${handles.cucardaPromocionContainer} cucarda-promocion-container`}>
            <span className={`${handles.cucardaBadge} cucarda-badge`}>{value}</span>
        </div>
    );
}

CucardaPromocion.schema = {
    title: 'Cucarda Promoción',
    description: 'Muestra el valor de un atributo del producto como cucarda',
    type: 'object',
    properties: {
        attributeName: {
            title: 'Nombre del atributo',
            description: 'Nombre exacto del atributo del producto a mostrar (ej: 4x3, Cucarda)',
            type: 'string',
            default: ''
        }
    }
};

export default CucardaPromocion;
