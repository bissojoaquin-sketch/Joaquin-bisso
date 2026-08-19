import React, { useState } from "react";
import {
    Layout,
    PageBlock,
    ToastProvider,
    ToastConsumer,
    Spinner,
    Button,
    Input,
    Dropdown,
    Textarea,
    DatePicker,
    CheckboxGroup,
    Toggle,
    PageHeader
} from "vtex.styleguide";
import {
    FaInfo,
    FaArrowLeft,
    FaCalendarAlt,
    FaCreditCard,
    FaPercentage,
    FaBoxOpen,
    FaEye,
    FaChevronDown,
    FaMoneyBillWave,
    FaCog,
    FaSave
} from 'react-icons/fa';
import { nombreTipoPagoHtml, TipoPago, TipoTarjeta } from "../../../constans/constansEnum";
import { InstallmentType } from '../../../utils/installmentsModel';
import './index.global.css'

const CollapsibleSection = ({ title, description, icon, children, defaultOpen = true, highlight = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`collapsible-section ${highlight ? 'section-highlight' : ''}`}>
            <div className="collapsible-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="collapsible-header-content">
                    <div className="collapsible-icon">
                        {icon}
                    </div>
                    <div className="collapsible-title">
                        <h3>{title}</h3>
                        {description && <p>{description}</p>}
                    </div>
                </div>
                <div className={`collapsible-toggle ${isOpen ? 'is-open' : ''}`}>
                    <FaChevronDown />
                </div>
            </div>
            <div className={`collapsible-content ${isOpen ? 'is-open' : 'is-closed'}`}>
                <div className="collapsible-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

function InstallmentsInfoAdminCreate() {
    const [formData, setFormData] = useState({
        amountCoutas: null,
        bank: null,
        cardType: null,
        cft: null,
        discountPercentage: null,
        idCollecion: null,
        imgBank: null,
        tea: null,
        type: null,
        textDescriptive: null,
        dateFrom: null,
        dateTo: null,
        recurrence: "",
        disclaimer: null,
        showPrecio: null,
        showDescount: null,
        applyAllProducts: null,
        applyListPrice: null,
        idCategoria: null,
        applyCheckout: null,
        applyPLP: null,
        isCardBank: null,
        installmentType: InstallmentType.INTEREST_FREE,
        interesCoutasFijas: null,
        commercialCondition: null,
        isDestacado: null
    });
    const [loading, setLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [checkedMap, setCheckedMap] = useState({
        domingo: { label: "Domingo", checked: false },
        lunes: { label: "Lunes", checked: false },
        martes: { label: "Martes", checked: false },
        miercoles: { label: "Miércoles", checked: false },
        jueves: { label: "Jueves", checked: false },
        viernes: { label: "Viernes", checked: false },
        sabado: { label: "Sabado", checked: false },
    });

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleDropdownChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: parseInt(value),
        });
    };

    const handleRecurrenceChange = (newCheckedMap) => {
        setCheckedMap(newCheckedMap);

        const selectedDays = Object.keys(newCheckedMap)
            .filter((key) => newCheckedMap[key].checked)
            .join(",");

        setFormData({
            ...formData,
            recurrence: selectedDays,
        });
    };

    const handleSubmit = async (showToast) => {
        setLoading(true);

        try {
            const response = await fetch("/_v/get-all-installments-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    containInteres: formData.installmentType === InstallmentType.WITH_INTEREST,
                }),
            });

            if (response.ok) {
                setFormData({
                    amountCoutas: "",
                    bank: "",
                    cardType: "",
                    cft: "",
                    discountPercentage: "",
                    idCollecion: "",
                    imgBank: "",
                    tea: "",
                    type: "",
                    textDescriptive: "",
                    dateFrom: "",
                    dateTo: "",
                    recurrence: "",
                    disclaimer: '',
                    showPrecio: false,
                    showDescount: false,
                    applyAllProducts: false,
                    idCategoria: "",
                    applyListPrice: false,
                    applyCheckout: false,
                    applyPLP: false,
                    isCardBank: false,
                    installmentType: InstallmentType.INTEREST_FREE,
                    interesCoutasFijas: false,
                    commercialCondition: "",
                    isDestacado: false
                });
                showToast({
                    message: 'El documento se creó correctamente y será indexado por Master Data.',
                    duration: 3000,
                });

                setTimeout(() => {
                    window.location.href = '/admin/app/custom-installments-info/';
                }, 2000);
            } else {
                showToast({
                    message: 'Error al crear el documento.',
                    duration: 3000,
                    variation: 'error',
                });
            }
        } catch (error) {
            console.error("Error:", error);
            showToast({
                message: 'Error al crear el documento.',
                duration: 3000,
                variation: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const DiasRecurrenciaOptions = [
        { value: "lunes", label: "Lunes" },
        { value: "martes", label: "Martes" },
        { value: "miercoles", label: "Miércoles" },
        { value: "jueves", label: "Jueves" },
        { value: "viernes", label: "Viernes" },
    ];

    const nombreDiasRecurrencia = (value) => {
        const option = DiasRecurrenciaOptions.find((opt) => opt.value === value);
        return option ? option.label : value;
    };

    return (
        <ToastProvider positioning="window">
            <Layout>
                <div className="mt6">
                    <PageBlock
                        variation="full">

                        <PageHeader
                            style={{ padding: 0 }}
                            title="Crear Opciones de Financiación"
                            linkLabel="Volver"
                            onLinkClick={() => window.location.href = '/admin/app/custom-installments-info/'}
                        />
                        <ToastConsumer>
                            {({ showToast }) =>
                                loading ? (
                                    <Spinner color="currentColor" size={20} />
                                ) : (
                                    <>
                                        <form onSubmit={(e) => e.preventDefault()}>

                                            <div className="mb5">
                                                <Dropdown
                                                    label="Tipo de Pago"
                                                    options={[
                                                        { value: "", label: "Seleccionar" },
                                                        ...Object.entries(TipoPago).map(([key, value]) => ({
                                                            value,
                                                            label: key,
                                                        })),
                                                    ]}
                                                    value={formData.type || ""}
                                                    onChange={(e) => handleDropdownChange("type", e.target.value)}
                                                />
                                            </div>

                                            {!formData.type ? null :
                                                formData.type === TipoPago.EFECTIVO || formData.type === TipoPago.CONTADO ?
                                                    (
                                                        <>
                                                            {/* Vigencia */}
                                                            <CollapsibleSection
                                                                title="Vigencia"
                                                                description="Configure el período de validez y días de aplicación"
                                                                icon={<FaCalendarAlt />}
                                                            >
                                                                <div className="row-container" style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                    <div className="col-middle">
                                                                        <DatePicker
                                                                            label="Fecha Desde"
                                                                            value={formData.dateFrom}
                                                                            onChange={(value) =>
                                                                                setFormData({ ...formData, dateFrom: value })
                                                                            }
                                                                            locale="es-AR"
                                                                        />
                                                                    </div>

                                                                    <div className="col-middle">
                                                                        <DatePicker
                                                                            label="Fecha Hasta"
                                                                            value={formData.dateTo}
                                                                            onChange={(value) =>
                                                                                setFormData({ ...formData, dateTo: value })
                                                                            }
                                                                            locale="es-AR"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <CheckboxGroup
                                                                    name="recurrence"
                                                                    label="Días de recurrencia"
                                                                    id="recurrence"
                                                                    value="recurrence"
                                                                    checkedMap={checkedMap}
                                                                    onGroupChange={handleRecurrenceChange}
                                                                />
                                                                <div className="info-box info-box-info" style={{ marginTop: 'var(--spacing-sm)' }}>
                                                                    <strong>Días seleccionados:</strong> {formData.recurrence.split(",").join(", ") || "Ninguno"}
                                                                </div>
                                                            </CollapsibleSection>

                                                            {/* Descuento */}
                                                            <CollapsibleSection
                                                                title="Descuento"
                                                                description="Configure el descuento aplicable"
                                                                icon={<FaPercentage />}
                                                            >
                                                                <Input
                                                                    label="Descuento (%)"
                                                                    name="discountPercentage"
                                                                    value={formData.discountPercentage}
                                                                    onChange={handleChange}
                                                                    type="number"
                                                                    placeholder="Ej: 15"
                                                                />
                                                            </CollapsibleSection>

                                                            {/* Productos donde aplica */}
                                                            <CollapsibleSection
                                                                title="Productos donde Aplica"
                                                                description="Defina a qué productos se aplicará esta financiación"
                                                                icon={<FaBoxOpen />}
                                                            >
                                                                <div className="info-box info-box-warning" style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                    <strong>⚠️ Importante:</strong>
                                                                    <ul>
                                                                        <li>Si "Aplica a todos los productos" está activado, no se considerará el ID de colección o categoría</li>
                                                                        <li>Si se coloca ID de Colección, no puede tener ID de Categoría y viceversa</li>
                                                                    </ul>
                                                                </div>

                                                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                    <Toggle
                                                                        label={
                                                                            formData.applyAllProducts
                                                                                ? "Aplica a todos los productos"
                                                                                : "No aplica a todos los productos"
                                                                        }
                                                                        checked={formData.applyAllProducts}
                                                                        name="applyAllProducts"
                                                                        onChange={handleChange}
                                                                    />
                                                                </div>

                                                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                    <Input
                                                                        label="ID de Colección"
                                                                        name="idCollecion"
                                                                        value={formData.idCollecion}
                                                                        onChange={handleChange}
                                                                        type="number"
                                                                        placeholder="Ej: 142"
                                                                    />
                                                                </div>

                                                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                    <Input
                                                                        label="Condición Comercial"
                                                                        name="commercialCondition"
                                                                        value={formData.commercialCondition}
                                                                        onChange={handleChange}
                                                                        type="number"
                                                                        placeholder="Ej: 5"
                                                                    />
                                                                </div>

                                                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                    <Input
                                                                        label="ID de Categoría"
                                                                        name="idCategoria"
                                                                        value={formData.idCategoria}
                                                                        onChange={handleChange}
                                                                        type="number"
                                                                        placeholder="Ej: 25"
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Toggle
                                                                        label={formData.applyListPrice ? "Aplica al precio de lista" : "No aplica al precio de lista"}
                                                                        checked={formData.applyListPrice}
                                                                        name="applyListPrice"
                                                                        onChange={handleChange}
                                                                    />
                                                                </div>
                                                            </CollapsibleSection>

                                                            {/* Información Adicional */}
                                                            <CollapsibleSection
                                                                title="Información Adicional"
                                                                description="Mensajes y detalles adicionales"
                                                                icon={<FaInfo />}
                                                                defaultOpen={false}
                                                            >
                                                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                    <Textarea
                                                                        label="Disclaimer"
                                                                        name="disclaimer"
                                                                        value={formData.disclaimer}
                                                                        onChange={handleChange}
                                                                        placeholder="Términos y condiciones aplicables..."
                                                                    />
                                                                </div>

                                                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                    <Textarea
                                                                        label="Mensaje Descriptivo"
                                                                        name="textDescriptive"
                                                                        value={formData.textDescriptive}
                                                                        onChange={handleChange}
                                                                        placeholder="Descripción adicional..."
                                                                    />
                                                                </div>
                                                            </CollapsibleSection>

                                                            <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'right' }}>
                                                                <Button
                                                                    variation="primary"
                                                                    size="large"
                                                                    onClick={() => handleSubmit(showToast)}
                                                                    isLoading={loading}
                                                                    icon={<FaSave />}
                                                                >
                                                                    Crear Opción de Financiación
                                                                </Button>
                                                            </div>
                                                        </>
                                                    ) : formData.type === TipoPago.TARJETA ?
                                                        (
                                                            <>
                                                                {/* Configuración de Tarjeta */}
                                                                <CollapsibleSection
                                                                    title="Configuración de Tarjeta"
                                                                    description="Configure los datos básicos de la tarjeta"
                                                                    icon={<FaCreditCard />}
                                                                    highlight={true}
                                                                >
                                                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <Toggle
                                                                            label={formData.isCardBank ? "Es Tarjeta Bancaria" : "No es Tarjeta Bancaria"}
                                                                            checked={formData.isCardBank}
                                                                            name="isCardBank"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </div>

                                                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <Dropdown
                                                                            label="Tipo de cuotas"
                                                                            options={[
                                                                                { value: InstallmentType.INTEREST_FREE, label: 'Cuotas sin interés' },
                                                                                { value: InstallmentType.FIXED, label: 'Cuotas fijas' },
                                                                                { value: InstallmentType.WITH_INTEREST, label: 'Cuotas con interés' },
                                                                            ]}
                                                                            value={formData.installmentType}
                                                                            onChange={(_, value) => setFormData({ ...formData, installmentType: value })}
                                                                        />
                                                                        {formData.installmentType === InstallmentType.WITH_INTEREST && (
                                                                            <div className="info-box" style={{ marginTop: 'var(--spacing-md)' }}>
                                                                                <Input
                                                                                    label="Interés de las cuotas (%)"
                                                                                    name="interesCoutasFijas"
                                                                                    value={formData.interesCoutasFijas}
                                                                                    onChange={handleChange}
                                                                                    type="number"
                                                                                    placeholder="Ej: 15"
                                                                                />
                                                                                <small style={{ display: 'block', marginTop: '8px', color: 'var(--color-gray-500)' }}>
                                                                                    Ingrese solo el valor numérico del interés. Este valor se sumará al precio total del producto y se dividirá por la cantidad de cuotas.
                                                                                </small>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="row-container" style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <div className="col-middle">
                                                                            <Input
                                                                                label="Cantidad de Cuotas"
                                                                                name="amountCoutas"
                                                                                value={formData.amountCoutas}
                                                                                onChange={handleChange}
                                                                                type="number"
                                                                                placeholder="Ej: 3, 6, 12"
                                                                            />
                                                                        </div>
                                                                        <div className="col-middle">
                                                                            <Input
                                                                                label="Banco"
                                                                                name="bank"
                                                                                value={formData.bank}
                                                                                onChange={handleChange}
                                                                                type="text"
                                                                                placeholder="Ej: Santander"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <Dropdown
                                                                        label="Tipo de Tarjeta"
                                                                        options={[
                                                                            { value: "", label: "Seleccionar" },
                                                                            ...Object.entries(TipoTarjeta).map(([key, value]) => ({
                                                                                value,
                                                                                label: key,
                                                                            })),
                                                                        ]}
                                                                        value={formData.cardType || ""}
                                                                        onChange={(e) => handleDropdownChange("cardType", e.target.value)}
                                                                    />

                                                                    <div style={{ marginTop: 'var(--spacing-md)' }}>
                                                                        <Input
                                                                            label="Imagen del Banco"
                                                                            name="imgBank"
                                                                            value={formData.imgBank}
                                                                            onChange={handleChange}
                                                                            type="text"
                                                                            placeholder="Ej: santander.png"
                                                                        />
                                                                        <div className="info-box info-box-warning" style={{ marginTop: '8px', fontSize: '13px' }}>
                                                                            Subir primero la imagen al <a href="https://naturallife.myvtex.com/admin/a" target="_blank" style={{ textDecoration: 'underline', color: 'var(--color-primary)' }}>File Manager</a> y después poner el nombre del archivo completo.
                                                                        </div>
                                                                    </div>
                                                                </CollapsibleSection>

                                                                {/* Visualización */}
                                                                <CollapsibleSection
                                                                    title="Visualización"
                                                                    description="Dónde y cómo se mostrará la opción"
                                                                    icon={<FaEye />}
                                                                >
                                                                    <div className="form-section section-success" style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <div className="form-section-title">
                                                                            Lugares de visualización
                                                                        </div>
                                                                        <div className="row-container">
                                                                            <div className="col-middle">
                                                                                <Toggle
                                                                                    label={formData.applyPLP ? "Aplica en PLP (Listado)" : "No aplica en PLP"}
                                                                                    checked={formData.applyPLP}
                                                                                    name="applyPLP"
                                                                                    onChange={handleChange}
                                                                                />
                                                                            </div>
                                                                            <div className="col-middle">
                                                                                <Toggle
                                                                                    label={formData.applyCheckout ? "Aplica en Checkout" : "No aplica en Checkout"}
                                                                                    checked={formData.applyCheckout}
                                                                                    name="applyCheckout"
                                                                                    onChange={handleChange}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <Toggle
                                                                            label={formData.showPrecio ? "Mostrar precio en cuotas" : "No mostrar precio en cuotas"}
                                                                            checked={formData.showPrecio}
                                                                            name="showPrecio"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </div>

                                                                    <div className="info-box info-box-info">
                                                                        <Toggle
                                                                            label={formData.isDestacado ? "Es destacado" : "No es destacado"}
                                                                            checked={formData.isDestacado}
                                                                            name="isDestacado"
                                                                            onChange={handleChange}
                                                                        />
                                                                        <div style={{ marginTop: '12px', fontSize: '13px' }}>
                                                                            <strong>ℹ️ Información:</strong>
                                                                            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                                                                <li><strong>Destacado (ON):</strong> Se muestra en la página del producto (PDP)</li>
                                                                                <li><strong>No destacado (OFF):</strong> Se muestra en el modal "Ver todas las opciones"</li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </CollapsibleSection>

                                                                {/* Vigencia */}
                                                                <CollapsibleSection
                                                                    title="Vigencia"
                                                                    description="Configure el período de validez y días de aplicación"
                                                                    icon={<FaCalendarAlt />}
                                                                >
                                                                    <div className="row-container" style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <div className="col-middle">
                                                                            <DatePicker
                                                                                label="Fecha Desde"
                                                                                value={formData.dateFrom}
                                                                                onChange={(value) =>
                                                                                    setFormData({ ...formData, dateFrom: value })
                                                                                }
                                                                                locale="es-AR"
                                                                            />
                                                                        </div>
                                                                        <div className="col-middle">
                                                                            <DatePicker
                                                                                label="Fecha Hasta"
                                                                                value={formData.dateTo}
                                                                                onChange={(value) =>
                                                                                    setFormData({ ...formData, dateTo: value })
                                                                                }
                                                                                locale="es-AR"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <CheckboxGroup
                                                                        name="recurrence"
                                                                        label="Días de recurrencia"
                                                                        id="recurrence"
                                                                        value="recurrence"
                                                                        checkedMap={checkedMap}
                                                                        onGroupChange={handleRecurrenceChange}
                                                                    />
                                                                    <div className="info-box info-box-info" style={{ marginTop: 'var(--spacing-sm)' }}>
                                                                        <strong>Días seleccionados:</strong> {formData.recurrence.split(",").join(", ") || "Ninguno"}
                                                                    </div>
                                                                </CollapsibleSection>

                                                                {/* Descuentos */}
                                                                <CollapsibleSection
                                                                    title="Descuento"
                                                                    description="Configure descuentos aplicables"
                                                                    icon={<FaPercentage />}
                                                                    defaultOpen={false}
                                                                >
                                                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <Toggle
                                                                            label={formData.showDescount ? "Mostrar descuento" : "No mostrar descuento"}
                                                                            checked={formData.showDescount}
                                                                            name="showDescount"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </div>
                                                                    <Input
                                                                        label="Porcentaje de Descuento (%)"
                                                                        name="discountPercentage"
                                                                        value={formData.discountPercentage}
                                                                        onChange={handleChange}
                                                                        type="number"
                                                                        placeholder="Ej: 10"
                                                                    />
                                                                </CollapsibleSection>

                                                                {/* Productos donde aplica */}
                                                                <CollapsibleSection
                                                                    title="Productos donde Aplica"
                                                                    description="Defina a qué productos se aplicará esta financiación"
                                                                    icon={<FaBoxOpen />}
                                                                    defaultOpen={false}
                                                                >
                                                                    <div className="info-box info-box-warning" style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <strong>⚠️ Importante:</strong>
                                                                        <ul>
                                                                            <li>Si "Aplica a todos los productos" está activado, no se considerará el ID de colección o categoría</li>
                                                                            <li>Si se coloca ID de Colección, no puede tener ID de Categoría y viceversa</li>
                                                                        </ul>
                                                                    </div>

                                                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <Toggle
                                                                            label={
                                                                                formData.applyAllProducts
                                                                                    ? "Aplica a todos los productos"
                                                                                    : "No aplica a todos los productos"
                                                                            }
                                                                            checked={formData.applyAllProducts}
                                                                            name="applyAllProducts"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </div>

                                                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <Input
                                                                            label="ID de Colección"
                                                                            name="idCollecion"
                                                                            value={formData.idCollecion}
                                                                            onChange={handleChange}
                                                                            type="number"
                                                                            placeholder="Ej: 142"
                                                                        />
                                                                    </div>

                                                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <Input
                                                                            label="Condición Comercial"
                                                                            name="commercialCondition"
                                                                            value={formData.commercialCondition}
                                                                            onChange={handleChange}
                                                                            type="number"
                                                                            placeholder="Ej: 5"
                                                                        />
                                                                    </div>

                                                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <Input
                                                                            label="ID de Categoría"
                                                                            name="idCategoria"
                                                                            value={formData.idCategoria}
                                                                            onChange={handleChange}
                                                                            type="number"
                                                                            placeholder="Ej: 25"
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <Toggle
                                                                            label={formData.applyListPrice ? "Aplica al precio de lista" : "No aplica al precio de lista"}
                                                                            checked={formData.applyListPrice}
                                                                            name="applyListPrice"
                                                                            onChange={handleChange}
                                                                        />
                                                                    </div>
                                                                </CollapsibleSection>

                                                                {/* Costos Financieros */}
                                                                <CollapsibleSection
                                                                    title="Costos Financieros"
                                                                    description="TEA, CFT y notas adicionales"
                                                                    icon={<FaCog />}
                                                                    defaultOpen={false}
                                                                >
                                                                    <div className="row-container" style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <div className="col-middle">
                                                                            <Input
                                                                                label="TEA (%)"
                                                                                name="tea"
                                                                                value={formData.tea}
                                                                                onChange={handleChange}
                                                                                type="number"
                                                                                placeholder="Ej: 45.5"
                                                                            />
                                                                        </div>
                                                                        <div className="col-middle">
                                                                            <Input
                                                                                label="CFT (%)"
                                                                                name="cft"
                                                                                value={formData.cft}
                                                                                onChange={handleChange}
                                                                                type="number"
                                                                                placeholder="Ej: 52.3"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                        <Textarea
                                                                            label="Disclaimer"
                                                                            name="disclaimer"
                                                                            value={formData.disclaimer}
                                                                            onChange={handleChange}
                                                                            placeholder="Términos y condiciones aplicables..."
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <Textarea
                                                                            label="Mensaje Descriptivo"
                                                                            name="textDescriptive"
                                                                            value={formData.textDescriptive}
                                                                            onChange={handleChange}
                                                                            placeholder="Descripción adicional..."
                                                                        />
                                                                    </div>
                                                                </CollapsibleSection>

                                                                <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'right' }}>
                                                                    <Button
                                                                        variation="primary"
                                                                        size="large"
                                                                        onClick={() => handleSubmit(showToast)}
                                                                        isLoading={loading}
                                                                        icon={<FaSave />}
                                                                    >
                                                                        Crear Opción de Financiación
                                                                    </Button>
                                                                </div>
                                                            </>
                                                        ) :
                                                        null
                                            }

                                        </form>
                                    </>
                                )
                            }
                        </ToastConsumer>
                    </PageBlock>
                </div>
            </Layout>
        </ToastProvider>
    );
}

export default InstallmentsInfoAdminCreate;
