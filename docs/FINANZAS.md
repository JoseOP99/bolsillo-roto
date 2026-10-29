# Modelo financiero

Moneda COP; SQL usa `numeric(18,2)`. El formato de UI redondea a pesos, pero las cuotas se conservan a centavos. TypeScript redondea explícitamente a centavos y SQL calcula con decimales de precisión arbitraria. No usar el formato visual como fuente para cálculos.

## Tasas y amortización

EA es un porcentaje anual: `TEM = (1 + EA / 100)^(1 / 12) − 1`. Para principal P, tasa mensual r y n cuotas, la cuota fija es `P × r / (1 − (1 + r)^(-n))`. Si r = 0, cuota = P/n. Cada interés se calcula sobre saldo previo; el capital es cuota menos interés. La última cuota ajusta el redondeo para terminar exactamente en cero.

La implementación TypeScript está en `src/lib/finance.ts`, con tests de conservación de capital, tasa cero, tasa alta, entradas inválidas y vencimiento del 31 de enero en febrero. SQL genera el calendario autoritativo dentro de `private.record_transaction`; no confía en cuotas calculadas por el navegador.

Para el calendario real, la primera cuota vence en el mes posterior al corte correspondiente a la compra; si la compra ocurre después del corte, pasa al mes siguiente. Un día de pago inexistente en un mes se ajusta al último día. Es una convención explícita del producto, no una reproducción contractual de cada banco. Una compra a una cuota también usa la tasa EA configurada: si tu banco no cobra intereses a una cuota, configura EA 0 para ese caso o registra la excepción cuando se añada soporte por compra.

## Caja y deudas

Saldo disponible = saldos iniciales de cuentas no crediticias + ingresos − gastos de esas cuentas. Una compra con tarjeta no reduce caja inmediatamente. El dashboard separa total de gastos del saldo disponible. El simulador no guarda una compra; usa Nuevo movimiento y selecciona la tarjeta para crearla.

Proyección de fin de mes = caja actual + compromisos de ingreso posteriores a hoy − compromisos de gasto posteriores a hoy − cuotas sin pagar que vencen antes de fin de mes. No supone que restar una nómina sea un gasto. No incluye compromisos vencidos ni pagos manuales de cuotas conciliados. Revisa fechas y evita registrar dos veces un mismo compromiso como deuda y gasto fijo.

Los préstamos llevan capital y abonos. Un bloqueo de fila serializa abonos concurrentes y prohíbe pagar por encima del saldo. Los abonos no se reflejan automáticamente en cuentas bancarias. La liquidación de interés contractual y las transferencias entre cuentas no están implementadas.

La categoría 50/30/20 la elige el usuario. El adaptador de Telegram sugiere una categoría mediante palabras clave; no usa IA ni presume exactitud. La gráfica compara distribución de ingresos objetivo con gasto observado por categoría; no muestra un historial bancario ni una predicción entrenada.
