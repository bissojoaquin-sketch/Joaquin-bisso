import type { InstanceOptions, IOContext } from '@vtex/api'
import { MasterData } from '@vtex/api'

const DATA_ENTITY = 'InstallmentsInfo'
const DATA_ENTITY_CONFIG = 'InstallmentsInfoConfiguration'
const SCHEMA_VERSION = 'v1'

export default class InstallmentsInfoClient extends MasterData {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, options)
  }

  public async getAllInstallmentsInfo(): Promise<any> {
    try {
      const pageSize = 100;
      let page = 1;
      let all: any[] = [];

      while (true) {
        const response = await this.searchDocuments<any>({
          dataEntity: DATA_ENTITY,
          fields: ['_all'],
          pagination: { page, pageSize },
          sort: 'createdIn DESC',
        });

        const batch = Array.isArray(response) ? response : [];
        all = all.concat(batch);

        if (batch.length < pageSize) break;
        page++;
      }

      return all;
    } catch (e) {
      console.error('[ERROR] getAllInstallmentsInfo failed:', e);
      return [];
    }
  }

  public async getInstallmentById(id: string): Promise<any> {
    try {
      const response = await this.getDocument({
        dataEntity: DATA_ENTITY,
        id,
        fields: ['_all']
      });

      return response;
    } catch (e) {
      console.error(`[ERROR] Fetching Installment by ID (${id}):`, e);
      throw e;
    }
  }

  public async createInstallmentsInfo(body: any): Promise<any> {
    try {
      const cleanedBody = Object.keys(body).reduce((acc, key) => {
        if (body[key] !== null && body[key] !== undefined && body[key] !== '') {
          acc[key] = body[key];
        }
        return acc;
      }, {} as any);

      const response = await this.createDocument({
        dataEntity: DATA_ENTITY,
        fields: cleanedBody,
        schema: SCHEMA_VERSION,
      });

      return response;
    } catch (e) {
      console.error('[ERROR] Creating Installments Info:', e);
      throw e;
    }
  }

  public async deleteInstallmentsInfo(id: string): Promise<any> {
    try {
      const response = await this.deleteDocument({
        dataEntity: DATA_ENTITY,
        id
      });

      return response;
    } catch (e) {
      console.error('[ERROR] Deleting Installments Info:', e);
      throw e;
    }
  }

  public async updateInstallmentsInfo(id: string, body: any): Promise<any> {
    try {
      const response = await this.updatePartialDocument({
        dataEntity: DATA_ENTITY,
        id,
        fields: body,
        schema: SCHEMA_VERSION,
      });

      return response;
    } catch (e) {
      console.error('[ERROR] Updating Installments Info:', e);
      throw e;
    }
  }

  public async getAllInstallmentsInfoConfig(): Promise<any> {
    try {
      const pageSize = 100;
      let page = 1;
      let all: any[] = [];

      while (true) {
        const response = await this.searchDocuments<any>({
          dataEntity: DATA_ENTITY_CONFIG,
          fields: ['_all'],
          pagination: { page, pageSize },
          schema: SCHEMA_VERSION
        });

        const batch = Array.isArray(response) ? response : [];
        all = all.concat(batch);

        if (batch.length < pageSize) break;
        page++;
      }

      return all;
    } catch (e) {
      console.error('[ERROR] Fetching Installments Info Config:', e);
      throw e;
    }
  }

  public async createInstallmentsInfoConfig(body: any): Promise<any> {
    try {
      const response = await this.createDocument({
        dataEntity: DATA_ENTITY_CONFIG,
        fields: body,
        schema: SCHEMA_VERSION
      });

      return response;
    } catch (e) {
      console.error('[ERROR] Creating Installments Info Config:', e);
      throw e;
    }
  }

  public async getInstallmentConfigById(id: string): Promise<any> {
    try {
      const response = await this.getDocument({
        dataEntity: DATA_ENTITY_CONFIG,
        id,
        fields: ['_all']
      });

      return response;
    } catch (e) {
      console.error(`[ERROR] Fetching Installment Config by ID (${id}):`, e);
      throw e;
    }
  }

  public async deleteInstallmentsInfoConfig(id: string): Promise<any> {
    try {
      const response = await this.deleteDocument({
        dataEntity: DATA_ENTITY_CONFIG,
        id
      });

      return response;
    } catch (e) {
      console.error('[ERROR] Deleting Installments Info Config:', e);
      throw e;
    }
  }

  public async updateInstallmentsInfoConfig(id: string, body: any): Promise<any> {
    try {
      const response = await this.updatePartialDocument({
        dataEntity: DATA_ENTITY_CONFIG,
        id,
        fields: body,
        schema: SCHEMA_VERSION
      });

      return response;
    } catch (e) {
      console.error('[ERROR] Updating Installments Info Config:', e);
      throw e;
    }
  }
}
