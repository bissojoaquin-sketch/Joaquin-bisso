import React, { useEffect, useState, useRef } from 'react';
import { Layout, PageBlock, ToastProvider, ToastConsumer, Spinner } from 'vtex.styleguide';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import './index.global.css';
import FinancingOptionCard from './FinancingOptionCard';
import FinancingOptionForm from './FinancingOptionForm';

function isExpired(dateTo) {
    if (!dateTo) return false;
    const today = new Date();
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const d = new Date(dateTo);
    const toDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return todayDay > toDay;
}

function InstallmentsInfoAdmin() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const toastFnRef = useRef(null);

    const draggedIdRef = useRef(null);
    const [dragOverId, setDragOverId] = useState(null);
    const [recentAction, setRecentAction] = useState(null);
    const recentTimerRef = useRef(null);

    const RECENT_MS = 5 * 60 * 1000;

    const setRecent = (id, type) => {
        if (recentTimerRef.current) clearTimeout(recentTimerRef.current);
        setRecentAction({ id, type });
        recentTimerRef.current = setTimeout(() => setRecentAction(null), RECENT_MS);
    };

    const getRecentAction = (item) => {
        if (recentAction?.id === item.id) return recentAction.type;
        if (item.updatedIn) {
            const diff = Date.now() - new Date(item.updatedIn).getTime();
            if (diff < RECENT_MS) {
                const wasJustCreated = item.createdIn && Math.abs(new Date(item.updatedIn) - new Date(item.createdIn)) < 5000;
                return wasJustCreated ? 'created' : 'edited';
            }
        }
        return null;
    };

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('todos');
    const [filterApply, setFilterApply] = useState('todos');
    const [filterDestacado, setFilterDestacado] = useState('todos');

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/_v/get-all-installments-info');
            if (res.status === 200) setData(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredData = data.filter(item => {
        if (search && !item.description?.toLowerCase().includes(search.toLowerCase())) return false;

        if (filterStatus !== 'todos') {
            const active = item.isActive !== false;
            const expired = isExpired(item.dateTo);
            if (filterStatus === 'activas' && (!active || expired)) return false;
            if (filterStatus === 'inactivas' && active) return false;
            if (filterStatus === 'expiradas' && !expired) return false;
        }

        if (filterApply !== 'todos') {
            if (filterApply === 'todos_productos' && !item.applyAllProducts) return false;
            if (filterApply === 'coleccion' && !item.collectionIds) return false;
            if (filterApply === 'condicion_comercial' && !(item.applyByCommercialCondition && item.commercialCondition)) return false;
        }

        if (filterDestacado !== 'todos') {
            if (filterDestacado === 'si' && !item.isDestacado) return false;
            if (filterDestacado === 'no' && item.isDestacado) return false;
        }

        return true;
    }).sort((a, b) => {
        const oa = a.displayOrder != null ? a.displayOrder : Infinity;
        const ob = b.displayOrder != null ? b.displayOrder : Infinity;
        return oa - ob;
    });

    const handleCreate = () => { setEditingItem(null); setFormOpen(true); };
    const handleEdit = (item) => { setEditingItem(item); setFormOpen(true); };
    const handleCloseForm = () => { setFormOpen(false); setEditingItem(null); };

    const handleSave = async (body) => {
        try {
            if (editingItem) {
                await axios.patch(`/_v/get-all-installments-info-id/${editingItem.id}`, body);
                setRecent(editingItem.id, 'edited');
            } else {
                const maxOrder = data.reduce((max, item) => {
                    const o = item.displayOrder != null ? item.displayOrder : 0;
                    return o > max ? o : max;
                }, 0);
                const res = await axios.post('/_v/get-all-installments-info', { ...body, displayOrder: maxOrder + 1 });
                const newId = res.data?.DocumentId || res.data?.Id || res.data?.id || null;
                if (newId) setRecent(newId, 'created');
            }
            handleCloseForm();
            await fetchAll();
            if (toastFnRef.current) toastFnRef.current({ message: editingItem ? 'Opción actualizada correctamente.' : 'Opción creada correctamente.', duration: 3000 });
        } catch (err) {
            console.error(err);
            if (toastFnRef.current) toastFnRef.current({ message: 'Error al guardar. Intentá de nuevo.', duration: 3000, variation: 'error' });
        }
    };

    const handleDelete = (id) => setConfirmDelete(id);

    const handleDragStart = (e, id) => {
        draggedIdRef.current = id;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id);
    };
    const handleDragEnd = () => {
        draggedIdRef.current = null;
        setDragOverId(null);
    };
    const handleDragOver = (e, id) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverId(id);
    };
    const handleDragLeave = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDragOverId(null);
        }
    };
    const handleDrop = async (e, targetId) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');

        draggedIdRef.current = null;
        setDragOverId(null);

        if (!draggedId || draggedId === targetId) return;

        const fromIndex = filteredData.findIndex(i => i.id === draggedId);
        const toIndex = filteredData.findIndex(i => i.id === targetId);
        if (fromIndex === -1 || toIndex === -1) return;

        const reordered = [...filteredData];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);

        const orderMap = {};
        reordered.forEach((item, idx) => { orderMap[item.id] = idx + 1; });

        setData(prev => prev.map(item => orderMap[item.id] != null ? { ...item, displayOrder: orderMap[item.id] } : item));
        setRecent(draggedId, 'edited');

        try {
            await Promise.all(reordered.map(item =>
                axios.patch(`/_v/get-all-installments-info-id/${item.id}`, { displayOrder: orderMap[item.id] })
            ));
            if (toastFnRef.current) toastFnRef.current({ message: 'Orden actualizado.', duration: 2000 });
        } catch (err) {
            console.error('[DnD] PATCH error', err);
            if (toastFnRef.current) toastFnRef.current({ message: 'Error al guardar el orden.', duration: 3000, variation: 'error' });
            fetchAll();
        }
    };

    const confirmDeleteAction = async () => {
        const id = confirmDelete;
        setConfirmDelete(null);
        setIsDeleting(id);
        try {
            await axios.delete(`/_v/get-all-installments-info-id/${id}`);
            setData(prev => prev.filter(item => item.id !== id));
            if (toastFnRef.current) toastFnRef.current({ message: 'Opción eliminada.', duration: 3000 });
        } catch (err) {
            console.error(err);
            if (toastFnRef.current) toastFnRef.current({ message: 'Error al eliminar.', duration: 3000, variation: 'error' });
        } finally {
            setIsDeleting(null);
        }
    };

    const hasFilters = search || filterStatus !== 'todos' || filterApply !== 'todos' || filterDestacado !== 'todos';

    return (
        <ToastProvider positioning="window">
            <ToastConsumer>
                {({ showToast }) => {
                    toastFnRef.current = showToast;
                    return (
                        <>
                            <Layout fullWidth>
                                <div className="admin-page">
                                    <PageBlock variation="full">
                                        <div className="admin-header">
                                            <div className="admin-header-left">
                                                <h1 className="admin-title">Calculador de Cuotas</h1>
                                            </div>
                                        </div>

                                        <div className="admin-section">
                                            <div className="admin-section-header">
                                                <h2 className="admin-section-title">Opciones de Financiación</h2>
                                                <button type="button" className="btn-primary" onClick={handleCreate}>
                                                    <FaPlus style={{ marginRight: '6px' }} />
                                                    Nueva Opción
                                                </button>
                                            </div>

                                            <div className="admin-filters">
                                                <input
                                                    className="admin-filter-input"
                                                    type="text"
                                                    placeholder="Buscar por descripción..."
                                                    value={search}
                                                    onChange={e => setSearch(e.target.value)}
                                                />
                                                <select className="admin-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                                    <option value="todos">Estado: Todos</option>
                                                    <option value="activas">Activas</option>
                                                    <option value="inactivas">Inactivas</option>
                                                    <option value="expiradas">Expiradas</option>
                                                </select>
                                                <select className="admin-filter-select" value={filterApply} onChange={e => setFilterApply(e.target.value)}>
                                                    <option value="todos">Aplica a: Todos</option>
                                                    <option value="todos_productos">Todos los productos</option>
                                                    <option value="coleccion">Por colección</option>
                                                    <option value="condicion_comercial">Por cond. comercial</option>
                                                </select>
                                                <select className="admin-filter-select" value={filterDestacado} onChange={e => setFilterDestacado(e.target.value)}>
                                                    <option value="todos">Destacado: Todos</option>
                                                    <option value="si">Destacadas</option>
                                                    <option value="no">No destacadas</option>
                                                </select>
                                                {hasFilters && (
                                                    <button
                                                        type="button"
                                                        className="btn-outline"
                                                        onClick={() => { setSearch(''); setFilterStatus('todos'); setFilterApply('todos'); setFilterDestacado('todos'); }}
                                                    >
                                                        Limpiar
                                                    </button>
                                                )}
                                            </div>
                                            <div className="admin-filter-count">
                                                {filteredData.length} de {data.length} opciones
                                                {!hasFilters && data.length > 1 && (
                                                    <span className="admin-drag-hint"> · Arrastrá las tarjetas para cambiar el orden</span>
                                                )}
                                            </div>

                                            {isLoading ? (
                                                <div className="admin-loading"><Spinner color="currentColor" size={32} /></div>
                                            ) : filteredData.length === 0 ? (
                                                <div className="admin-empty">
                                                    <p className="admin-empty-text">
                                                        {data.length === 0 ? 'No hay opciones de financiación configuradas' : 'No hay resultados para los filtros aplicados'}
                                                    </p>
                                                    {data.length === 0 && (
                                                        <button type="button" className="btn-primary btn-primary--full" onClick={handleCreate}>
                                                            <FaPlus style={{ marginRight: '8px' }} />
                                                            Crear Primera Opción
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="options-list">
                                                    {filteredData.map(item => (
                                                        <FinancingOptionCard
                                                            key={item.id}
                                                            item={item}
                                                            onEdit={handleEdit}
                                                            onDelete={handleDelete}
                                                            isDeleting={isDeleting}
                                                            recentAction={getRecentAction(item)}
                                                            isDragOver={dragOverId === item.id}
                                                            isDragging={draggedIdRef.current === item.id}
                                                            handleProps={{
                                                                draggable: true,
                                                                onDragStart: (e) => handleDragStart(e, item.id),
                                                                onDragEnd: () => handleDragEnd(),
                                                            }}
                                                            dropProps={{
                                                                onDragOver: (e) => handleDragOver(e, item.id),
                                                                onDragLeave: (e) => handleDragLeave(e),
                                                                onDrop: (e) => handleDrop(e, item.id),
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </PageBlock>
                                </div>

                            </Layout>

                            {formOpen && (
                                <FinancingOptionForm item={editingItem} onClose={handleCloseForm} onSave={handleSave} />
                            )}

                            {confirmDelete && (
                                <div className="modal-backdrop" onClick={() => setConfirmDelete(null)}>
                                    <div className="confirm-modal" onClick={e => e.stopPropagation()}>
                                        <h3 className="confirm-modal-title">¿Eliminar opción?</h3>
                                        <p className="confirm-modal-text">Esta acción no se puede deshacer.</p>
                                        <div className="confirm-modal-actions">
                                            <button type="button" className="btn-outline" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                                            <button type="button" className="btn-danger" onClick={confirmDeleteAction}>Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    );
                }}
            </ToastConsumer>
        </ToastProvider>
    );
}

export default InstallmentsInfoAdmin;
