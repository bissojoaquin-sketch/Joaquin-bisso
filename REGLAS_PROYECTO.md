# Reglas del proyecto Saracho Neumáticos

## Plataforma y flujo

- La tienda utiliza VTEX.
- Producteca sincroniza el catálogo con VTEX; cualquier modificación debe evitar inconsistencias entre ambos sistemas.
- Para altas masivas de Producteca, leer y aplicar obligatoriamente
  [`docs/producteca/README.md`](docs/producteca/README.md) antes de generar el
  Excel. Allí se definen publicaciones Clásicas y Premium, kits, tags, imágenes,
  control de faltantes y validaciones.
- Usar como estructura de referencia
  [`docs/producteca/Creacion_masiva_de_productos_ejemplo.xlsx`](docs/producteca/Creacion_masiva_de_productos_ejemplo.xlsx).
- Consultar en cada operación la
  [planilla oficial de imágenes](https://docs.google.com/spreadsheets/d/1NgGZmRRVisLMojemJPd_dpiXBKcDCVG0D0PbygPFgw8/edit?usp=sharing),
  porque su contenido puede actualizarse.

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
- Dejar **Condición comercial** vacía porque cambia con el tiempo.
- Completar nombres, códigos de referencia, marca, categoría, departamento, URL, dimensiones, peso y demás campos únicamente con información confirmada o calculable.
- No inventar características técnicas.

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
