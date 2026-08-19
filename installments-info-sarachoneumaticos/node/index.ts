import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
import {
  getInstallmentsInfo,
  createInstallmentsInfo,
  updateInstallmentsInfo,
  deleteInstallmentsInfo,
  getInstallmentsInfoById,
  getInstallmentsInfoConfig,
  createInstallmentsInfoConfig,
  getInstallmentsInfoConfigById,
  deleteInstallmentsInfoConfig,
  updateInstallmentsInfoConfig,
  uploadBankImage,
  getBankImage,
  setupEntitySchema,
} from './middlewares/installmentsInfo'

const TIMEOUT_MS = 800

const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    code: number
  }
}

export default new Service({
  clients,
  routes: {
    installmentsInfo: method({
      GET: [getInstallmentsInfo],
      POST: [createInstallmentsInfo],
    }),
    installmentsInfoById: method({
      GET: [getInstallmentsInfoById],
      DELETE: [deleteInstallmentsInfo],
      PATCH: [updateInstallmentsInfo],
    }),
    installmentsInfoConfig: method({
      GET: [getInstallmentsInfoConfig],
      POST: [createInstallmentsInfoConfig],
    }),
    installmentsInfoConfigById: method({
      GET: [getInstallmentsInfoConfigById],
      DELETE: [deleteInstallmentsInfoConfig],
      PATCH: [updateInstallmentsInfoConfig],
    }),
    uploadBankImage: method({
      POST: [uploadBankImage],
    }),
    getBankImage: method({
      GET: [getBankImage],
    }),
    setupEntitySchema: method({
      POST: [setupEntitySchema],
    }),
  },
})
