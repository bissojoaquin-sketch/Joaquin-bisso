import React from 'react';
import { useProduct } from 'vtex.product-context';
import { useCssHandles } from 'vtex.css-handles';
import './bannerPDP.global.css'

const CSS_HANDLES = [
    'bannerContainer',
    'bannerTitle',
    'bannerValue',
    'bannerWrapper'
];

const BannerPDPAtributo = ({ specificationName = 'Texto Promo' }) => {
    const handles = useCssHandles(CSS_HANDLES);
    const productContext = useProduct();

    if (!productContext || !productContext.product) {
        return null;
    }

    const { product } = productContext;

    const specification = product.properties?.find(
        (prop) => prop.name === specificationName
    );

    if (!specification || !specification.values || specification.values.length === 0) {
        return null;
    }

    const specValue = specification.values[0];

    return (
        <div className={`${handles.bannerWrapper} bannerWrapper`}>
            <div className={`${handles.bannerContainer} bannerContainer`}>
                <p className={`${handles.bannerValue} bannerValue`}>{specValue}</p>
            </div>
        </div>
    );
};

BannerPDPAtributo.schema = {
    title: 'Banner PDP',
    description: 'Muestra una especificación del producto',
    type: 'object',
    properties: {
        specificationName: {
            title: 'Nombre de la especificación',
            description: 'El nombre de la especificación del producto a mostrar',
            type: 'string',
            default: 'Texto Promo'
        }
    }
};

export default BannerPDPAtributo;
