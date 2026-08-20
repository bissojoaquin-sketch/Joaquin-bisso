# Catalogación masiva de Producteca

Este documento define las reglas obligatorias para preparar futuras planillas de
alta masiva de productos en Producteca para Saracho Neumáticos.

## Archivos y fuentes de referencia

- Ejemplo de importación: [`Creacion_masiva_de_productos_ejemplo.xlsx`](Creacion_masiva_de_productos_ejemplo.xlsx).
- Fuente oficial de imágenes: [Planilla de fotos de productos](https://docs.google.com/spreadsheets/d/1NgGZmRRVisLMojemJPd_dpiXBKcDCVG0D0PbygPFgw8/edit?usp=sharing).

Antes de generar una catalogación nueva se deben revisar ambas fuentes. El
archivo de ejemplo define la estructura de Producteca; la planilla de Google
Sheets contiene los enlaces de imágenes organizados por marca y modelo.

## Estructura del Excel

La planilla debe conservar estas 22 columnas, en este orden y comenzando en
`A1`:

1. Código
2. Nombre
3. Marca
4. Tags de Producteca
5. Costo
6. Precio Bna
7. Moneda Bna
8. Precio Default
9. Moneda Default
10. Precio Icbc
11. Moneda Icbc
12. Precio Meli Clasica
13. Moneda Meli Clasica
14. Precio Meli Premium
15. Moneda Meli Premium
16. Precio VTEX
17. Moneda VTEX
18. Colores
19. Talles
20. Fotos
21. Numero de Parte
22. Notas

Los campos sin información real deben permanecer vacíos. No se deben completar
precios, monedas, número de parte, notas ni ningún otro campo con valores de
relleno.

## Publicaciones de auto y camioneta

Cada neumático de auto o camioneta debe generar seis publicaciones:

| Tipo | Código | Prefijo del nombre | Tag exacto |
|---|---|---|---|
| Unidad Clásica | `SKU-CL` | `NEUMATICO` | `Producto Padre + CL + PUIS` |
| Unidad Premium | `SKU-PR-PUIS` | `NEUMATICO` | `Producto Padre + PR + PUIS` |
| Kit x2 Clásica | `KIT2-SKU-CL` | `KIT X2 NEUMATICO` | `KIT x2 + CL + PUIS` |
| Kit x2 Premium | `KIT2-SKU-PR-PUIS` | `KIT X2 NEUMATICO` | `KIT x2 + PR + PUIS` |
| Kit x4 Clásica | `KIT4-SKU-CL` | `KIT X4 NEUMATICO` | `KIT x4 + CL + PUIS` |
| Kit x4 Premium | `KIT4-SKU-PR-PUIS` | `KIT X4 NEUMATICO` | `KIT x4 + PR + PUIS` |

- El sufijo `-CL` identifica las publicaciones Clásicas de Mercado Libre.
- El sufijo `-PR-PUIS` identifica las publicaciones Premium de Mercado Libre.
- El SKU de origen debe conservarse como texto, incluidos los ceros iniciales.
- Los tags son específicos de cada publicación y se deben copiar literalmente.
  No se deben corregir, normalizar ni intercambiar entre filas.

## Publicaciones de moto y accesorios

Los neumáticos de moto y los accesorios no llevan kits x2 ni x4. Se generan
solamente estas dos publicaciones:

| Tipo | Código | Tag exacto |
|---|---|---|
| Unidad Clásica | `SKU-CL` | `Producto Padre + CL + PUIS` |
| Unidad Premium | `SKU-PR-PUIS` | `Producto Padre + PR + PUIS` |

## Imágenes

Los enlaces deben cargarse en la columna `Fotos`, separados por comas y sin
alterar las URL de origen.

1. Buscar primero la pestaña correspondiente a la marca.
2. Localizar el modelo exacto del producto.
3. Incorporar primero las cuatro fotos del modelo, respetando el orden de la
   planilla de imágenes.
4. Si existen recursos adicionales claramente identificados para ese mismo
   modelo, como ficha técnica o placa de kit, agregarlos después de las cuatro
   fotos principales y antes de las placas institucionales.
5. Para Michelin y BFGoodrich, agregar al final las fotos 1, 2, 3 y 4 de la
   pestaña `Plantilla`.
6. Para las demás marcas, agregar al final únicamente las fotos 1, 3 y 4 de la
   pestaña `Plantilla`.

No se debe usar la imagen de un modelo parecido, otra homologación o una familia
de nombre similar sin confirmación expresa. Si no existe la pestaña, no aparece
el producto exacto o faltan fotos, se debe informar qué falta para que pueda ser
cargado antes de una catalogación posterior.

## Validación obligatoria

Antes de entregar una planilla:

- comprobar que la cantidad de publicaciones corresponde al tipo de producto;
- validar códigos, nombres y tags fila por fila;
- verificar que los SKU con cero inicial se mantengan como texto;
- abrir cada URL de imagen o, como mínimo, comprobar que sea una URL válida y
  corresponda al modelo indicado;
- confirmar el orden de las fotos y de las placas de `Plantilla`;
- volver a abrir el Excel exportado y verificar encabezados, filas y valores;
- informar cualquier dato, pestaña, producto o imagen faltante.

## Control de faltantes detectados el 2026-08-20

En la lista Michelin revisada en esa fecha quedaron pendientes:

- SKU `331319`: no aparece el modelo exacto `Pilot Sport 5S`.
- SKU `409706`: no aparece `E Primacy`.
- SKU `699744`: no aparece `X LT A/S 2`.
- SKU `718236`: `Pilot Street 2` aparece con tres fotos, no cuatro.
- SKU `932908`: aparece `Primacy SUV`, pero no el modelo exacto `Primacy SUV+`;
  no se debe asumir equivalencia sin confirmación.

Este control es una observación fechada y debe volver a validarse contra la
planilla de Google Sheets en cada operación futura.
