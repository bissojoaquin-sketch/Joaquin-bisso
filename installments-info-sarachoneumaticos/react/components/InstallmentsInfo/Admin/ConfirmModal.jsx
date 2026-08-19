import React from 'react';
import { Modal, Button } from 'vtex.styleguide';
import { FaExclamationTriangle } from 'react-icons/fa';
import './index.global.css';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, isLoading }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            centered
            bottomBar={
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <Button
                        variation="tertiary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText || 'Cancelar'}
                    </Button>
                    <Button
                        variation="danger"
                        onClick={onConfirm}
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        {confirmText || 'Confirmar'}
                    </Button>
                </div>
            }
        >
            <div style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FFF4E6 0%, #FFE5CC 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #FFD699'
                }}>
                    <FaExclamationTriangle size={32} color="#FF8800" />
                </div>

                <div style={{ textAlign: 'center' }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: 'var(--color-gray-900)',
                        marginBottom: '12px'
                    }}>
                        {title || '¿Está seguro?'}
                    </h3>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--color-gray-700)',
                        lineHeight: '1.5',
                        maxWidth: '400px'
                    }}>
                        {message || 'Esta acción no se puede deshacer.'}
                    </p>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmModal;
