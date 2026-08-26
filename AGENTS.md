# Instrucciones del proyecto Saracho Neumáticos

## Sincronización obligatoria antes de trabajar

Antes de analizar, crear o modificar cualquier archivo de este proyecto:

1. Confirmar que el repositorio actual es `bissojoaquin-sketch/saracho-neumaticos-vtex`, revisar la rama activa y ejecutar `git status --short --branch` para preservar cualquier cambio local existente.
2. Consultar el repositorio remoto con `git fetch origin --prune`.
3. Comparar la rama local con `origin/main`.
4. Si la copia local está limpia y solamente está atrasada, actualizarla mediante `git pull --ff-only origin main`.
5. Si existen cambios locales, ramas divergentes, conflictos, errores de autenticación o problemas de red, no sobrescribir, descartar, rebasar ni guardar cambios automáticamente. Informar la situación antes de modificar archivos.
6. Una vez sincronizado, leer `README.md`, `REGLAS_PROYECTO.md`, los últimos commits relevantes y los archivos relevantes para la tarea antes de comenzar.

No iniciar el trabajo solicitado hasta completar esta comprobación o comunicar claramente el bloqueo. Tratar el repositorio y sus documentos actuales como fuente de verdad, por encima del historial de conversaciones.

Cuando el usuario indique que agregó, subió o modificó algo en GitHub, repetir inmediatamente esta comprobación y sincronización antes de continuar.

## Reglas de trabajo

- Cumplir siempre `REGLAS_PROYECTO.md`.
- Preservar los cambios existentes del usuario y evitar operaciones destructivas de Git.
- No cambiar la visibilidad privada del repositorio.
- No hacer commit, push, publicar una app VTEX ni modificar servicios externos sin una solicitud explícita del usuario.
- Al terminar una tarea con cambios, resumir los archivos modificados y las verificaciones realizadas.

## Publicación

- Preservar el historial de `main`; no usar `push --force` ni reescribir commits.
- No publicar credenciales, archivos `.env`, dependencias `node_modules` ni archivos temporales.
- Agregar y confirmar únicamente archivos pertenecientes a la tarea actual.
- Verificar el estado del repositorio antes y después de cada publicación.
