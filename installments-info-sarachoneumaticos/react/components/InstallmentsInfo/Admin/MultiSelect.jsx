import React, { useState, useRef, useEffect } from 'react';

function MultiSelect({ label, options, value, onChange, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selected = value || [];

    const toggleOption = (optValue) => {
        if (selected.includes(optValue)) {
            onChange(selected.filter(v => v !== optValue));
        } else {
            onChange([...selected, optValue]);
        }
    };

    const removeChip = (optValue, e) => {
        e.stopPropagation();
        onChange(selected.filter(v => v !== optValue));
    };

    const selectedItems = selected.map(v => {
        const opt = options.find(o => o.value === v);
        return opt ? { value: v, label: opt.label } : null;
    }).filter(Boolean);

    return (
        <div ref={ref} className="multiselect-wrapper">
            {label && <label className="form-label">{label}</label>}
            <div
                className={`multiselect-trigger ${isOpen ? 'multiselect-trigger--open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="multiselect-chips">
                    {selectedItems.length === 0 ? (
                        <span className="multiselect-placeholder">{placeholder || 'Seleccionar...'}</span>
                    ) : (
                        selectedItems.map(item => (
                            <span key={item.value} className="multiselect-chip">
                                {item.label}
                                <button
                                    type="button"
                                    className="multiselect-chip-remove"
                                    onClick={(e) => removeChip(item.value, e)}
                                >
                                    ×
                                </button>
                            </span>
                        ))
                    )}
                </div>
                <span className={`multiselect-arrow ${isOpen ? 'multiselect-arrow--up' : ''}`}>▾</span>
            </div>
            {isOpen && (
                <div className="multiselect-dropdown">
                    {options.map(opt => (
                        <div
                            key={opt.value}
                            className={`multiselect-option ${selected.includes(opt.value) ? 'multiselect-option--selected' : ''}`}
                            onClick={() => toggleOption(opt.value)}
                        >
                            <input
                                type="checkbox"
                                readOnly
                                checked={selected.includes(opt.value)}
                                className="multiselect-checkbox"
                            />
                            <span>{opt.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MultiSelect;
