import React, { useState, useEffect, useRef } from 'react';
import { DatePicker } from 'vtex.styleguide';
import MultiSelect from './MultiSelect';
import { MediosDePago, BancosEmisores } from '../../../constans/constansEnum';
import { InstallmentType, getInstallmentType } from '../../../utils/installmentsModel';

const DIAS = [
    { key: 'lunes', label: 'Lun' },
    { key: 'martes', label: 'Mar' },
    { key: 'miercoles', label: 'Mié' },
    { key: 'jueves', label: 'Jue' },
    { key: 'viernes', label: 'Vie' },
    { key: 'sabado', label: 'Sáb' },
    { key: 'domingo', label: 'Dom' },
];

const EMPTY_FORM = {
    description: '',
    isActive: true,
    isDestacado: false,
    applyPLP: false,
    dateFrom: null,
    dateTo: null,
    recurrence: '',
    paymentMethods: [],
    banks: [],
    bankImages: {},
    commercialCondition: '',
    applyByCommercialCondition: false,
    applyAllProducts: false,
    collectionIds: '',
    isReintegro: false,
    discountPercentage: '',
    installments: '',
    installmentType: InstallmentType.INTEREST_FREE,
    disclaimer: '',
};

function parseArray(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return String(val).split(',').filter(Boolean); }
}

function parseObject(val) {
    if (!val) return {};
    if (typeof val === 'object') return val;
    try { return JSON.parse(val); } catch { return {}; }
}

function BankImageUpload({ bankKey, bankLabel, currentUrl, onUploaded }) {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentUrl || null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setPreview(currentUrl || null);
    }, [currentUrl]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Solo se permiten imágenes (PNG, JPG, SVG, WebP).');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setError('La imagen no puede superar 2 MB.');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result;
                    const base64Data = result.split(',')[1];
                    resolve(base64Data);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const response = await fetch('/_v/upload-bank-image', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bankKey,
                    base64,
                    contentType: file.type,
                    filename: file.name,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al subir la imagen');
            }

            const { url } = await response.json();
            const urlWithCacheBust = `${url}?t=${Date.now()}`;
            setPreview(urlWithCacheBust);
            onUploaded(bankKey, url);
        } catch (err) {
            console.error(err);
            setError('Error al subir la imagen. Intentá de nuevo.');
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className="bank-image-upload">
            <div className="bank-image-upload-label">
                <span className="bank-image-upload-name">{bankLabel}</span>
            </div>
            <div className="bank-image-upload-content">
                {preview ? (
                    <div className="bank-image-preview-wrapper">
                        <img
                            src={preview}
                            alt={bankLabel}
                            className="bank-image-preview"
                            onError={() => setPreview(null)}
                        />
                        <button
                            type="button"
                            className="btn-outline btn-outline-sm"
                            onClick={() => inputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? 'Subiendo...' : 'Cambiar'}
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="btn-upload"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? 'Subiendo...' : '+ Subir imagen'}
                    </button>
                )}
                {error && <span className="bank-image-error">{error}</span>}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
}

