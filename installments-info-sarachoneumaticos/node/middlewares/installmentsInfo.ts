import { json } from 'co-body'
import axios from 'axios'

const VBASE_BUCKET = 'bank-images'

const SYSTEM_FIELDS = new Set([
  'dataEntityId', 'accountId', 'accountName', 'followers', 'schemas',
  'createdBy', 'createdBy_USER', 'lastInteractionBy', 'lastInteractionBy_USER',
  'updatedBy', 'updatedBy_USER', 'tags', 'dataInstanceId', '_sort',
  'lastInteractionIn',
])

function stripSystemFields(doc: any): any {
  return Object.keys(doc).reduce((acc: any, key) => {
    if (!SYSTEM_FIELDS.has(key)) acc[key] = doc[key]
    return acc
  }, {})
}

const ENTITY_SCHEMA = {
  properties: {
    description: { type: 'string', title: 'Descripción' },
    isActive: { type: 'boolean', title: 'Activa' },
    paymentMethods: { type: 'string', title: 'Medios de Pago' },
    banks: { type: 'string', title: 'Bancos' },
    bankImages: { type: 'string', title: 'Imágenes de Bancos' },
    installments: { type: 'string', title: 'Cuotas' },
    isReintegro: { type: 'boolean', title: 'Reintegro' },
    collectionIds: { type: 'string', title: 'IDs de Colección' },
    commercialCondition: { type: 'string', title: 'Condición Comercial' },
    type: { type: 'number', title: 'Tipo de Pago' },
    amountCoutas: { type: 'number', title: 'Cantidad de Cuotas' },
    bank: { type: 'string', title: 'Banco' },
    cardType: { type: 'number', title: 'Tipo de Tarjeta' },
    cft: { type: 'number', title: 'CFT' },
    discountPercentage: { type: 'number', title: 'Descuento %' },
    idCollecion: { type: 'number', title: 'ID Colección' },
    imgBank: { type: 'string', title: 'Imagen Banco' },
    tea: { type: 'number', title: 'TEA' },
    textDescriptive: { type: 'string', title: 'Texto Descriptivo' },
    dateFrom: { type: 'string', format: 'date-time', title: 'Fecha Desde' },
    dateTo: { type: 'string', format: 'date-time', title: 'Fecha Hasta' },
    recurrence: { type: 'string', title: 'Recurrencia' },
    disclaimer: { type: 'string', title: 'Disclaimer' },
    showPrecio: { type: 'boolean', title: 'Mostrar Precio' },
    showDescount: { type: 'boolean', title: 'Mostrar Descuento' },
    applyAllProducts: { type: 'boolean', title: 'Aplica a Todos' },
    applyListPrice: { type: 'boolean', title: 'Aplica a Precio de Lista' },
    idCategoria: { type: 'number', title: 'ID Categoría' },
    applyCheckout: { type: 'boolean', title: 'Aplica en Checkout' },
    applyPLP: { type: 'boolean', title: 'Aplica en PLP' },
    isCardBank: { type: 'boolean', title: 'Es Tarjeta Bancaria' },
    installmentType: {
      type: 'string',
      title: 'Tipo de Cuotas',
      enum: ['INTEREST_FREE', 'FIXED', 'WITH_INTEREST'],
    },
    containInteres: { type: 'boolean', title: 'Con Interés (compatibilidad)' },
    interesCoutasFijas: { type: 'number', title: 'Interés Cuotas Fijas' },
    isDestacado: { type: 'boolean', title: 'Destacado' },
    applyByCommercialCondition: { type: 'boolean', title: 'Filtrar por Condición Comercial' },
    displayOrder: { type: 'integer', title: 'Orden de visualización' },
  },
  'v-default-fields': [
    'id', 'description', 'isActive', 'paymentMethods', 'banks', 'bankImages',
    'installments', 'installmentType', 'discountPercentage', 'isReintegro', 'collectionIds',
    'commercialCondition', 'dateFrom', 'dateTo', 'recurrence', 'applyAllProducts',
    'applyByCommercialCondition',
  ],
  'v-indexed': ['isActive', 'displayOrder'],
  'v-immediate-indexing': true,
  'v-cache': false,
}

export async function createInstallmentsInfo(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  const { clients: { installmentsInfo } } = ctx

  try {
    const body = await json(ctx.req)
    const createdRecord = await installmentsInfo.createInstallmentsInfo(body)
    ctx.body = createdRecord
    ctx.status = 200
  } catch (e) {
    const err = e as any
    console.error('[ERROR] Creating installment info:', err)
    const { response } = err
    if (response && response.status === 400) {
      ctx.status = 400
      ctx.body = { reason: response.data }
    } else {
      ctx.status = 500
      ctx.body = { reason: 'Error inesperado al crear.' }
    }
    ctx.vtex.logger.error({ error: e })
  }

  await next()
}

