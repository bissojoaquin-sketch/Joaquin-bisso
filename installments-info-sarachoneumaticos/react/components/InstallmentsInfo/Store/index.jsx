import React, { useState, useEffect } from 'react'
import { useProduct } from 'vtex.product-context';
import { Spinner } from 'vtex.styleguide';
import './index.global.css'
import axios from "axios";
import { TipoPago } from '../../../constans/constansEnum';
import formatARPrice from '../../../utils/formatMoney';
import { PaymentBlock, getApplicableOptions } from '../../../utils/installmentsModel';
import ModalFinanciacion from './ModalFinanciacion';
import './ModalFinanciacion.global.css';

const TIPO_TO_BLOCK = {
    [TipoPago.EFECTIVO]: PaymentBlock.EFECTIVO,
    [TipoPago.TARJETA]: PaymentBlock.CUOTAS,
    [TipoPago.CONTADO]: PaymentBlock.CONTADO,
    [TipoPago.PROMOS_BANCARIAS]: PaymentBlock.CUOTAS,
}

const DEFAULT_BLOCK_ORDER = [PaymentBlock.CONTADO, PaymentBlock.EFECTIVO, PaymentBlock.CUOTAS]

function InstallmentsInfoStore({ title, descriptionText }) {
    const product = useProduct();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [orderConfig, setOrderConfig] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false)

    const tax = product?.product?.items[0]?.sellers[0]?.commertialOffer.Tax || 0;
    const price = product?.product?.items[0]?.sellers[0]?.commertialOffer?.Price || 0;
    const listPrice = product?.selectedItem?.sellers[0]?.commertialOffer?.ListPrice || 0;
    const PriceWithoutDiscount = product?.product?.items[0]?.sellers[0]?.commertialOffer?.PriceWithoutDiscount || 0;
    const taxPercentage = product?.product?.items[0]?.sellers[0]?.commertialOffer?.taxPercentage || 0;
    const productClusters = product?.product?.productClusters || [];
    const categoryProduct = product?.product?.categoryId

    const fullPrice = price + tax;
    const fullListPrice = (PriceWithoutDiscount * taxPercentage) + listPrice;

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            await Promise.all([
                getOrderConfig(),
                getAllInstallmentsInfo()
            ]);
        } catch (error) {
            console.error("Error loading initial data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getOrderConfig = async () => {
        try {
            const res = await axios.get(`/_v/get-all-installments-info-config`)
            const config = res?.data?.[0] || {}
            setOrderConfig(config)
        } catch (err) {
            console.error("Error loading order config", err)
        }
    }

    const getAllInstallmentsInfo = async () => {
        try {
            const response = await axios.get(`/_v/get-all-installments-info`);
            if (response.status === 200) {
                setData(response.data || []);
            } else {
                console.log("Error al traer la información");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const applicableOptions = getApplicableOptions(data, { productClusters, categoryProduct, fullPrice, fullListPrice })

    const destacadas = applicableOptions.filter(o => o.isDestacado)
    const noDestacadas = applicableOptions.filter(o => !o.isDestacado && o.block)

    const optionsByBlock = (block) => destacadas.filter(o => o.block === block)

    const renderSinglePaymentBlock = (block, fallbackLabel) => {
        const options = optionsByBlock(block)
        if (options.length === 0) return null

        return (
            <div className='payment-option-container'>
                <div className='payment-option'>
                    {options.map(option => (
                        <div key={option.id} className='contado-option'>
                            <div className='contado-price-row'>
                                <span className='installment-info-price'>
                                    {formatARPrice(option.discountedPrice, false)}
                                </span>
                                {option.discountPercentage > 0 && (
                                    <span className='option-detail-span'>{option.discountPercentage}% OFF</span>
                                )}
                            </div>

                            <span className='instalments-info-price-title'>
                                {option.description || fallbackLabel}
                            </span>

                            {option.disclaimer && (
                                <div className='text-disclaimer'>
                                    <span>{option.disclaimer}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const renderEfectivoBlock = () =>
        renderSinglePaymentBlock(PaymentBlock.EFECTIVO, 'Pago en efectivo o transferencia.')

    const renderContadoBlock = () =>
        renderSinglePaymentBlock(PaymentBlock.CONTADO, 'En 1 pago.')

    const renderCuotasBlock = () => {
        const options = optionsByBlock(PaymentBlock.CUOTAS)
        if (options.length === 0) return null

        const groups = options
            .flatMap(option =>
                option.installments.map(amountCoutas => ({
                    amountCoutas,
                    pricePerInstallment: option.discountedPrice / amountCoutas,
                    bankImages: option.bankImages,
                    disclaimer: option.disclaimer,
                    installmentLabel: option.installmentLabel,
                }))
            )
            .reduce((acc, entry) => {
                const existing = acc.find(g =>
                    g.amountCoutas === entry.amountCoutas &&
                    g.pricePerInstallment === entry.pricePerInstallment &&
                    g.disclaimer === entry.disclaimer &&
                    g.installmentLabel === entry.installmentLabel
                )
                if (existing) {
                    entry.bankImages.forEach(img => {
                        if (!existing.bankImages.includes(img)) existing.bankImages.push(img)
                    })
                } else {
                    acc.push({ ...entry, bankImages: [...entry.bankImages] })
                }
                return acc
            }, [])
            .sort((a, b) => b.amountCoutas - a.amountCoutas)

        return (
            <div className='payment-option-container'>
                <div className='payment-option'>
                    <p className='title-installments'>{title || 'Promos bancarias'}</p>
                    {descriptionText && (
                        <p className='sub-title-installments'>{descriptionText}</p>
                    )}

                    {groups.map((group, index) => (
                        <div key={index} className='option-detail'>
                            <div className='installment-info'>
                                {group.bankImages.map((src, idx) => (
                                    <img key={idx} src={src} alt={`Banco ${idx + 1}`} className='bank-image-bancaria' />
                                ))}

                                <div className='text-detail-payment-installment'>
                                    <span className='installments-price'>{formatARPrice(group.pricePerInstallment)}</span>
                                    <span className='text-label-description'>en</span>
                                    <strong>{group.amountCoutas}</strong>
                                    <span className='text-label-description'>{group.installmentLabel}</span>
                                </div>
                            </div>

                            {/* <span className='text-precio-por-cuota'>Precio por cuota</span> */}

                            {group.disclaimer && (
                                <div className='text-disclaimer'>
                                    <span>{group.disclaimer}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const renderBlock = (block) => {
        switch (block) {
            case PaymentBlock.EFECTIVO:
                return renderEfectivoBlock()
            case PaymentBlock.CONTADO:
                return renderContadoBlock()
            case PaymentBlock.CUOTAS:
                return renderCuotasBlock()
            default:
                return null
        }
    }

    const configuredOrder = Object.values(orderConfig)
        .filter(Number.isInteger)
        .map(tipo => TIPO_TO_BLOCK[tipo])
        .filter(Boolean)

    const orderedBlocks = Array.from(new Set(
        configuredOrder.length ? configuredOrder : DEFAULT_BLOCK_ORDER
    ))
    .sort((a, b) => Number(a === PaymentBlock.CUOTAS) - Number(b === PaymentBlock.CUOTAS))

    return (
        <div className='installments-store-container'>
            {isLoading ? (
                <Spinner size={16} color="currentColor" />
            ) : (
                <>
                    {orderedBlocks.map((block, index) => (
                        <React.Fragment key={index}>{renderBlock(block)}</React.Fragment>
                    ))}

                    {noDestacadas.length > 0 && (
                        <button
                            className='btn-show-all-financing'
                            onClick={() => setIsModalOpen(true)}
                        >
                            Ver todas nuestras opciones de financiación
                        </button>
                    )}
                </>
            )}

            <ModalFinanciacion
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                options={noDestacadas}
                title={title}
            />
        </div>
    );
}

InstallmentsInfoStore.schema = {
    type: 'object',
    title: 'Opciones de pago',
    description: "Textos de bloque en opciones de pago",
    properties: {
        title: {
            title: 'Titulo del bloque',
            type: 'text',
            default: 'Promos bancarias'
        },
        descriptionText: {
            title: 'Subtitulo del bloque',
            type: 'text',
            default: ''
        },
    }
}

export default InstallmentsInfoStore
