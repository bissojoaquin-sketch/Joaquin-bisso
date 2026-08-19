import React from 'react'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
    'listPriceContainer',
    'listPriceLabel',
    'listPriceValue',
]

function ListPriceDisplay({
    message = 'Precio de lista:',
    symbol = '$',
    textColor = '#000000'
}) {
    const { handles } = useCssHandles(CSS_HANDLES)
    const productContextValue = useProduct()

    const listPriceValue = productContextValue?.selectedItem?.sellers?.[0]?.commertialOffer?.ListPrice || 0
    const sellingPriceValue = productContextValue?.selectedItem?.sellers?.[0]?.commertialOffer?.Price || 0
    const availableQuantity = productContextValue?.selectedItem?.sellers?.[0]?.commertialOffer?.AvailableQuantity || 0

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price)
    }

    return (
        <div className={handles.listPriceContainer} style={{ color: textColor }}>
            <span className={handles.listPriceLabel}>
                {message}{' '}
            </span>
            <span className={handles.listPriceValue}>
                {symbol} {formatPrice(listPriceValue)}
            </span>
        </div>
    )
}

ListPriceDisplay.schema = {
    title: 'Precio de Lista',
    type: 'object',
    properties: {
        message: {
            title: 'Mensaje',
            type: 'string',
            default: 'Precio de lista:',
        },
        symbol: {
            title: 'Símbolo',
            type: 'string',
            default: '$',
        },
        textColor: {
            title: 'Color del texto',
            type: 'string',
            default: '#000000',
        },
    },
}

export default ListPriceDisplay
