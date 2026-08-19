import React, { useState } from 'react';
import { Button, Tag, ButtonWithIcon } from 'vtex.styleguide';
import { FaTrash, FaEdit, FaCalendarAlt, FaPercent, FaMoneyBillWave, FaTags, FaInfoCircle } from 'react-icons/fa';
import './index.global.css'
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

function CardEfectivo({ item, handleDelete, handleEdit, isLoading }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const usuarioCreacion = getUserLabel(item.createdBy_USER)
    const usuarioEdicion = getUserLabel(item.lastInteractionBy_USER)
    const usuarioActualizacion = getUserLabel(item.updatedBy_USER)

    const auditParts = [
        usuarioCreacion ? `Creo: ${usuarioCreacion}` : null,
        usuarioEdicion ? `Edito: ${usuarioEdicion}` : null,
        usuarioActualizacion ? `Actualizo: ${usuarioActualizacion}` : null
    ].filter(Boolean)

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="custom-card animate-slide-in">
            {/* Header con badge */}
            <div className="custom-card-header">
                <div className="custom-card-badge">
                    <FaMoneyBillWave style={{ marginRight: '4px' }} />
                    {item.type === 1 ? 'Efectivo' : 'Contado'}
                </div>
            </div>

            {/* Contenido principal */}
            <div style={{ marginBottom: '16px' }}>
                {/* Descuento destacado */}
                {item.discountPercentage && (
                    <div className="custom-card-highlight" style={{
                        background: 'linear-gradient(135deg, #33961A 0%, #2C7D16 100%)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                            {item.discountPercentage}% OFF
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.9 }}>
                            Descuento
                        </div>
                    </div>
                )}

                {/* Fechas */}
                {(item.dateFrom || item.dateTo) && (
                    <div style={{
                        background: 'var(--color-info-light)',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '12px'
                    }}>
                        {item.dateFrom && (
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <FaCalendarAlt size={12} style={{ marginRight: '8px', color: 'var(--color-info)' }} />
                                <div>
                                    <strong style={{ fontSize: '12px', color: 'var(--color-gray-700)' }}>Desde:</strong>
                                    <div style={{ fontSize: '14px', fontWeight: '500' }}>{formatDate(item.dateFrom)}</div>
                                </div>
                            </div>
                        )}
                        {item.dateTo && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaCalendarAlt size={12} style={{ marginRight: '8px', color: 'var(--color-info)' }} />
                                <div>
                                    <strong style={{ fontSize: '12px', color: 'var(--color-gray-700)' }}>Hasta:</strong>
                                    <div style={{ fontSize: '14px', fontWeight: '500' }}>{formatDate(item.dateTo)}</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Recurrencia */}
                {item.recurrence && (
                    <div style={{ marginBottom: '12px' }}>
                        <strong style={{ fontSize: '12px', color: 'var(--color-gray-700)', display: 'block', marginBottom: '8px' }}>
                            Días de vigencia:
                        </strong>
                        <div className="recurrence-container">
                            {item.recurrence.split(',').map((day, index) => (
                                <Tag key={index} variation="green" size="small">
                                    {day.trim()}
                                </Tag>
                            ))}
                        </div>
                    </div>
                )}

                {/* Información adicional */}
                <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: '12px' }}>
                    {item.applyListPrice != null && (
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <FaTags size={12} style={{ marginRight: '8px', color: 'var(--color-gray-500)' }} />
                            <span style={{ fontSize: '13px' }}>
                                <strong>Precio Lista:</strong> {item.applyListPrice ? 'Sí' : 'No'}
                            </span>
                        </div>
                    )}

                    {item.bank && (
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '13px' }}>
                                <strong>Banco:</strong> {item.bank}
                            </span>
                        </div>
                    )}

                    {item.idCollecion && (
                        <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                            <strong>ID Colección:</strong> {item.idCollecion}
                        </div>
                    )}

                    {item.idCategoria && (
                        <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                            <strong>ID Categoría:</strong> {item.idCategoria}
                        </div>
                    )}

                    {item.commercialCondition && (
                        <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                            <strong>Condición Comercial:</strong> {item.commercialCondition}
                        </div>
                    )}

                    {(item.cft || item.tea) && (
                        <div style={{
                            background: 'var(--color-gray-50)',
                            padding: '8px',
                            borderRadius: '4px',
                            margin: '8px 0',
                            fontSize: '12px'
                        }}>
                            {item.cft && <div><strong>CFT:</strong> {item.cft}%</div>}
                            {item.tea && <div><strong>TEA:</strong> {item.tea}%</div>}
                        </div>
                    )}

                    {item.disclaimer && (
                        <div style={{
                            fontSize: '12px',
                            color: 'var(--color-gray-500)',
                            fontStyle: 'italic',
                            marginTop: '8px',
                            padding: '8px',
                            background: 'var(--color-warning-light)',
                            borderRadius: '4px',
                            borderLeft: '3px solid var(--color-warning)'
                        }}>
                            <FaInfoCircle size={10} style={{ marginRight: '6px' }} />
                            {item.disclaimer}
                        </div>
                    )}

                    {item.textDescriptive && (
                        <div style={{
                            fontSize: '12px',
                            color: 'var(--color-gray-700)',
                            marginTop: '8px',
                            padding: '8px',
                            background: 'var(--color-gray-50)',
                            borderRadius: '4px'
                        }}>
                            {item.textDescriptive}
                        </div>
                    )}

                    {auditParts.length > 0 && (
                        <div style={{
                            fontSize: '12px',
                            color: 'var(--color-gray-600)',
                            marginTop: '10px',
                            paddingTop: '10px',
                            borderTop: '1px dashed var(--color-gray-200)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }} title={auditParts.join(' | ')}>
                            {auditParts.join(' | ')}
                        </div>
                    )}
                </div>
            </div>

            {/* Botones de acción */}
            <div className='button-card-container' style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <ButtonWithIcon
                    variation="secondary"
                    size="small"
                    icon={<FaEdit />}
                    onClick={(e) => {
                        e.preventDefault();
                        handleEdit(item.id);
                    }}
                    isLoading={isLoading === item.id}
                    disabled={isLoading === item.id}
                >
                </ButtonWithIcon>

                <ButtonWithIcon
                    variation="danger"
                    size="small"
                    icon={<FaTrash />}
                    onClick={(e) => {
                        e.preventDefault();
                        setShowConfirmModal(true);
                    }}
                    isLoading={isLoading === item.id}
                    disabled={isLoading === item.id}
                >
                </ButtonWithIcon>
            </div>

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={() => {
                    handleDelete(item.id);
                    setShowConfirmModal(false);
                }}
                title="¿Eliminar opción de pago?"
                message="Esta acción eliminará permanentemente esta opción de financiación. Esta acción no se puede deshacer."
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                isLoading={isLoading === item.id}
            />
        </div>
    );
}

export default CardEfectivo;
