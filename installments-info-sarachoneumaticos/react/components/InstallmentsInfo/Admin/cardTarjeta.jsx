import React, { useState, useEffect, useMemo } from 'react'
import {
    Table,
    Spinner,
    ButtonWithIcon,
    Tag,
    Button,
    Dropdown,
    Checkbox,
    Input,
    IconFilter
} from 'vtex.styleguide'
import { FaEdit, FaTrash, FaFilter, FaTimes, FaStar } from 'react-icons/fa'
import { nombreTipoTarjetaHtml } from '../../../constans/constansEnum'
import './index.global.css'
import { TipoTarjeta } from '../../../constans/constansEnum'
import { InstallmentType, getInstallmentLabel, getInstallmentType } from '../../../utils/installmentsModel'
import ConfirmModal from './ConfirmModal';

const isSystemUser = (login) => {
    if (!login || typeof login !== 'string') return false

    const normalized = login.toLowerCase()
    return normalized.includes('vrn--vtexsphinx') || normalized.includes('app_') || normalized.includes('installments-info@')
}

const getUserLabel = (userObj) => {
    const name = userObj?.Name?.trim()
    if (name) return name

    const login = userObj?.Login?.trim()
    if (login && !isSystemUser(login)) return login

    return ''
}

function CardTarjetaTable({ data, handleDelete, handleEdit, isLoading }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const items = useMemo(() => data.map((item) => ({
        ...item,
        banco: item.bank || '',
        cuotas: item.amountCoutas || '',
        fechaDesde: item.dateFrom ? new Date(item.dateFrom).toISOString().split('T')[0] : '',
        fechaHasta: item.dateTo ? new Date(item.dateTo).toISOString().split('T')[0] : '',
        tipoTarjeta: item.cardType || '',
        tipoTarjetaNombre: item.cardType ? nombreTipoTarjetaHtml(item.cardType) : '',
        descuento: item.discountPercentage ? `${item.discountPercentage}%` : '',
        interesCoutasFijas: item.interesCoutasFijas ? `${item.interesCoutasFijas}%` : '',
        cft: item.cft || '',
        tea: item.tea || '',
        imgBank: item.imgBank,
        disclaimer: item.disclaimer || '',
        descripcion: item.textDescriptive || '',
        recurrence: item.recurrence,
        idCollecion: item.idCollecion || '',
        idCategoria: item.idCategoria || '',
        applyListPrice: item.applyListPrice,
        showPrecio: item.showPrecio,
        applyAllProducts: item.applyAllProducts,
        showDescount: item.showDescount,
        isCardBank: item.isCardBank,
        applyPLP: Boolean(item.applyPLP),
        applyCheckout: item.applyCheckout,
        installmentType: getInstallmentType(item),
        isBetterFinancing: item.isBetterFinancing,
        isDestacado: Boolean(item.isDestacado),
        usuarioCreacion: getUserLabel(item.createdBy_USER),
        usuarioEdicion: getUserLabel(item.lastInteractionBy_USER),
        usuarioActualizacion: getUserLabel(item.updatedBy_USER)
    })), [data])

    const [filters, setFilters] = useState({
        tipoTarjeta: '',
        tipoCuotas: '',
        aplicaPLP: '',
        cantidadCuotas: '',
        mejorFinanciacion: false,
        esDestacado: '',
    })

    const [filteredItems, setFilteredItems] = useState(items)
    const [showFilters, setShowFilters] = useState(false)
    const [hasActiveFilters, setHasActiveFilters] = useState(false)

    useEffect(() => {
        let result = items

        if (filters.tipoTarjeta && filters.tipoTarjeta !== '')
            result = result.filter(i => i.tipoTarjeta === filters.tipoTarjeta)

        if (filters.tipoCuotas !== '')
            result = result.filter(i => i.installmentType === filters.tipoCuotas)

        if (filters.aplicaPLP !== '')
            result = result.filter(i => i.applyPLP === (filters.aplicaPLP === 'true'))

        if (filters.cantidadCuotas)
            result = result.filter(i => String(i.cuotas) === filters.cantidadCuotas)

        if (filters.mejorFinanciacion)
            result = result.filter(i => i.isBetterFinancing === true)

        if (filters.esDestacado !== '')
            result = result.filter(i => i.isDestacado === (filters.esDestacado === 'true'))

        setFilteredItems(result)
    }, [items, filters])

    useEffect(() => {
        const active =
            filters.tipoTarjeta !== '' ||
            filters.tipoCuotas !== '' ||
            filters.aplicaPLP !== '' ||
            filters.cantidadCuotas !== '' ||
            filters.mejorFinanciacion !== false ||
            filters.esDestacado !== ''
        setHasActiveFilters(active)
    }, [filters])

    const limpiarFiltros = () => {
        setFilters({
            tipoTarjeta: '',
            tipoCuotas: '',
            aplicaPLP: '',
            cantidadCuotas: '',
            mejorFinanciacion: false,
            esDestacado: '',
        })
    }

    const schema = {
        properties: {
            banco: {
                title: 'Banco',
                width: 130,
                headerRenderer: () => <strong>Banco</strong>
            },
            cuotas: {
                title: 'Cuotas',
                width: 90,
                headerRenderer: () => <strong>Cuotas</strong>,
                cellRenderer: ({ cellData }) => (
                    <div style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '15px' }}>
                        {cellData}x
                    </div>
                )
            },
            fechaDesde: {
                title: 'Fecha Desde',
                width: 120,
                headerRenderer: () => <strong>Fecha Desde</strong>
            },
            fechaHasta: {
                title: 'Fecha Hasta',
                width: 120,
                headerRenderer: () => <strong>Fecha Hasta</strong>
            },
            tipoTarjetaNombre: {
                title: 'Tarjeta',
                width: 130,
                headerRenderer: () => <strong>Tarjeta</strong>,
                cellRenderer: ({ cellData, rowData }) => {
                    const colors = {
                        'VISA': { bg: '#1A1F71', color: 'white' },
                        'MASTERCARD': { bg: '#EB001B', color: 'white' },
                        'AMEX': { bg: '#006FCF', color: 'white' }
                    }
                    const style = colors[rowData.tipoTarjeta] || { bg: 'var(--color-gray-200)', color: 'var(--color-gray-700)' }
                    return (
                        <div style={{
                            background: style.bg,
                            color: style.color,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'inline-block'
                        }}>
                            {cellData}
                        </div>
                    )
                }
            },
            descuento: {
                title: 'Desc.',
                width: 80,
                headerRenderer: () => <strong>Desc.</strong>,
                cellRenderer: ({ cellData }) => cellData ? (
                    <div style={{
                        color: 'var(--color-success)',
                        fontWeight: '700',
                        fontSize: '14px'
                    }}>
                        {cellData}
                    </div>
                ) : <span style={{ color: '#ccc' }}>-</span>
            },
            interesCoutasFijas: {
                title: 'Interés',
                width: 80,
                headerRenderer: () => <strong>Interés</strong>,
                cellRenderer: ({ cellData }) => cellData ? (
                    <div style={{
                        color: 'var(--color-warning)',
                        fontWeight: '700',
                        fontSize: '14px'
                    }}>
                        {cellData}
                    </div>
                ) : <span style={{ color: '#ccc' }}>-</span>
            },
            applyPLP: {
                title: 'PLP',
                width: 70,
                headerRenderer: () => <strong style={{ textAlign: 'center', display: 'block' }}>PLP</strong>,
                cellRenderer: ({ cellData }) => (
                    <div style={{
                        textAlign: 'center',
                        color: cellData ? '#00AA55' : '#888888',
                        fontWeight: '700',
                        fontSize: '16px'
                    }}>
                        {cellData ? '✓' : '✗'}
                    </div>
                )
            },
            installmentType: {
                title: 'Tipo',
                width: 150,
                headerRenderer: () => <strong>Tipo</strong>,
                cellRenderer: ({ cellData }) => (
                    <div style={{
                        fontWeight: '600',
                        fontSize: '13px'
                    }}>
                        {getInstallmentLabel(cellData)}
                    </div>
                )
            },
            isDestacado: {
                title: 'Destacado',
                width: 90,
                headerRenderer: () => <strong style={{ textAlign: 'center', display: 'block' }}>★ Destacado</strong>,
                cellRenderer: ({ cellData }) => cellData ? (
                    <div style={{ color: 'var(--color-warning)', textAlign: 'center' }}>
                        <FaStar size={16} />
                    </div>
                ) : '-'
            },
            imgBank: {
                title: 'Logo',
                width: 80,
                headerRenderer: () => <strong style={{ textAlign: 'center', display: 'block' }}>Logo</strong>,
                cellRenderer: ({ cellData }) =>
                    cellData ? (
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={`/arquivos/${cellData}?v=0.5`}
                                alt="Logo Banco"
                                style={{
                                    width: '50px',
                                    height: '28px',
                                    objectFit: 'contain',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>
                    ) : (
                        <span style={{ color: '#ccc', textAlign: 'center', display: 'block' }}>-</span>
                    ),
            },
            recurrence: {
                title: 'Días Vigentes',
                width: 200,
                headerRenderer: () => <strong>Días Vigentes</strong>,
                cellRenderer: ({ rowData }) =>
                    rowData.recurrence ? (
                        <div style={{
                            color: '#0066CC',
                            fontWeight: '500',
                            fontSize: '12px',
                            lineHeight: '1.5'
                        }}>
                            {rowData.recurrence.split(',').map(day => day.trim()).join(', ')}
                        </div>
                    ) : (
                        <span style={{ color: '#ccc' }}>-</span>
                    ),
            },
            acciones: {
                title: 'Acciones',
                width: 180,
                headerRenderer: () => <strong style={{ textAlign: 'center', display: 'block' }}>Acciones</strong>,
                cellRenderer: ({ rowData }) => (
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                            onClick={() => handleEdit(rowData.id)}
                            style={{
                                padding: '5px 10px',
                                background: '#134E9B',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '500',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#0F3D7A';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = '#134E9B';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            title="Editar"
                        >
                            <FaEdit size={11} />
                        </button>
                        <button
                            onClick={() => {
                                setItemToDelete(rowData.id);
                                setShowConfirmModal(true);
                            }}
                            style={{
                                padding: '5px 10px',
                                background: '#E94C3D',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '500',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#D43E31';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = '#E94C3D';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            title="Eliminar"
                        >
                            <FaTrash size={11} />
                        </button>
                    </div>
                )
            },
            usuariosAuditoria: {
                title: 'Auditoría',
                width: 300,
                headerRenderer: () => <strong>Auditoría</strong>,
                cellRenderer: ({ rowData }) => {
                    const auditParts = [
                        rowData.usuarioCreacion ? `Creó: ${rowData.usuarioCreacion}` : null,
                        rowData.usuarioEdicion ? `Editó: ${rowData.usuarioEdicion}` : null,
                        rowData.usuarioActualizacion ? `Actualizó: ${rowData.usuarioActualizacion}` : null
                    ].filter(Boolean)

                    if (!auditParts.length) {
                        return <span style={{ color: '#999' }} />
                    }

                    const text = auditParts.join(' | ')

                    return (
                        <span
                            title={text}
                            style={{
                                display: 'inline-block',
                                maxWidth: '280px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: '12px',
                                color: 'var(--color-gray-700)'
                            }}
                        >
                            {text}
                        </span>
                    )
                }
            }
        },
    }

    return (
        <div className="animate-slide-in">
            {/* Panel de filtros */}
            <div className="filter-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showFilters ? 'var(--spacing-md)' : '0' }}>
                    <div className="filter-panel-title">
                        <FaFilter />
                        Filtros
                        {hasActiveFilters && (
                            <span style={{
                                background: 'var(--color-primary)',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontSize: '11px',
                                fontWeight: '600'
                            }}>
                                Activos
                            </span>
                        )}
                    </div>
                    <Button
                        variation="tertiary"
                        size="small"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
                    </Button>
                </div>

                {showFilters && (
                    <div>
                        <div className="filter-grid">
                            <Dropdown
                                label="Tipo de Tarjeta"
                                size="small"
                                options={[
                                    { value: '', label: 'Todas' },
                                    { value: 'VISA', label: 'Visa' },
                                    { value: 'MASTERCARD', label: 'Mastercard' },
                                    { value: 'AMEX', label: 'Amex' },
                                ]}
                                value={filters.tipoTarjeta}
                                onChange={(_, value) => setFilters(prev => ({ ...prev, tipoTarjeta: value }))}
                            />

                            <Dropdown
                                label="Tipo de cuotas"
                                size="small"
                                options={[
                                    { value: '', label: 'Todos' },
                                    { value: InstallmentType.INTEREST_FREE, label: 'Cuotas sin interés' },
                                    { value: InstallmentType.FIXED, label: 'Cuotas fijas' },
                                    { value: InstallmentType.WITH_INTEREST, label: 'Cuotas con interés' },
                                ]}
                                value={filters.tipoCuotas}
                                onChange={(_, value) => setFilters(prev => ({ ...prev, tipoCuotas: value }))}
                            />

                            <Dropdown
                                label="Aplica PLP"
                                size="small"
                                options={[
                                    { value: '', label: 'Todos' },
                                    { value: 'true', label: 'Sí' },
                                    { value: 'false', label: 'No' },
                                ]}
                                value={filters.aplicaPLP}
                                onChange={(_, value) => setFilters(prev => ({ ...prev, aplicaPLP: value }))}
                            />

                            <Input
                                label="Cantidad de Cuotas"
                                size="small"
                                placeholder="Ej: 3, 6, 12..."
                                value={filters.cantidadCuotas}
                                onChange={(e) => setFilters(prev => ({ ...prev, cantidadCuotas: e.target.value }))}
                            />

                            <Dropdown
                                label="Es Destacado"
                                size="small"
                                options={[
                                    { value: '', label: 'Todos' },
                                    { value: 'true', label: 'Sí' },
                                    { value: 'false', label: 'No' },
                                ]}
                                value={filters.esDestacado}
                                onChange={(_, value) => setFilters(prev => ({ ...prev, esDestacado: value }))}
                            />

                            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '16px' }}>
                                <Checkbox
                                    label="Solo mejor financiación"
                                    checked={filters.mejorFinanciacion}
                                    onChange={(e) => setFilters(prev => ({ ...prev, mejorFinanciacion: e.target.checked }))}
                                />
                            </div>
                        </div>

                        <div className="filter-actions">
                            <Button
                                variation="secondary"
                                size="regular"
                                onClick={limpiarFiltros}
                                icon={<FaTimes />}
                            >
                                Limpiar Filtros
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Contador de resultados */}
            <div style={{
                marginBottom: 'var(--spacing-md)',
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #E7F3FF 0%, #EBF5FF 100%)',
                border: '1px solid #B8DFFE',
                borderRadius: 'var(--border-radius-md)',
                fontSize: '14px',
                color: 'var(--color-gray-900)',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
                <span style={{ fontSize: '16px' }}>📊</span>
                Mostrando <strong style={{ color: 'var(--color-primary)', fontSize: '15px' }}>{filteredItems.length}</strong> de <strong style={{ color: 'var(--color-primary)', fontSize: '15px' }}>{items.length}</strong> registros
                {hasActiveFilters && (
                    <span style={{
                        marginLeft: 'auto',
                        padding: '2px 8px',
                        background: 'var(--color-warning)',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                    }}>
                        Filtros Activos
                    </span>
                )}
            </div>

            {/* Tabla */}
            <div className="table-responsive">
                <Table
                    fullWidth
                    items={filteredItems}
                    schema={schema}
                    density="medium"
                    emptyStateLabel="No se encontraron resultados"
                />
            </div>

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setItemToDelete(null);
                }}
                onConfirm={() => {
                    if (itemToDelete) {
                        handleDelete(itemToDelete);
                    }
                    setShowConfirmModal(false);
                    setItemToDelete(null);
                }}
                title="¿Eliminar opción de pago?"
                message="Esta acción eliminará permanentemente esta opción de financiación. Esta acción no se puede deshacer."
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                isLoading={isLoading === itemToDelete}
            />
        </div>
    )
}

export default CardTarjetaTable
