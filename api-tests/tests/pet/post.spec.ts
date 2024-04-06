import {test, expect} from '@playwright/test';
import PetAPI from './api-util';


test.describe('Tests POST request for API /pet', () => {
        let client: PetAPI;

        test.beforeAll(async () => {
            client = new PetAPI();
        });

        test('Create pet with valid payload - 200 Success', {tag: '@smoke'}, async () => {
            const data = client.getPayloadData(
                null,
                {id: 1, name: 'Monkey'},
                "Orangutango",
                ["https://www.example.com/orangutango.jpg"],
                [{id: 1, name: 'tag1'}],
                "available"
            );
            const response = await client.createUpdatePet(data);
            expect(response.status).toBe(200);

            // Remove ID from response & data for comparison
            const {id, ...responseDataWithoutId} = response.data;
            delete data.id;
            expect(responseDataWithoutId).toEqual(data);
            expect(response.data).toHaveProperty('id');
            expect(typeof response.data.id).toBe('number');
        });

        test('Create pet with null values for optional fields - 200 Success', {tag: '@smoke'}, async () => {
            const data = client.getPayloadData(
                // Assuming id, photoUrls and tags are optional
                null,
                {id: 2, name: 'Pokemon'},
                "Pikachu",
                null,
                null,
                "sold"
            );
            const response = await client.createUpdatePet(data);
            expect(response.status).toBe(200);

            expect(response.data).toHaveProperty('id');
            expect(typeof response.data.id).toBe('number');

            expect(response.data).toHaveProperty('category');
            expect(typeof response.data.category).toBe('object');
            expect(response.data.category).toEqual(data.category);

            expect(response.data).toHaveProperty('name');
            expect(response.data.name).toEqual(data.name);

            expect(response.data).toHaveProperty('status');
            expect(response.data.status).toEqual(data.status);
        });

        test('Create pet without optional fields - 200 Success', {tag: '@smoke'}, async () => {
            // Assuming id, photoUrls, tags are optional
            const data = client.getPayloadData(
                null,
                {id: 3, name: 'Digimon'},
                "Hackathon",
                null,
                null,
                "pending",
                true // Deletes fields with null values
            );
            const response = await client.createUpdatePet(data);
            expect(response.status).toBe(200);

            expect(response.data).toHaveProperty('id');
            expect(typeof response.data.id).toBe('number');

            expect(response.data).toHaveProperty('category');
            expect(typeof response.data.category).toBe('object');
            expect(response.data.category).toEqual(data.category);

            expect(response.data).toHaveProperty('name');
            expect(response.data.name).toEqual(data.name);

            expect(response.data).toHaveProperty('status');
            expect(response.data.status).toEqual(data.status);
        });

        test('Create pet with non-English values - 200 Success', {tag: '@smoke'}, async () => {
            const data = client.getPayloadData(
                null,
                {id: 7, name: '猫'},
                "サイデン",
                null,
                null,
                "sold"
            );
            const response = await client.createUpdatePet(data);
            expect(response.status).toBe(200);

            expect(response.data).toHaveProperty('id');
            expect(typeof response.data.id).toBe('number');

            expect(response.data).toHaveProperty('category');
            expect(typeof response.data.category).toBe('object');
            expect(response.data.category).toEqual(data.category);

            expect(response.data).toHaveProperty('name');
            expect(response.data.name).toEqual(data.name);
        });

        test('Create pet with multiple tags - 200 Success', {tag: '@smoke'}, async () => {
            const data = client.getPayloadData(
                null,
                {id: 7, name: 'Dragons'},
                "Vhagar",
                null,
                [{id: 1, name: 'Lizards'}, {id: 1, name: 'Reptiles'}, {id: 2, name: 'Wings'}],
                "sold"
            );
            const response = await client.createUpdatePet(data);
            expect(response.status).toBe(200);

            expect(response.data.tags).toEqual(data.tags);
            expect(Array.isArray(response.data.tags)).toBe(true);
            expect(response.data.tags.length).toBe(data.tags.length);
        });

        test('Create pet and get its data - 200 Success', {tag: '@smoke'}, async () => {
            const data = client.getPayloadData(
                null,
                {id: 4, name: 'Dragons'},
                "Dracarys",
                ["https://www.example.com/dracarys.png"],
                [{id: 1, name: 'Lizard'}],
                "available"
            );
            const postResponse = await client.createUpdatePet(data);
            expect(postResponse.status).toBe(200);
            expect(postResponse.data).toHaveProperty('id');

            const getResponse = await client.getPetById(postResponse.data.id);
            expect(getResponse.status).toBe(200);
            expect(getResponse.data).toHaveProperty('id');
            expect(getResponse.data.id).toEqual(postResponse.data.id);

            // Add response ID to data for comparison
            data.id = postResponse.data.id;
            expect(getResponse.data).toEqual(data);
            expect(getResponse.data).toEqual(postResponse.data);
        });

        test('Update existing pet - 200 Success', {tag: '@smoke'}, async () => {
            // Assuming pet with ID 7 exists
            const data = client.getPayloadData(
                30,
                {id: 1, name: 'Monkey'},
                "Gorilla",
                ["https://www.example.com/gorilla.jpg"],
                [{id: 1, name: 'tag1'}],
                "pending"
            );
            const postResponse = await client.createUpdatePet(data);
            expect(postResponse.status).toBe(200);
            expect(postResponse.data.id).toEqual(data.id);
            expect(postResponse.data).toEqual(data);
        });

        test('Update pet and get its data - 200 Success', {tag: '@smoke'}, async () => {
            const data = client.getPayloadData(
                32,
                {id: 2, name: 'Dragons'},
                "Dracarys",
                ["https://www.example.com/dracarys.png"],
                [{id: 1, name: 'Lizard'}],
                "available"
            );
            const postResponse = await client.createUpdatePet(data);
            expect(postResponse.status).toBe(200);
            expect(postResponse.data.id).toEqual(data.id);

            const getResponse = await client.getPetById(postResponse.data.id);
            expect(getResponse.status).toBe(200);

            expect(getResponse.data.status).toEqual(data.status);
            expect(getResponse.data.name).toEqual(data.name);
        });

        test('Create pet with invalid "status" value - 400 Bad Request', async () => {
            // Assuming status is mandatory since it's a pet store
            const data = client.getPayloadData(
                null,
                {id: 4, name: 'Cars'},
                "Mercedes",
                null,
                null,
                "invalidStatusValue"
            );
            const response = await client.createUpdatePet(data);
            expect(response.status).toBe(400);
        });

        test('Get method is not accepted - 405 Not Supported', async () => {
        const response = await client.getPetById('');
        expect(response.status).toBe(405);
    });
    }
)
