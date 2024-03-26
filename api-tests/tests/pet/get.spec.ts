import {test, expect} from '@playwright/test';
import {XMLParser} from 'fast-xml-parser';
import {PET_STATUSES} from '../../support/constants';
import PetAPI from './api-util';


test.describe('Tests GET request for API /pet/{id}', () => {
        let client: PetAPI;

        test.beforeAll(async () => {
            client = new PetAPI();
        });

        test('Get existing pet by id - 200 Success', {tag: '@smoke'}, async () => {
            const validPetId = 7;
            const response = await client.getPetById(validPetId);
            expect(response.status).toBe(200);
            expect(response.headers["content-type"]).toContain('application/json');

            expect(response.data).toHaveProperty('id');
            expect(typeof response.data.id).toBe('number');
            expect(response.data.id).toEqual(validPetId);

            expect(response.data).toHaveProperty('category');
            expect(typeof response.data.category).toBe('object');

            expect(response.data).toHaveProperty('name');
            expect(typeof response.data.name).toBe('string');

            expect(response.data).toHaveProperty('photoUrls');
            expect(Array.isArray(response.data.photoUrls)).toBe(true);

            expect(response.data).toHaveProperty('tags');
            expect(Array.isArray(response.data.tags)).toBe(true);

            expect(response.data).toHaveProperty('status');
            expect(Array.isArray(response.data.tags)).toBe(true);
            expect(PET_STATUSES).toContain(response.data.status);
        });

        test('Get by ID response time is less than 2 seconds', {tag: '@smoke'}, async () => {
            const startTime = Date.now();
            await client.getPetById(5);
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            expect(responseTime).toBeLessThan(2000);
        });

        test('Get pet by ID with Accept XML header - XML response data', {tag: '@smoke'}, async () => {
            try {
                client.updateSessionHeader('Accept', 'application/xml');
                const validPetId = 5;
                const response = await client.getPetById(validPetId);
                expect(response.status).toBe(200);
                expect(response.headers["content-type"]).toContain('application/xml');

                // If XML response parsed, it means its valid XML
                const xmlParser = new XMLParser();
                const responseData = xmlParser.parse(response.data).Pet;
                expect(responseData).toHaveProperty('id');
                expect(responseData.id).toBe(validPetId);
            } finally {
                // Resetting Accept header to default in case not running in parallel
                client.updateSessionHeader('Accept', 'application/json');
            }
        });

        test('Get pets by different IDs - Ensure data distinction', {tag: '@smoke'}, async () => {
            // Assuming both petIds exists and have different data
            const petId1 = 7;
            const petId2 = 6;
            const response1 = await client.getPetById(petId1);
            expect(response1.status).toBe(200);

            const response2 = await client.getPetById(petId2);
            expect(response2.status).toBe(200);
            expect(response1.data).not.toEqual(response2.data);
        });

        test('Get pet by not exists id - 404 Not Found', {tag: '@smoke'}, async () => {
            // Assuming this ID does not exist
            const notExistsPetId = 9999999999;
            const response = await client.getPetById(notExistsPetId);
            expect(response.status).toBe(404);
            expect(response.data.type).toBe("error");
            expect(response.data.message).toBe("Pet not found");
        });

        test('Get pet without specifying ID - 405 Not Supported', async () => {
            const response = await client.getPetById('');
            expect(response.status).toBe(405);
        });

        test('Get pet by invalid id value - 400 Bad Request', async () => {
            const invalidPetId = 'inv@l!dPetId'
            const response = await client.getPetById(invalidPetId);
            // Expecting 400 as ID should be a number
            expect(response.status).toBe(400);
            expect(response.data.type).toBe("error");
            expect(response.data.message).toBe("Invalid ID supplied");
        });
    }
)

