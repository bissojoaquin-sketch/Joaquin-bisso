import { IOClients, VBase } from '@vtex/api'

import InstallmentsInfo from './installmentsInfo'

export class Clients extends IOClients {
  public get installmentsInfo() {
    return this.getOrSet('installmentsInfo', InstallmentsInfo)
  }

  public get vbase() {
    return this.getOrSet('vbase', VBase)
  }
}
