import React from 'react'
import './ModalFinanciacion.global.css'
import formatARPrice from '../../../utils/formatMoney'
import { PaymentBlock } from '../../../utils/installmentsModel'

function ModalFinanciacion({ isOpen, onClose, options, title }) {
    if (!isOpen) return null

    const cuotasOptions = (options || []).filter(o => o.block === PaymentBlock.CUOTAS)
    const singleOptions = (options || []).filter(o => o.block === PaymentBlock.EFECTIVO || o.block === PaymentBlock.CONTADO)

    const cuotaEntries = cuotasOptions
        .flatMap(option =>
            option.installments.map(amountCoutas => ({
                key: `${option.id}-${amountCoutas}`,
                amountCoutas,
                pricePerInstallment: option.discountedPrice / amountCoutas,
                discountPercentage: option.discountPercentage,
                description: option.description,
                disclaimer: option.disclaimer,
                bankImages: option.bankImages,
                installmentLabel: option.installmentLabel,
            }))
        )
        .sort((a, b) => a.amountCoutas - b.amountCoutas)

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h2>Opciones de Financiación</h2>
                    <button className='modal-close' onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className='modal-body'>
                    {singleOptions.length > 0 && (
                        <div className='modal-options-list'>
                            {singleOptions.map(option => (
                                <div key={option.id} className='modal-option-card'>
                                    <div className='modal-option-header'>
                                        {option.discountPercentage > 0 && (
                                            <div className='modal-discount-badge'>
                                                {option.discountPercentage}% OFF
                                            </div>
                                        )}
                                    </div>
                                    <div className='modal-option-info'>
                                        <div className='modal-installment-detail'>
                                            <span className='modal-price'>{formatARPrice(option.discountedPrice, false)}</span>
                                            {option.description && (
                                                <span className='modal-text'>{option.description}</span>
                                            )}
                                        </div>
                                        {option.disclaimer && (
                                            <p className='modal-disclaimer'>{option.disclaimer}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {cuotaEntries.length > 0 && (
                        <div className='modal-section'>
                            <h3 className='modal-section-title'>{title || 'Promos bancarias'}</h3>
                        </div>
                    )}

                    <div className='modal-options-list'>
                        {cuotaEntries.map(entry => (
                            <div key={entry.key} className='modal-option-card'>
                                <div className='modal-option-header'>
                                    <div className='modal-option-banks'>
                                        {entry.bankImages.map((src, idx) => (
                                            <img key={idx} src={src} alt={`Banco ${idx + 1}`} className='bank-image-card' />
                                        ))}
                                    </div>
                                </div>

                                <div className='modal-option-info'>
                                    <div className='modal-installment-detail'>
                                        <span className='modal-price'>{formatARPrice(entry.pricePerInstallment)}</span>
                                        <span className='modal-text'>en <strong>{entry.amountCoutas}</strong> {entry.installmentLabel}</span>
                                    </div>

                                    <span className='text-precio-por-cuota'>Precio por cuota</span>

                                    {entry.disclaimer && (
                                        <p className='modal-disclaimer'>{entry.disclaimer}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalFinanciacion
