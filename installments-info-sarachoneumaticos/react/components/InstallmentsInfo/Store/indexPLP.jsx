import React, { useState, useEffect } from 'react'
import { useProduct } from 'vtex.product-context';
import { Spinner } from 'vtex.styleguide';
import './index.global.css'
import axios from "axios";
import { PaymentBlock, getApplicableOptions } from '../../../utils/installmentsModel';
import formatARPrice from '../../../utils/formatMoney';

function InstallmentsInfoStorePLP() {
    const product = useProduct();
    const [isLoading, setIsLoading] = useState(null);
    const [data, setData] = useState([]);

    const tax = product?.product?.items[0]?.sellers[0]?.commertialOffer?.Tax || 0;
    const price = product?.product?.items[0]?.sellers[0]?.commertialOffer?.Price || 0;
    const listPrice = product?.selectedItem?.sellers[0]?.commertialOffer?.ListPrice || 0;
    const PriceWithoutDiscount = product?.product?.items[0]?.sellers[0]?.commertialOffer?.PriceWithoutDiscount || 0;
    const taxPercentage = product?.product?.items[0]?.sellers[0]?.commertialOffer?.taxPercentage || 0;
    const productClusters = product?.product?.productClusters || [];
    const categoryProduct = product?.product?.categoryId;

    const fullPrice = price + tax;
    const fullListPrice = (PriceWithoutDiscount * taxPercentage) + listPrice;

    useEffect(() => {
        getAllInstallmentsInfo();
    }, []);

    const getAllInstallmentsInfo = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/_v/get-all-installments-info`);
            if (response.status === 200) {
                setData(response.data || []);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const applicableOptions = getApplicableOptions(data, { productClusters, categoryProduct, fullPrice, fullListPrice })
    const cuotasOptions = applicableOptions.filter(o => o.block === PaymentBlock.CUOTAS && o.applyPLP)

    const entries = cuotasOptions
        .flatMap(option =>
            option.installments.map(amountCoutas => ({
                key: `${option.id}-${amountCoutas}`,
                amountCoutas,
                pricePerInstallment: Math.round(option.discountedPrice / amountCoutas),
                installmentLabel: option.installmentLabel,
            }))
        )
        .filter((entry, index, self) => self.findIndex(e =>
            e.amountCoutas === entry.amountCoutas &&
            e.installmentLabel === entry.installmentLabel
        ) === index)
        .sort((a, b) => a.amountCoutas - b.amountCoutas)

    return (
        <div className='installments-store-plp-container'>
            {isLoading ? (
                <Spinner size={16} color="currentColor" />
            ) : (
                <div className='payment-option-plp-container'>
                    {entries.length > 0 && (
                        <div className='plp-payment-option'>
                            {entries.map(entry => (
                                <div key={entry.key} className='plp-option-detail'>
                                    <div className='plp-installment-info'>
                                        <span className='plp-installments-badge'>
                                            <span>{entry.amountCoutas}</span>
                                            <span className='plp-sin-interes-badge'>
                                                {entry.installmentLabel}
                                            </span>
                                            <span>de</span>
                                            <span className='plp-installments-price'>
                                                {formatARPrice(entry.pricePerInstallment, false)}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default InstallmentsInfoStorePLP
