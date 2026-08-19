import React, { useState, useEffect } from "react";
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
import axios from "axios";
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
import { useRuntime } from 'vtex.render-runtime'
import { TipoPago, TipoTarjeta } from "../../../constans/constansEnum";
import { InstallmentType, getInstallmentType } from '../../../utils/installmentsModel';
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

function InstallmentsInfoAdminEdit() {
    const { route } = useRuntime();
    const [showTooltip, setShowTooltip] = useState(false);
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
        idCategoria: null,
        applyListPrice: null,
        applyCheckout: null,
        applyPLP: null,
        isCardBank: null,
        installmentType: InstallmentType.INTEREST_FREE,
        interesCoutasFijas: null,
        commercialCondition: null,
        isDestacado: null
    });

    const [loading, setLoading] = useState(false);
    const [checkedMap, setCheckedMap] = useState({
        domingo: { label: "Domingo", checked: false },
        lunes: { label: "Lunes", checked: false },
        martes: { label: "Martes", checked: false },
        miercoles: { label: "Miércoles", checked: false },
        jueves: { label: "Jueves", checked: false },
        viernes: { label: "Viernes", checked: false },
        sabado: { label: "Sabado", checked: false },
    });

    const id = route.params?.id;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/_v/get-all-installments-info-id/${id}`);
            if (response.status === 200) {
                const fetchedData = response.data;
                setFormData({
                    ...formData,
                    ...fetchedData,
                    installmentType: getInstallmentType(fetchedData),
                });
            } else {
                console.error("Error al obtener los datos");
            }
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        } finally {
            setLoading(false);
        }
    };

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
            const response = await axios.patch(`/_v/get-all-installments-info-id/${id}`, {
                ...formData,
                containInteres: formData.installmentType === InstallmentType.WITH_INTEREST,
            });

            if (response.status === 200) {
                showToast({
                    message: "Los cambios se guardaron correctamente.",
                    duration: 3000,
                });
            } else {
                showToast({
                    message: "Error al guardar los cambios.",
                    duration: 3000,
                    variation: "error",
                });
            }
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            showToast({
                message: "Error al guardar los cambios.",
                duration: 3000,
                variation: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ToastProvider positioning="window">
            <Layout>
                <div className="mt6">
                    <PageBlock
                        variation="full"
                    >
                        <PageHeader
                            style={{ padding: 0 }}
                            title="Editar Opciones de Financiación"
                            linkLabel="Volver"
                            onLinkClick={() => window.location.href = '/admin/app/custom-installments-info/'}
                        />
                        <ToastConsumer>
                            {({ showToast }) =>
                                loading ? (
                                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                                        <Spinner color="currentColor" size={40} />
                                    </div>
                                ) : (
                                    <form onSubmit={(e) => e.preventDefault()} className="animate-slide-in mt2">
                                        {/* Selector de tipo de pago */}
                                        <div className="form-section section-info" style={{ marginBottom: 'var(--spacing-xl)' }}>
                                            <div className="form-section-title">
                                                <FaCog />
                                                Tipo de Opción de Financiación
                                            </div>
                                            <Dropdown
                                                label="Seleccione el tipo de pago"
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

                                        {formData.type && (
                                            <>
                                                {formData.type === TipoPago.EFECTIVO || formData.type === TipoPago.CONTADO ? (
                                                    <>
                                                        {/* Sección de Vigencia */}
                                                        <CollapsibleSection
                                                            title="Vigencia"
                                                            description="Configure el período de validez y días de aplicación"
                                                            icon={<FaCalendarAlt />}
                                                            defaultOpen={true}
                                                        >
                                                            <div className="row-container" style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                <div className="col-middle">
                                                                    <DatePicker
                                                                        label="Fecha Desde"
                                                                        value={formData.dateFrom ? new Date(formData.dateFrom) : undefined}
                                                                        onChange={(value) => setFormData({ ...formData, dateFrom: value })}
                                                                        locale="es-AR"
                                                                    />
                                                                </div>
                                                                <div className="col-middle">
                                                                    <DatePicker
                                                                        label="Fecha Hasta"
                                                                        value={formData.dateTo ? new Date(formData.dateTo) : undefined}
                                                                        onChange={(value) => setFormData({ ...formData, dateTo: value })}
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
                                                                <strong>Días seleccionados:</strong> {formData?.recurrence?.split(",").join(", ") || "Ninguno"}
                                                            </div>
                                                        </CollapsibleSection>

                                                        {/* Sección de Descuento */}
                                                        <CollapsibleSection
                                                            title="Descuento"
                                                            description="Configure el porcentaje de descuento aplicable"
                                                            icon={<FaPercentage />}
                                                            highlight={true}
                                                        >
                                                            <Input
                                                                label="Descuento (%)"
                                                                name="discountPercentage"
                                                                value={formData.discountPercentage || ""}
                                                                onChange={handleChange}
                                                                type="number"
                                                                placeholder="Ej: 10"
                                                            />
                                                        </CollapsibleSection>

                                                        {/* Sección de Productos */}
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
                                                                    label={formData.applyAllProducts ? "Aplica a todos los productos" : "No aplica a todos los productos"}
                                                                    checked={formData.applyAllProducts}
                                                                    name="applyAllProducts"
                                                                    onChange={handleChange}
                                                                />
                                                            </div>

                                                            <div className="row-container" style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                <div className="col-middle">
                                                                    <Input
                                                                        label="ID de Colección"
                                                                        name="idCollecion"
                                                                        value={formData.idCollecion || ""}
                                                                        onChange={handleChange}
                                                                        type="number"
                                                                        placeholder="Ej: 123"
                                                                        disabled={formData.applyAllProducts}
                                                                    />
                                                                </div>
                                                                <div className="col-middle">
                                                                    <Input
                                                                        label="ID de Categoría"
                                                                        name="idCategoria"
                                                                        value={formData.idCategoria || ""}
                                                                        onChange={handleChange}
                                                                        type="number"
                                                                        placeholder="Ej: 456"
                                                                        disabled={formData.applyAllProducts}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                <Input
                                                                    label="Condición Comercial"
                                                                    name="commercialCondition"
                                                                    value={formData.commercialCondition || ""}
                                                                    onChange={handleChange}
                                                                    type="number"
                                                                    placeholder="Ej: 789"
                                                                />
                                                            </div>

                                                            <Toggle
                                                                label={formData.applyListPrice ? "Aplica al precio de lista" : "No aplica al precio de lista"}
                                                                checked={formData.applyListPrice}
                                                                name="applyListPrice"
                                                                onChange={handleChange}
                                                            />
                                                        </CollapsibleSection>

                                                        {/* Sección de Mensajes */}
                                                        <CollapsibleSection
                                                            title="Mensajes Informativos"
                                                            description="Textos adicionales para mostrar al cliente"
                                                            icon={<FaInfo />}
                                                            defaultOpen={false}
                                                        >
                                                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                <Textarea
                                                                    label="Disclaimer"
                                                                    name="disclaimer"
                                                                    value={formData.disclaimer || ""}
                                                                    onChange={handleChange}
                                                                    placeholder="Texto legal o aclaraciones importantes"
                                                                />
                                                            </div>
                                                            <Textarea
                                                                label="Mensaje Descriptivo"
                                                                name="textDescriptive"
                                                                value={formData.textDescriptive || ""}
                                                                onChange={handleChange}
                                                                placeholder="Descripción adicional de la promoción"
                                                            />
                                                        </CollapsibleSection>
                                                    </>
                                                ) : formData.type === TipoPago.TARJETA ? (
                                                    <>
                                                        {/* Configuración de Tarjeta */}
                                                        <CollapsibleSection
                                                            title="Configuración de Tarjeta"
                                                            description="Tipo de tarjeta e intereses"
                                                            icon={<FaCreditCard />}
                                                            highlight={true}
                                                            defaultOpen={true}
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
                                                                            value={formData.interesCoutasFijas || ""}
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
                                                                        value={formData.amountCoutas || ""}
                                                                        onChange={handleChange}
                                                                        type="number"
                                                                        placeholder="Ej: 3, 6, 12"
                                                                    />
                                                                </div>
                                                                <div className="col-middle">
                                                                    <Input
                                                                        label="Banco"
                                                                        name="bank"
                                                                        value={formData.bank || ""}
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
                                                                        value={formData.dateFrom ? new Date(formData.dateFrom) : undefined}
                                                                        onChange={(value) => setFormData({ ...formData, dateFrom: value })}
                                                                        locale="es-AR"
                                                                    />
                                                                </div>
                                                                <div className="col-middle">
                                                                    <DatePicker
                                                                        label="Fecha Hasta"
                                                                        value={formData.dateTo ? new Date(formData.dateTo) : undefined}
                                                                        onChange={(value) => setFormData({ ...formData, dateTo: value })}
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
                                                                <strong>Días seleccionados:</strong> {formData?.recurrence?.split(",").join(", ") || "Ninguno"}
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
                                                                value={formData.discountPercentage || ""}
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
                                                                    label={formData.applyAllProducts ? "Aplica a todos los productos" : "No aplica a todos los productos"}
                                                                    checked={formData.applyAllProducts}
                                                                    name="applyAllProducts"
                                                                    onChange={handleChange}
                                                                />
                                                            </div>

                                                            <div className="row-container" style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                <div className="col-middle">
                                                                    <Input
                                                                        label="ID de Colección"
                                                                        name="idCollecion"
                                                                        value={formData.idCollecion || ""}
                                                                        onChange={handleChange}
                                                                        type="number"
                                                                        placeholder="Ej: 123"
                                                                        disabled={formData.applyAllProducts}
                                                                    />
                                                                </div>
                                                                <div className="col-middle">
                                                                    <Input
                                                                        label="ID de Categoría"
                                                                        name="idCategoria"
                                                                        value={formData.idCategoria || ""}
                                                                        onChange={handleChange}
                                                                        type="number"
                                                                        placeholder="Ej: 456"
                                                                        disabled={formData.applyAllProducts}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                <Input
                                                                    label="Condición Comercial"
                                                                    name="commercialCondition"
                                                                    value={formData.commercialCondition || ""}
                                                                    onChange={handleChange}
                                                                    type="number"
                                                                    placeholder="Ej: 789"
                                                                />
                                                            </div>

                                                            <Toggle
                                                                label={formData.applyListPrice ? "Aplica al precio de lista" : "No aplica al precio de lista"}
                                                                checked={formData.applyListPrice}
                                                                name="applyListPrice"
                                                                onChange={handleChange}
                                                            />
                                                        </CollapsibleSection>

                                                        {/* Información bancaria */}
                                                        <CollapsibleSection
                                                            title="Información Bancaria"
                                                            description="Datos adicionales del banco"
                                                            icon={<FaMoneyBillWave />}
                                                            defaultOpen={false}
                                                        >
                                                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                <Input
                                                                    label="Imagen del Banco (nombre del archivo)"
                                                                    name="imgBank"
                                                                    value={formData.imgBank || ""}
                                                                    onChange={handleChange}
                                                                    type="text"
                                                                    placeholder="Ej: santander.png"
                                                                />
                                                                <div className="info-box info-box-warning" style={{ marginTop: 'var(--spacing-sm)' }}>
                                                                    <strong>📁 Instrucciones:</strong> Subir primero la imagen al{' '}
                                                                    <a
                                                                        href="https://naturallife.myvtex.com/admin/a"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{ color: 'var(--color-primary)', fontWeight: '600' }}
                                                                    >
                                                                        File Manager de VTEX
                                                                    </a>
                                                                    , luego ingrese solo el nombre del archivo (ej: santander.png o macro.jpg)
                                                                </div>
                                                            </div>

                                                            <div className="row-container" style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                <div className="col-middle">
                                                                    <Input
                                                                        label="TEA (%)"
                                                                        name="tea"
                                                                        value={formData.tea || ""}
                                                                        onChange={handleChange}
                                                                        type="number"
                                                                        placeholder="Tasa Efectiva Anual"
                                                                    />
                                                                </div>
                                                                <div className="col-middle">
                                                                    <Input
                                                                        label="CFT (%)"
                                                                        name="cft"
                                                                        value={formData.cft || ""}
                                                                        onChange={handleChange}
                                                                        type="number"
                                                                        placeholder="Costo Financiero Total"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </CollapsibleSection>

                                                        {/* Mensajes */}
                                                        <CollapsibleSection
                                                            title="Mensajes Informativos"
                                                            description="Textos adicionales para mostrar al cliente"
                                                            icon={<FaInfo />}
                                                            defaultOpen={false}
                                                        >
                                                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                                <Textarea
                                                                    label="Disclaimer"
                                                                    name="disclaimer"
                                                                    value={formData.disclaimer || ""}
                                                                    onChange={handleChange}
                                                                    placeholder="Texto legal o aclaraciones importantes"
                                                                />
                                                            </div>
                                                            <Textarea
                                                                label="Mensaje Descriptivo"
                                                                name="textDescriptive"
                                                                value={formData.textDescriptive || ""}
                                                                onChange={handleChange}
                                                                placeholder="Descripción adicional de la promoción"
                                                            />
                                                        </CollapsibleSection>
                                                    </>
                                                ) : null}
                                            </>
                                        )}

                                        {/* Botón de guardar */}
                                        <div style={{
                                            position: 'sticky',
                                            bottom: 0,
                                            background: 'white',
                                            padding: 'var(--spacing-lg)',
                                            borderTop: '2px solid var(--color-gray-200)',
                                            marginTop: 'var(--spacing-xl)',
                                            display: 'flex',
                                            gap: 'var(--spacing-md)',
                                            justifyContent: 'flex-end'
                                        }}>
                                            <Button
                                                variation="secondary"
                                                size="large"
                                                icon={<FaArrowLeft />}
                                                onClick={() => window.location.href = '/admin/app/custom-installments-info/'}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                variation="primary"
                                                size="large"
                                                icon={<FaSave />}
                                                onClick={() => handleSubmit(showToast)}
                                                isLoading={loading}
                                            >
                                                Guardar Cambios
                                            </Button>
                                        </div>
                                    </form>
                                )
                            }
                        </ToastConsumer>
                    </PageBlock>
                </div>
            </Layout>
        </ToastProvider>
    );
}

export default InstallmentsInfoAdminEdit;