function FinancingOptionForm({ item, onClose, onSave }) {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setFormData({
                description: item.description || '',
                isActive: item.isActive !== false,
                isDestacado: item.isDestacado || false,
                applyPLP: item.applyPLP || false,
                dateFrom: item.dateFrom ? new Date(item.dateFrom) : null,
                dateTo: item.dateTo ? new Date(item.dateTo) : null,
                recurrence: item.recurrence || '',
                paymentMethods: parseArray(item.paymentMethods),
                banks: parseArray(item.banks),
                bankImages: parseObject(item.bankImages),
                commercialCondition: item.commercialCondition != null ? String(item.commercialCondition) : '',
                applyByCommercialCondition: item.applyByCommercialCondition || false,
                applyAllProducts: item.applyAllProducts || false,
                collectionIds: item.collectionIds || (item.idCollecion != null ? String(item.idCollecion) : ''),
                isReintegro: item.isReintegro || false,
                discountPercentage: item.discountPercentage != null ? String(item.discountPercentage) : '',
                installments: item.installments || (item.amountCoutas != null ? String(item.amountCoutas) : ''),
                installmentType: getInstallmentType(item),
                disclaimer: item.disclaimer || '',
            });
        } else {
            setFormData(EMPTY_FORM);
        }
    }, [item]);

    const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const toggleDay = (day) => {
        const days = formData.recurrence ? formData.recurrence.split(',').filter(Boolean) : [];
        const updated = days.includes(day) ? days.filter(d => d !== day) : [...days, day];
        set('recurrence', updated.join(','));
    };

    const isDaySelected = (day) =>
        formData.recurrence ? formData.recurrence.split(',').includes(day) : false;

    const handleBankImageUploaded = (bankKey, url) => {
        setFormData(prev => ({
            ...prev,
            bankImages: { ...prev.bankImages, [bankKey]: url },
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const body = {
                ...formData,
                paymentMethods: JSON.stringify(formData.paymentMethods),
                banks: JSON.stringify(formData.banks),
                bankImages: JSON.stringify(formData.bankImages),
                discountPercentage: formData.discountPercentage !== '' ? Number(formData.discountPercentage) : null,
                containInteres: formData.installmentType === InstallmentType.WITH_INTEREST,
            };
            await onSave(body);
        } finally {
            setLoading(false);
        }
    };

    const getBankLabel = (bankKey) => {
        const bank = BancosEmisores.find(b => b.value === bankKey);
        return bank ? bank.label : bankKey;
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-panel" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-panel-header">
                    <h2 className="modal-panel-title">
                        {item ? 'Editar Opción de Financiación' : 'Nueva Opción de Financiación'}
                    </h2>
                    <button type="button" className="modal-panel-close" onClick={onClose}>×</button>
                </div>

                {/* Scrollable body */}
                <div className="modal-panel-body">

                    {/* Descripción */}
                    <div className="form-field">
                        <label className="form-label">Descripción de la opción</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ej: Promoción 12 cuotas sin interés"
                            value={formData.description}
                            onChange={e => set('description', e.target.value)}
                        />
                    </div>

                    {/* Activar */}
                    <div className="form-toggle-row">
                        <span className="form-label">Activar opción de financiación</span>
                        <button
                            type="button"
                            className={`custom-toggle ${formData.isActive ? 'custom-toggle--on' : ''}`}
                            onClick={() => set('isActive', !formData.isActive)}
                            aria-label="Activar"
                        />
                    </div>

                    {/* Destacado */}
                    <div className="form-toggle-row">
                        <div>
                            <span className="form-label">Opción destacada</span>
                            <p className="form-hint" style={{ margin: '2px 0 0' }}>
                                {formData.isDestacado
                                    ? '✓ Se muestra directamente en la página de producto'
                                    : 'Se muestra solo en el modal "Ver todas las opciones"'}
                            </p>
                        </div>
                        <button
                            type="button"
                            className={`custom-toggle ${formData.isDestacado ? 'custom-toggle--on' : ''}`}
                            onClick={() => set('isDestacado', !formData.isDestacado)}
                            aria-label="Destacado"
                        />
                    </div>

                    {/* Aplica en PLP */}
                    <div className="form-toggle-row">
                        <div>
                            <span className="form-label">Aplica en PLP</span>
                            <p className="form-hint" style={{ margin: '2px 0 0' }}>
                                {formData.applyPLP
                                    ? '✓ Se muestra también en la página de listado de productos'
                                    : 'No se muestra en la página de listado de productos'}
                            </p>
                        </div>
                        <button
                            type="button"
                            className={`custom-toggle ${formData.applyPLP ? 'custom-toggle--on' : ''}`}
                            onClick={() => set('applyPLP', !formData.applyPLP)}
                            aria-label="Aplica en PLP"
                        />
                    </div>

                    {/* Fechas */}
                    <div className="form-row">
                        <div className="form-col">
                            <DatePicker
                                label="Fecha desde"
                                value={formData.dateFrom}
                                onChange={v => set('dateFrom', v)}
                                locale="es-AR"
                            />
                        </div>
                        <div className="form-col">
                            <DatePicker
                                label="Fecha hasta"
                                value={formData.dateTo}
                                onChange={v => set('dateTo', v)}
                                locale="es-AR"
                            />
                        </div>
                    </div>

                    {/* Recurrencia */}
                    <div className="form-field">
                        <label className="form-label">Recurrencia</label>
                        <div className="recurrence-chips">
                            {DIAS.map(({ key, label }) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`day-chip ${isDaySelected(key) ? 'day-chip--active' : ''}`}
                                    onClick={() => toggleDay(key)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Medios de pago */}
                    <MultiSelect
                        label="Medios de pago"
                        options={MediosDePago}
                        value={formData.paymentMethods}
                        onChange={v => set('paymentMethods', v)}
                        placeholder="Seleccionar medios de pago"
                    />

                    {/* Banco emisor */}
                    <MultiSelect
                        label="Banco emisor"
                        options={BancosEmisores}
                        value={formData.banks}
                        onChange={v => set('banks', v)}
                        placeholder="Seleccionar bancos"
                    />

                    {/* Bank image upload */}
                    {formData.banks.length > 0 && (
                        <div className="form-field">
                            <label className="form-label">Imágenes de bancos</label>
                            <p className="form-hint">
                                Subí el logo de cada banco seleccionado. Se mostrará en el storefront.
                            </p>
                            <div className="bank-images-list">
                                {formData.banks.map(bankKey => (
                                    <BankImageUpload
                                        key={bankKey}
                                        bankKey={bankKey}
                                        bankLabel={getBankLabel(bankKey)}
                                        currentUrl={formData.bankImages[bankKey] || null}
                                        onUploaded={handleBankImageUploaded}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Condición comercial */}
                    <div className="form-field">
                        <label className="form-label">Condición comercial</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ej: 1,2,3 (números separados por coma)"
                            value={formData.commercialCondition}
                            onChange={e => set('commercialCondition', e.target.value)}
                        />
                    </div>

                    {/* Aplicar a todos los productos */}
                    <div className="form-toggle-row">
                        <span className="form-label">Aplicar a todos los productos</span>
                        <button
                            type="button"
                            className={`custom-toggle ${formData.applyAllProducts ? 'custom-toggle--on' : ''}`}
                            onClick={() => set('applyAllProducts', !formData.applyAllProducts)}
                            aria-label="Aplicar a todos"
                        />
                    </div>

                    {/* Aplicar a colección */}
                    {!formData.applyAllProducts && (
                        <div className="form-field">
                            <label className="form-label">Aplicar a colección</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="IDs de colección separados por coma"
                                value={formData.collectionIds}
                                onChange={e => set('collectionIds', e.target.value)}
                            />
                        </div>
                    )}

                    {/* Filtrar por condición comercial */}
                    {!formData.applyAllProducts && !formData.collectionIds && (
                        <div className="form-toggle-row">
                            <span className="form-label">Filtrar por condición comercial</span>
                            <button
                                type="button"
                                className={`custom-toggle ${formData.applyByCommercialCondition ? 'custom-toggle--on' : ''}`}
                                onClick={() => set('applyByCommercialCondition', !formData.applyByCommercialCondition)}
                                aria-label="Filtrar por condición comercial"
                            />
                        </div>
                    )}

                    {/* Reintegro */}
                    <div className="form-toggle-row">
                        <span className="form-label">Reintegro</span>
                        <button
                            type="button"
                            className={`custom-toggle ${formData.isReintegro ? 'custom-toggle--on' : ''}`}
                            onClick={() => set('isReintegro', !formData.isReintegro)}
                            aria-label="Reintegro"
                        />
                    </div>

                    {/* % de descuento */}
                    <div className="form-field">
                        <label className="form-label">% de descuento</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Ej: 10"
                            value={formData.discountPercentage}
                            onChange={e => set('discountPercentage', e.target.value)}
                            min="0"
                            max="100"
                            step="0.01"
                        />
                    </div>

                    {/* Cantidad de cuotas */}
                    <div className="form-field">
                        <label className="form-label">Cantidad de cuotas</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ej: 3,6,12,18 (números separados por coma)"
                            value={formData.installments}
                            onChange={e => set('installments', e.target.value)}
                        />
                    </div>

                    {/* Tipo de cuotas */}
                    <fieldset className="form-field installment-type-field">
                        <legend className="form-label">Leyenda de las cuotas</legend>
                        <p className="form-hint">
                            Elegí el texto que se mostrará en la tienda para esta opción.
                        </p>
                        <div className="installment-type-options">
                            <button
                                type="button"
                                className={`installment-type-option ${formData.installmentType === InstallmentType.INTEREST_FREE ? 'installment-type-option--active' : ''}`}
                                onClick={() => set('installmentType', InstallmentType.INTEREST_FREE)}
                                aria-pressed={formData.installmentType === InstallmentType.INTEREST_FREE}
                            >
                                Cuotas sin interés
                            </button>
                            <button
                                type="button"
                                className={`installment-type-option ${formData.installmentType === InstallmentType.FIXED ? 'installment-type-option--active' : ''}`}
                                onClick={() => set('installmentType', InstallmentType.FIXED)}
                                aria-pressed={formData.installmentType === InstallmentType.FIXED}
                            >
                                Cuotas fijas
                            </button>
                            <button
                                type="button"
                                className={`installment-type-option ${formData.installmentType === InstallmentType.WITH_INTEREST ? 'installment-type-option--active' : ''}`}
                                onClick={() => set('installmentType', InstallmentType.WITH_INTEREST)}
                                aria-pressed={formData.installmentType === InstallmentType.WITH_INTEREST}
                            >
                                Cuotas con interés
                            </button>
                        </div>
                    </fieldset>

                    {/* Disclaimer */}
                    <div className="form-field">
                        <label className="form-label">Disclaimer</label>
                        <p className="form-hint">Texto legal o aclaratorio que aparece debajo de las opciones de financiación en la página de producto.</p>
                        <textarea
                            className="form-input"
                            rows={3}
                            placeholder="Ej: Válido para compras realizadas con tarjeta Visa del Banco Galicia. Sujeto a aprobación crediticia."
                            value={formData.disclaimer}
                            onChange={e => set('disclaimer', e.target.value)}
                            style={{ resize: 'vertical', fontFamily: 'inherit' }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-panel-footer">
                    <button
                        type="button"
                        className="btn-primary btn-primary--full"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar Opción'}
                    </button>
                    <button type="button" className="btn-ghost" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FinancingOptionForm;
