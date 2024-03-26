import { AxiosResponse } from 'axios';
import Client from '../../client/axios-client';

class PetAPI extends Client {
    /**
     * Utility class for interacting with API /pet/* endpoints.
     * It can be build dynamic payloads and inherits Client class to perform HTTP requests.
     */
    async getPetById(id: string | number): Promise<AxiosResponse> {
        return this.getRequest(`/v2/pet/${id}`);
    }

    async createUpdatePet(data: object): Promise<AxiosResponse> {
        // If data.id exists and not null, API will update existing pet, otherwise create a new one
        return this.postRequest('/v2/pet', data);
    }

    getPayloadData(id: any, category: any, name: any, photoUrls: any, tags: any, status: any, clearNull = false) {
        // Properties with null values will be filtered out
        const data = { id, category, name, photoUrls, tags, status };
        if (clearNull) {
            Object.keys(data).forEach((key) => (!data[key]) && delete data[key]);
        }
        return data;
    }
}

export default PetAPI;
