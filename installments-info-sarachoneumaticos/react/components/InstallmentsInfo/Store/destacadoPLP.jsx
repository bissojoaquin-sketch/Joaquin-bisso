import React from 'react'
import { useProduct } from 'vtex.product-context';
import './destacadoPLP.global.css'
import formatARPrice from '../../../utils/formatMoney';

function DestacadoPLP() {
    const product = useProduct();

    const properties = product?.product?.properties || [];
    const textoPromo = properties.find(prop =>
        prop.name === 'Texto Promo' || prop.name === 'TextoPromo'
    )?.values?.[0] || '';

    const promocionPrecioUnitario = properties.find(prop =>
        prop.name === 'Promocion Precio Unitario' || prop.name === 'PromocionPrecioUnitario'
    )?.values?.[0] || '';

    const plpPromo = properties.find(prop =>
        prop.name === 'PLP promo' || prop.name === 'PLPpromo'
    )?.values?.[0] || '';

    if (!textoPromo && !promocionPrecioUnitario && !plpPromo) {
        return null;
    }

    const formatPrice = (price) => {
        if (!price) return '';
        const numPrice = parseFloat(price);
        if (isNaN(numPrice)) return price;
        return formatARPrice(numPrice);
    };

    return (
        <div className='destacado-plp-container'>
            {/* {textoPromo && (
                <div className='destacado-promo-badge'>
                    <span className='destacado-promo-text'>{textoPromo}</span>
                </div>
            )} */}

            <div className='destacado-promo-prices'>
                {promocionPrecioUnitario && (
                    <div className='destacado-precio-unitario'>
                        <span className='destacado-label'>Precio Unitario:</span>
                        <span className='destacado-price'>{formatPrice(promocionPrecioUnitario)}</span>
                    </div>
                )}

                {plpPromo && (
                    <div className='destacado-plp-promo'>
                        {textoPromo ?
                            <span className='destacado-label'>{textoPromo}:</span> :
                            <span className='destacado-label'>Precio Promoción:</span>
                        }
                        <span className='destacado-price-promo'>{formatPrice(plpPromo)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DestacadoPLP;
