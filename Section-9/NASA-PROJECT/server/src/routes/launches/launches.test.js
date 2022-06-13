const request = require('supertest');
const app = require('../../app');
describe('Test GET /launches', ()=>{
    test('It should respond with 200 success', async ()=>{
        const response = await request(app)
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    })
});

describe('Test POST /launch', ()=>{
    const completeLaunchDate = {
        mission: "USS",
        rocket: "ASD-123 F",
        target: "Test Star",
        launchDate: 'Jan 14, 2055'
    };
    const launchWithoutDate = {
        mission: "USS",
        rocket: "ASD-123 F",
        target: "Test Star",
    };

    const launchDataWithInvalidDate = {
        mission: "USS",
        rocket: "ASD-123 F",
        target: "Test Star",
        launchDate: "hello",
    };

    test('It should respond with 200 success', async ()=>{
        const response = await request(app)
        .post('/launches')
        .send(completeLaunchDate)
        .expect('Content-Type', /json/)
        .expect(201);
    
        const requestDate = new Date(completeLaunchDate.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(requestDate === responseDate);
        expect(response.body).toMatchObject(launchWithoutDate)
    })

    test('It should catch missing required properties', async ()=>{
            const response = await request(app)
            .post('/launches')
            .send(launchWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch property'
        });
        })
    
    test('It should catch invalid date', async ()=>{
        const response = await request(app)
        .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);
    
    expect(response.body).toStrictEqual({
        error: 'Invalid launch date'
    })
    });
});

describe('Test DELETE /launches/id', ()=>{
    const testLaunchId = 101;
    const inValidLaunchId = 567;
    test("It should respond with 200 success", async ()=>{
        const response = await request(app)
        .delete(`/launches/${testLaunchId}`)
        .expect('Content-Type', /json/)
        .expect(200);
    })
    test("It should catch launch was not found", async()=>{
        const response = await request(app)
        .delete(`/launches/${inValidLaunchId}`)
        .expect('Content-Type', /json/)
        .expect(404);
    expect(response.body).toStrictEqual({
        error: 'Launch not found',
    });
    });
})