export async function getInstallmentsInfo(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  const { clients: { installmentsInfo } } = ctx

  try {
    const records = await installmentsInfo.getAllInstallmentsInfo()
    ctx.body = (records || []).map(stripSystemFields)
    ctx.status = 200
  } catch (e) {
    ctx.status = 500
    ctx.body = { reason: 'Error inesperado al obtener registros.' }
    ctx.vtex.logger.error({ error: e })
  }

  await next()
}

export async function getInstallmentsInfoById(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  const { clients: { installmentsInfo }, vtex: { route: { params } } } = ctx
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  try {
    const response = await installmentsInfo.getInstallmentById(id)
    if (!response) {
      ctx.status = 404
      ctx.body = { reason: 'No se encontró el registro.' }
      return next()
    }
    ctx.body = response
    ctx.status = 200
  } catch (e) {
    ctx.status = 500
    ctx.body = { reason: 'Error inesperado.' }
  }

  await next()
}

export async function deleteInstallmentsInfo(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  const { clients: { installmentsInfo }, vtex: { route: { params } } } = ctx
  const { id } = params

  try {
    if (!id) {
      ctx.status = 400
      ctx.body = { reason: 'Falta el ID.' }
      return next()
    }
    await installmentsInfo.deleteInstallmentsInfo(id as any)
    ctx.body = { message: 'Eliminado correctamente.' }
    ctx.status = 200
  } catch (e) {
    ctx.status = 500
    ctx.body = { reason: 'Error inesperado al eliminar.' }
    ctx.vtex.logger.error({ error: e })
  }

  await next()
}

export async function updateInstallmentsInfo(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  const body = await json(ctx.req)
  const { clients: { installmentsInfo }, vtex: { route: { params } } } = ctx
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  try {
    if (!id) {
      ctx.status = 400
      ctx.body = { reason: 'Falta el ID.' }
      return next()
    }

    const updateData = Object.keys(body).reduce((acc, key) => {
      if (key !== 'id' && !key.startsWith('_') && body[key] !== null && body[key] !== undefined) {
        acc[key] = body[key]
      }
      return acc
    }, {} as any)

    await installmentsInfo.updateInstallmentsInfo(id, updateData)
    ctx.status = 200
    ctx.body = { message: 'Actualizado correctamente.' }
  } catch (error) {
    const err = error as any
    const { response } = err
    if (response?.status === 400) {
      ctx.status = 400
      ctx.body = { reason: response.data || 'Datos inválidos.' }
    } else if (response?.status === 404) {
      ctx.status = 404
      ctx.body = { reason: 'Registro no encontrado.' }
    } else {
      ctx.status = 500
      ctx.body = { reason: 'Error inesperado al actualizar.' }
    }
    ctx.vtex.logger.error({ message: 'Error en updateInstallmentsInfo', error: err.message, id })
  }

  await next()
}

export async function uploadBankImage(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  try {
    const body = await json(ctx.req) as {
      bankKey: string
      base64: string
      contentType: string
      filename: string
    }

    const { bankKey, base64, contentType, filename } = body

    if (!bankKey || !base64 || !contentType) {
      ctx.status = 400
      ctx.body = { reason: 'Faltan campos: bankKey, base64, contentType.' }
      return next()
    }

    await ctx.clients.vbase.saveJSON(
      VBASE_BUCKET,
      bankKey,
      { base64, contentType, filename: filename || `${bankKey}.png` }
    )

    const url = `/_v/bank-image/${bankKey}`
    ctx.body = { url }
    ctx.status = 200
  } catch (e) {
    console.error('[ERROR] uploadBankImage:', e)
    ctx.status = 500
    ctx.body = { reason: 'Error al subir la imagen.' }
    ctx.vtex.logger.error({ error: e })
  }

  await next()
}

