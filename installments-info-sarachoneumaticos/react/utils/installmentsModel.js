export const PaymentBlock = {
    EFECTIVO: 'EFECTIVO',
    CONTADO: 'CONTADO',
    CUOTAS: 'CUOTAS',
}

export const InstallmentType = {
    INTEREST_FREE: 'INTEREST_FREE',
    FIXED: 'FIXED',
    WITH_INTEREST: 'WITH_INTEREST',
}

const INSTALLMENT_LABELS = {
    [InstallmentType.INTEREST_FREE]: 'cuotas sin interés',
    [InstallmentType.FIXED]: 'cuotas fijas',
    [InstallmentType.WITH_INTEREST]: 'cuotas con interés',
}

const CARD_METHODS = ['VISA', 'MASTERCARD', 'AMEX', 'NARANJA', 'CABAL', 'DEBITO']
const CONTADO_METHODS = ['CONTADO', 'TRANSFERENCIA']

const daysMap = {
    domingo: 0,
    lunes: 1,
    martes: 2,
    miercoles: 3,
    jueves: 4,
    viernes: 5,
    sabado: 6,
}

export function parseJsonArray(val) {
    if (!val) return []
    if (Array.isArray(val)) return val
    try {
        const parsed = JSON.parse(val)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

export function parseJsonObject(val) {
    if (!val) return {}
    if (typeof val === 'object') return val
    try {
        const parsed = JSON.parse(val)
        return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
        return {}
    }
}

export function parseNumberList(val) {
    if (val == null || val === '') return []
    return String(val)
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !Number.isNaN(n))
}

export function parseStringList(val) {
    if (!val) return []
    return String(val)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
}

export function getInstallmentType(item = {}) {
    if (INSTALLMENT_LABELS[item.installmentType]) return item.installmentType

    // Compatibilidad con registros anteriores a la selección de tres estados.
    return item.containInteres === true
        ? InstallmentType.WITH_INTEREST
        : InstallmentType.INTEREST_FREE
}

export function getInstallmentLabel(type) {
    return INSTALLMENT_LABELS[type] || INSTALLMENT_LABELS[InstallmentType.INTEREST_FREE]
}

export function getPaymentBlock(item) {
    const methods = parseJsonArray(item.paymentMethods).map(m => String(m).toUpperCase())
    if (methods.length) {
        if (methods.some(m => CARD_METHODS.includes(m))) return PaymentBlock.CUOTAS
        if (methods.includes('EFECTIVO')) return PaymentBlock.EFECTIVO
        if (methods.some(m => CONTADO_METHODS.includes(m))) return PaymentBlock.CONTADO
        return null
    }

    switch (item.type) {
        case 1:
            return PaymentBlock.EFECTIVO
        case 3:
            return PaymentBlock.CONTADO
        case 2:
        case 4:
            return PaymentBlock.CUOTAS
        default:
            return null
    }
}

export function appliesToProduct(item, productClusters, categoryProduct) {
    if (item.applyAllProducts) return true

    const collectionIds = parseStringList(item.collectionIds)
    if (item.idCollecion != null && item.idCollecion !== '') {
        collectionIds.push(String(item.idCollecion))
    }
    if (collectionIds.length) {
        return productClusters.some(cluster => collectionIds.includes(String(cluster.id)))
    }

    if (item.idCategoria) {
        return parseInt(categoryProduct, 10) === item.idCategoria
    }

    return false
}

export function isActiveToday(item) {
    if (item.dateFrom && item.dateTo && item.recurrence) {
        const today = new Date()
        const dateFrom = new Date(item.dateFrom)
        const dateTo = new Date(item.dateTo)
        const isInRange = today >= dateFrom && today <= dateTo

        const recurrenceDays = item.recurrence.split(',').map(d => d.trim().toLowerCase())
        const todayName = Object.keys(daysMap).find(d => daysMap[d] === today.getDay())

        return isInRange && recurrenceDays.includes(todayName)
    }

    return true
}

export function getDiscountedPrice(item, fullPrice, fullListPrice) {
    const basePrice = item.applyListPrice && fullListPrice != null ? fullListPrice : fullPrice
    const discount = Number(item.discountPercentage) || 0
    return basePrice - (basePrice * discount / 100)
}

export function normalizeOption(item, fullPrice, fullListPrice) {
    let installments = parseNumberList(item.installments)
    if (!installments.length && item.amountCoutas) {
        installments = [Number(item.amountCoutas)]
    }

    let bankImages = Object.values(parseJsonObject(item.bankImages))
    if (!bankImages.length && item.imgBank) {
        bankImages = [`/arquivos/${item.imgBank}`]
    }

    const installmentType = getInstallmentType(item)

    return {
        id: item.id,
        description: item.description || item.textDescriptive || '',
        block: getPaymentBlock(item),
        isDestacado: item.isDestacado === true,
        applyPLP: item.applyPLP === true,
        discountPercentage: Number(item.discountPercentage) || 0,
        discountedPrice: getDiscountedPrice(item, fullPrice, fullListPrice),
        installments,
        installmentType,
        installmentLabel: getInstallmentLabel(installmentType),
        bankImages,
        disclaimer: item.disclaimer || '',
        isReintegro: item.isReintegro === true,
    }
}

export function getApplicableOptions(data, { productClusters, categoryProduct, fullPrice, fullListPrice }) {
    return (data || [])
        .filter(item => item.isActive !== false)
        .filter(item => appliesToProduct(item, productClusters, categoryProduct))
        .filter(isActiveToday)
        .map(item => normalizeOption(item, fullPrice, fullListPrice))
}
