# Reglas del proyecto Saracho Neumáticos

## Plataforma y flujo

- La tienda utiliza VTEX.
- Producteca sincroniza el catálogo con VTEX; cualquier modificación debe evitar inconsistencias entre ambos sistemas.

## Edición de Excel existentes

- Modificar únicamente dimensiones y peso cuando esa sea la tarea solicitada.
- No modificar nombre, marca, categorías, especificaciones ni otros datos correctos.
- No completar ID de Producto ni SKU de VTEX; los genera VTEX.
- No rellenar celdas vacías con `63` ni con ningún otro marcador.
- Mantener vacíos los campos sin información real.
- Revisar el archivo antes de entregarlo.
- La tabla debe comenzar en `A1`, no desplazada a columnas posteriores.

## Dimensiones y peso

- Calcular las dimensiones según la medida real del neumático.
- Ancho expresado en centímetros.
- Alto y largo según el diámetro exterior exacto, sin redondeos innecesarios.
- Peso del paquete expresado en gramos.
- Para publicaciones de kits x2 y x4, calcular las dimensiones según la cantidad de neumáticos.

## Excel de catalogación

- Respetar cada columna y la estructura de VTEX.
- **Plantilla final obligatoria:** la investigación, búsqueda de fotos y normalización son etapas intermedias. Antes de entregar, volcar siempre los datos en la plantilla vigente de la plataforma destino: plantilla oficial VTEX para VTEX y plantilla Producteca para Producteca. No entregar una planilla nueva, reducida o adaptada si existe una plantilla aplicable.
- Conservar encabezados, columnas, formatos, fórmulas, etiquetas y patrones de publicaciones de la plantilla. En Producteca, respetar los tipos de publicación y kits que correspondan; en VTEX, respetar la estructura completa de importación.
- Dejar **Condición comercial** vacía porque cambia con el tiempo.
- Completar nombres, códigos de referencia, marca, categoría, departamento, URL, dimensiones, peso y demás campos únicamente con información confirmada o calculable.
- No inventar características técnicas.

## Plantilla Producteca

- Para cada neumático, generar seis publicaciones salvo indicación distinta: `<SKU>-CL`, `<SKU>-PR-PUIS`, `KIT2-<SKU>-CL`, `KIT2-<SKU>-PR-PUIS`, `KIT4-<SKU>-CL` y `KIT4-<SKU>-PR-PUIS`.
- Usar los nombres `NEUMATICO <medida y modelo>`, `KIT X2 NEUMATICO <medida y modelo>` y `KIT X4 NEUMATICO <medida y modelo>`, y conservar los tags Producteca de cada tipo de publicación.
- Para las fotos, consultar la planilla fuente por hoja de marca y localizar el modelo exacto. Copiar todas las URLs disponibles de ese modelo, separadas por comas, en la columna `Fotos` de las seis publicaciones del mismo neumático. Luego agregar las imágenes de la hoja `Plantilla`: para Michelin y BFGoodrich, las cuatro imágenes 1, 2, 3 y 4; para el resto de las marcas, las imágenes 1, 3 y 4. No usar links de producto ni imágenes de otro modelo. Si no se encuentran fotos propias, conservar igualmente las imágenes obligatorias de `Plantilla`.
- Mantener vacíos precios, monedas, costos, número de parte y notas cuando no hayan sido proporcionados o confirmados. No crear datos comerciales por inferencia.

## SEO fijo

- **Título de la página:** `Saracho Neumáticos | Tienda Online | Reseller Michelin`
- **Metadescripción:** `Revendedor Oficial Michelin. Comercializamos neumáticos para tu Auto o Camioneta. Realizamos envíos a todo el País en todas tus Compras. Aboná en 6 o 12 Cuotas.`
- Estos dos textos no se modifican según el producto.
- **Fecha de release:** fecha del día como texto en formato `AAAA-MM-DD`.

## Descripciones de producto

- Redactar en español argentino formal.
- Usar varios párrafos; no una descripción breve de dos renglones.
- Incluir, cuando corresponda:
  - presentación general del modelo;
  - tipo de uso y vehículos indicados;
  - beneficios de desempeño, confort, seguridad o durabilidad;
  - comportamiento en ciudad, ruta o terrenos mixtos;
  - cierre comercial claro y sin exageraciones.

## Marcas e IDs de VTEX recuperados

| Marca | ID VTEX |
|---|---:|
| BFGoodrich | 2000002 |
| Michelin | 2000003 |
| Continental | 2000004 |
| Nexen | 2000012 |
| Linglong | 2000021 |

## Reportes VTEX

- En comparativos entre semanas, calcular unidades sumando la columna **Unidades**, no contando filas.
- Revisar por separado los servicios y sus correcciones.

## Antecedentes recuperados

- Se menciona un archivo validado con 106 productos y medidas revisadas.
- Se menciona una edición de 208 productos con dimensiones y pesos.
- Se menciona un Excel de Mercado Libre de 42 filas con datos para unidades, kits x2 y kits x4.
- Se menciona un Excel de catalogación de 8 productos.

