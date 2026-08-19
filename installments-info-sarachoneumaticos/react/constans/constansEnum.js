export const TipoPago = {
    EFECTIVO: 1,
    TARJETA: 2,
    CONTADO: 3,
    PROMOS_BANCARIAS: 4,
};

export const TipoTarjeta = {
    VISA: 1,
    MASTERCARD: 2,
    AMEX: 3,
    NARANJA: 4,
    CABAL: 5,
};

export function nombreTipoPagoHtml(id) {
    switch (id) {
        case TipoPago.EFECTIVO:
            return <span className="text-success">EFECTIVO</span>;
        case TipoPago.TARJETA:
            return <span className="text-primary">TARJETA</span>;
        case TipoPago.CONTADO:
            return <span className="text-warning">CONTADO</span>;
        default:
            return <span className="text-muted">DESCONOCIDO</span>;
    }
}

export function nombreTipoTarjetaHtml(id) {
    switch (id) {
        case TipoTarjeta.VISA:
            return <span className="text-primary">VISA</span>;
        case TipoTarjeta.MASTERCARD:
            return <span className="text-warning">MASTERCARD</span>;
        case TipoTarjeta.AMEX:
            return <span className="text-info">AMEX</span>;
        case TipoTarjeta.NARANJA:
            return <span className="text-danger">NARANJA</span>;
        case TipoTarjeta.CABAL:
            return <span className="text-secondary">CABAL</span>;
        default:
            return <span className="text-muted">DESCONOCIDO</span>;
    }
}

export function nombreTipoPagoHtmlOptions(id) {
    switch (id) {
        case TipoPago.EFECTIVO:
            return "EFECTIVO";
        case TipoPago.TARJETA:
            return "TARJETA";
        case TipoPago.CONTADO:
            return "CONTADO";
        default:
            return "DESCONOCIDO";
    }
}

export function nombreTipoTarjetaHtmlOptions(id) {
    switch (id) {
        case TipoTarjeta.VISA:
            return "VISA";
        case TipoTarjeta.MASTERCARD:
            return "MASTERCARD";
        case TipoTarjeta.AMEX:
            return "AMEX";
        case TipoTarjeta.NARANJA:
            return "NARANJA";
        case TipoTarjeta.CABAL:
            return "CABAL";
        default:
            return "DESCONOCIDO";
    }
}

export const DiasRecurrencia = {
    DOMINGO: "Domingo",
    LUNES: "Lunes",
    MARTES: "Martes",
    MIERCOLES: "Miércoles",
    JUEVES: "Jueves",
    VIERNES: "Viernes",
    SABADO: "Sábado",
};

export function nombreDiasRecurrencia(id) {
    switch (id) {
        case DiasRecurrencia.DOMINGO:
            return "Domingo";
        case DiasRecurrencia.LUNES:
            return "Lunes";
        case DiasRecurrencia.MARTES:
            return "Martes";
        case DiasRecurrencia.MIERCOLES:
            return "Miércoles";
        case DiasRecurrencia.JUEVES:
            return "Jueves";
        case DiasRecurrencia.VIERNES:
            return "Viernes";
        case DiasRecurrencia.SABADO:
            return "Sábado";
        default:
            return "Desconocido";
    }
}

export function obtenerOpcionesDiasRecurrencia() {
    return Object.entries(DiasRecurrencia).map(([key, value]) => ({
        value: key,
        label: value,
    }));
}

export const DiasRecurrenciaOptions = [
    { value: "DOMINGO", label: "Domingo" },
    { value: "LUNES", label: "Lunes" },
    { value: "MARTES", label: "Martes" },
    { value: "MIERCOLES", label: "Miércoles" },
    { value: "JUEVES", label: "Jueves" },
    { value: "VIERNES", label: "Viernes" },
    { value: "SABADO", label: "Sábado" }
];

export const MediosDePago = [
    { value: 'VISA', label: 'Visa' },
    { value: 'MASTERCARD', label: 'Mastercard' },
    { value: 'AMEX', label: 'American Express' },
    { value: 'NARANJA', label: 'Naranja' },
    { value: 'CABAL', label: 'Cabal' },
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'CONTADO', label: 'Pago Contado' },
    { value: 'DEBITO', label: 'Débito' },
    { value: 'TRANSFERENCIA', label: 'Transferencia' },
];

export const BancosEmisores = [
    { value: 'TODOS', label: 'Todos los bancos' },
    { value: 'GALICIA', label: 'Banco Galicia' },
    { value: 'SANTANDER', label: 'Santander' },
    { value: 'BBVA', label: 'BBVA Francés' },
    { value: 'HSBC', label: 'HSBC' },
    { value: 'ICBC', label: 'ICBC' },
    { value: 'MACRO', label: 'Banco Macro' },
    { value: 'PATAGONIA', label: 'Banco Patagonia' },
    { value: 'SUPERVIELLE', label: 'Supervielle' },
    { value: 'CIUDAD', label: 'Banco Ciudad' },
    { value: 'PROVINCIA', label: 'Banco Provincia' },
    { value: 'NACION', label: 'Banco Nación' },
    { value: 'BRUBANK', label: 'Brubank' },
    { value: 'NARANJA_X', label: 'Naranja X' },
    { value: 'UALA', label: 'Ualá' },
    { value: 'PERSONAL_PAY', label: 'Personal Pay' },
    { value: 'MERCADO_PAGO', label: 'Mercado Pago' },
];