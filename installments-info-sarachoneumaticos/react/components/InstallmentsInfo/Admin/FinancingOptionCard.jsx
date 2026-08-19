import React from 'react';
import { getInstallmentLabel, getInstallmentType } from '../../../utils/installmentsModel';

function parseArray(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return String(val).split(',').filter(Boolean); }
}

function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

function isExpired(dateTo) {
    if (!dateTo) return false;
    const today = new Date();
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const d = new Date(dateTo);
    const toDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return todayDay > toDay;
}

function FinancingOptionCard({ item, onEdit, onDelete, isDeleting, handleProps, dropProps, isDragOver, isDragging, recentAction }) {
    const paymentMethods = parseArray(item.paymentMethods);
    const banks = parseArray(item.banks);
    const isActive = item.isActive !== false;
    const expired = isExpired(item.dateTo);
    const discount = item.discountPercentage ? `${item.discountPercentage}%` : null;
    const installments = item.installments || (item.amountCoutas ? String(item.amountCoutas) : null);
    const dateFrom = formatDate(item.dateFrom);
    const dateTo = formatDate(item.dateTo);

    const applyLabel = item.applyAllProducts
        ? 'Todos los productos'
        : item.collectionIds
            ? `Colección: ${item.collectionIds}`
            : (item.applyByCommercialCondition && item.commercialCondition)
                ? `Cond. Comercial: ${item.commercialCondition}`
                : '—';

    const title = item.description
        ? item.description
        : `Opción #${item.id ? item.id.substring(0, 8) : 'nueva'}`;

    const cardClasses = [
        'option-card',
        expired ? 'option-card--expired' : '',
        isDragOver ? 'option-card--drag-over' : '',
        isDragging ? 'option-card--dragging' : '',
    ].filter(Boolean).join(' ');

    return (
        <div className={cardClasses} {...(dropProps || {})}>
            {recentAction && (
                <div className={`recent-action-banner recent-action-banner--${recentAction}`}>
                    {recentAction === 'created' ? '✦ Recién creada' : '✎ Editada recientemente'}
                </div>
            )}
            <div className="option-drag-block">
                <span className="drag-handle" title="Arrastrar para reordenar" {...(handleProps || {})}>⠿</span>
            </div>
            <div className="option-card-row">
                <div className="option-card-left-controls">

                    {item.displayOrder != null && (
                        <div className="option-order-block">
                            <span className="option-order-label">Orden</span>
                            <span className="option-order-number">#{item.displayOrder}</span>
                        </div>
                    )}
                </div>

                <div className="option-card-content">
                    <div className="option-card-header">
                        <div className="option-card-title-row">
                            <span className="option-card-title">{title}</span>
                            <span className={`option-badge ${isActive ? 'option-badge--active' : 'option-badge--inactive'}`}>
                                {isActive ? 'Activa' : 'Inactiva'}
                            </span>
                            {expired && <span className="option-badge option-badge--expired">Expirada</span>}
                            {item.isDestacado && <span className="option-badge option-badge--destacado">Destacada</span>}
                            {item.isReintegro && <span className="option-badge option-badge--reintegro">Reintegro</span>}
                            {item.applyPLP && <span className="option-badge option-badge--plp">PLP</span>}
                        </div>
                        <div className="option-card-actions">
                            <button type="button" className="btn-outline" onClick={() => onEdit(item)}>Editar</button>
                            <button
                                type="button"
                                className="btn-outline btn-outline--danger"
                                onClick={() => onDelete(item.id)}
                                disabled={isDeleting === item.id}
                            >
                                {isDeleting === item.id ? '...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>

                    <div className="option-card-info">
                        <div className="option-card-info-item">
                            <span className="option-card-info-label">Medios de pago:</span>
                            <span className={`option-card-info-value ${paymentMethods.length === 0 ? 'option-card-info-value--empty' : 'option-card-info-value--link'}`}>
                                {paymentMethods.length > 0 ? paymentMethods.join(', ') : '0 seleccionados'}
                            </span>
                        </div>
                        <div className="option-card-info-item">
                            <span className="option-card-info-label">Bancos:</span>
                            <span className={`option-card-info-value ${banks.length === 0 ? 'option-card-info-value--empty' : 'option-card-info-value--link'}`}>
                                {banks.length > 0 ? banks.join(', ') : '0 seleccionados'}
                            </span>
                        </div>
                        <div className="option-card-info-item">
                            <span className="option-card-info-label">Cuotas:</span>
                            <span className={`option-card-info-value ${!installments ? 'option-card-info-value--empty' : ''}`}>
                                {installments || 'No especificado'}
                            </span>
                        </div>
                        {installments && (
                            <div className="option-card-info-item">
                                <span className="option-card-info-label">Leyenda:</span>
                                <span className="option-card-info-value">
                                    {getInstallmentLabel(getInstallmentType(item))}
                                </span>
                            </div>
                        )}
                        {discount && (
                            <div className="option-card-info-item">
                                <span className="option-card-info-label">Descuento:</span>
                                <span className="option-card-info-value">{discount}</span>
                            </div>
                        )}
                        <div className="option-card-info-item">
                            <span className="option-card-info-label">Aplica a:</span>
                            <span className="option-card-info-value">{applyLabel}</span>
                        </div>
                        {(dateFrom || dateTo) && (
                            <div className="option-card-info-item">
                                <span className="option-card-info-label">Vigencia:</span>
                                <span className="option-card-info-value">{dateFrom} → {dateTo}</span>
                            </div>
                        )}
                        {item.recurrence && (
                            <div className="option-card-info-item">
                                <span className="option-card-info-label">Recurrencia:</span>
                                <span className="option-card-info-value">{item.recurrence}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default FinancingOptionCard;
