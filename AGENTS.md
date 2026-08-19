# Instrucciones del proyecto

## Sincronización obligatoria antes de trabajar

Antes de analizar, crear o modificar cualquier archivo de este proyecto:

1. Ejecutar `git status --short --branch` para preservar cualquier cambio local existente.
2. Consultar el repositorio remoto con `git fetch origin --prune`.
3. Comparar la rama local con `origin/main`.
4. Si la copia local está limpia y solamente está atrasada, actualizarla mediante `git pull --ff-only origin main`.
5. Si existen cambios locales, ramas divergentes, conflictos, errores de autenticación o problemas de red, no sobrescribir, descartar, rebasar ni guardar cambios automáticamente. Informar la situación antes de modificar archivos.
6. Una vez sincronizado, leer `README.md`, `REGLAS_PROYECTO.md` y los archivos relevantes para la tarea antes de comenzar.

No iniciar el trabajo solicitado hasta completar esta comprobación o comunicar claramente el bloqueo.

## Publicación

- Preservar el historial de `main`; no usar `push --force` ni reescribir commits.
- No publicar credenciales, archivos `.env`, dependencias `node_modules` ni archivos temporales.
- Agregar y confirmar únicamente archivos pertenecientes a la tarea actual.
- Verificar el estado del repositorio antes y después de cada publicación.