export async function getBankImage(ctx: Context, next: () => Promise<any>) {
  const { vtex: { route: { params } } } = ctx
  const bankKey = Array.isArray(params.bankKey) ? params.bankKey[0] : params.bankKey

  try {
    const imageData = await ctx.clients.vbase.getJSON<{ base64: string; contentType: string }>(
      VBASE_BUCKET,
      bankKey,
      true
    )

    if (!imageData) {
      ctx.status = 404
      ctx.body = 'Imagen no encontrada.'
      return next()
    }

    ctx.set('Content-Type', imageData.contentType)
    ctx.set('Cache-Control', 'public, max-age=86400')
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.body = Buffer.from(imageData.base64, 'base64')
    ctx.status = 200
  } catch (e) {
    console.error('[ERROR] getBankImage:', e)
    ctx.status = 500
    ctx.body = 'Error al obtener la imagen.'
  }

  await next()
}

export async function setupEntitySchema(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  const account = ctx.vtex.account
  const authToken = ctx.vtex.authToken

  try {
    const url = `https://api.vtex.com/${account}/dataentities/InstallmentsInfo/schemas/v1`

    await axios.put(url, ENTITY_SCHEMA, {
      headers: {
        'Content-Type': 'application/json',
        VtexIdclientAutCookie: authToken,
      },
    })

    ctx.body = { message: 'Schema actualizado correctamente.' }
    ctx.status = 200
  } catch (e) {
    const err = e as any
    console.error('[ERROR] setupEntitySchema:', err)
    const { response } = err
    ctx.status = response?.status || 500
    ctx.body = { reason: 'Error al actualizar el schema.', detail: response?.data }
    ctx.vtex.logger.error({ error: e })
  }

  await next()
}

export async function getInstallmentsInfoConfig(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  const { clients: { installmentsInfo } } = ctx

  try {
    const records = await installmentsInfo.getAllInstallmentsInfoConfig()
    ctx.body = records || []
    ctx.status = 200
  } catch (e) {
    ctx.status = 500
    ctx.body = { reason: 'Error al obtener configuración.' }
    ctx.vtex.logger.error({ error: e })
  }

  await next()
}

export async function createInstallmentsInfoConfig(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  const body = await json(ctx.req)
  const { clients: { installmentsInfo } } = ctx

  try {
    const { nombre, porcentaje, plazos, tipo } = body
    if (!nombre || !porcentaje || !plazos || !tipo) {
      ctx.status = 400
      ctx.body = { reason: 'Faltan campos obligatorios.' }
      return next()
    }
    const createdRecord = await installmentsInfo.createInstallmentsInfoConfig({ nombre, porcentaje, plazos, tipo })
    ctx.body = createdRecord
    ctx.status = 200
  } catch (e) {
    ctx.status = 500
    ctx.body = { reason: 'Error al crear configuración.' }
    ctx.vtex.logger.error({ error: e })
  }

  await next()
}

export async function getInstallmentsInfoConfigById(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  const { clients: { installmentsInfo }, vtex: { route: { params } } } = ctx
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  try {
    const response = await installmentsInfo.getInstallmentConfigById(id)
    if (!response) {
      ctx.status = 404
      ctx.body = { reason: 'No se encontró la configuración.' }
      return next()
    }
    ctx.body = response
    ctx.status = 200
  } catch (e) {
    ctx.status = 500
    ctx.body = { reason: 'Error inesperado.' }
  }

  await next()
}

export async function deleteInstallmentsInfoConfig(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  const { clients: { installmentsInfo }, vtex: { route: { params } } } = ctx
  const { id } = params

  try {
    if (!id) {
      ctx.status = 400
      ctx.body = { reason: 'Falta el ID.' }
      return next()
    }
    await installmentsInfo.deleteInstallmentsInfoConfig(id as any)
    ctx.body = { message: 'Configuración eliminada.' }
    ctx.status = 200
  } catch (e) {
    ctx.status = 500
    ctx.body = { reason: 'Error al eliminar.' }
    ctx.vtex.logger.error({ error: e })
  }

  await next()
}

export async function updateInstallmentsInfoConfig(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  const body = await json(ctx.req)
  const { clients: { installmentsInfo }, vtex: { route: { params } } } = ctx
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  try {
    if (!id) {
      ctx.status = 400
      ctx.body = { reason: 'Falta el ID.' }
      return next()
    }
    const updateData = { orderType1: body.orderType1 || null, orderType2: body.orderType2 || null, orderType3: body.orderType3 || null, orderType4: body.orderType4 || null }
    await installmentsInfo.updateInstallmentsInfoConfig(id, updateData)
    ctx.status = 200
  } catch (error) {
    const err = error as any
    ctx.status = 500
    ctx.body = { reason: 'Error al actualizar configuración.' }
    ctx.vtex.logger.error({ message: 'Error en updateInstallmentsInfoConfig', error: err.message, id })
  }

  await next()
}
