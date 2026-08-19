import React, { useEffect, useState } from "react"
import axios from "axios"
import { Table, Button, Dropdown, Spinner } from "vtex.styleguide"

const TipoPago = {
    EFECTIVO: 1,
    TARJETA: 2,
    CONTADO: 3,
    PROMOS_BANCARIAS: 4,
}

const tipoPagoLabels = {
    1: "Efectivo",
    2: "Tarjeta",
    3: "Contado",
    4: "Promos Bancarias",
}

const orderKeys = ["orderType1", "orderType2", "orderType3", "orderType4"]

const InstallmentsInfoAdminConfig = () => {
    const [data, setData] = useState({})
    const [initialData, setInitialData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [recordId, setRecordId] = useState(null)

    useEffect(() => {
        getInstallmentsInfoConfig()
    }, [])

    const getInstallmentsInfoConfig = async () => {
        setIsLoading(true)
        try {
            const res = await axios.get(`/_v/get-all-installments-info-config`)
            const raw = res?.data?.[0] || {}

            const filtered = orderKeys.reduce((acc, key) => {
                acc[key] = raw[key] ?? null
                return acc
            }, {})

            setRecordId(raw.id || null)
            setData(filtered)
            setInitialData(filtered)
        } catch (err) {
            console.error("Error fetching config", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDropdownChange = (key, value) => {
        setData((prev) => ({
            ...prev,
            [key]: parseInt(value),
        }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await axios.patch(`/_v/get-all-installments-info-config-id/${recordId}`, data)

            await getInstallmentsInfoConfig()
        } catch (err) {
            console.error("Error saving config", err)
        } finally {
            setIsSaving(false)
        }
    }

    const isModified = JSON.stringify(data) !== JSON.stringify(initialData)

    const schema = {
        properties: {
            orden: {
                title: "Orden",
                cellRenderer: ({ rowData }) => (
                    <span>{`Orden ${rowData.key.replace("orderType", "")}`}</span>
                ),
            },
            tipoPago: {
                title: "Tipo de pago",
                cellRenderer: ({ rowData }) => (
                    <div>
                        <Dropdown
                            options={[
                                { value: "", label: "Seleccionar" },
                                ...Object.entries(tipoPagoLabels).map(([val, label]) => ({
                                    value: val,
                                    label,
                                })),
                            ]}
                            value={data?.[rowData.key]?.toString() || ""}
                            onChange={(e) => handleDropdownChange(rowData.key, e.target.value)}
                        />
                    </div>
                )
            },
        },
    }

    const items = orderKeys.map((key) => ({
        key,
    }))

    return (
        <div className="pa5">
            <h2 className="t-heading-4 mb4">Configuración Visualización PDP</h2>

            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <Table
                        fullWidth
                        items={items}
                        schema={schema}
                        density="compact"
                        emptyStateLabel="Sin datos configurados"
                    />

                    {isModified && (
                        <div className="mt5">
                            <Button
                                variation="primary"
                                isLoading={isSaving}
                                onClick={handleSave}
                            >
                                Guardar Nueva configuración
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default InstallmentsInfoAdminConfig
