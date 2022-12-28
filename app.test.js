const request = require('supertest')
const app = require('./app')
const userController = require('./controllers/user')

describe('Test Users Routes', () => {
    test('Testing Register', async () => {


        const req = {
            body: {
                profilePic: {
                    fileName: "user.png",
                    url: "http://localhost:3000/uploads/users/user.png",
                },
                userdata: {
                    fullName: 'John Doe',
                    email: 'john.doe@example.com',
                    password: 'password123',
                    phoneNumber: 1234567890,
                    date_of_birth: '1995-01-01',
                    university: 'Example University',
                    faculty: 'Example Faculty',
                    department: 'Example Department',
                    scientific_title: 'Doctor',
                    bio: 'I am a test user.',
                },
            },
        }

        const res = {
            statusMessage: 'OK',
            statusCode: 200,
            send: jest.fn(),
        }

        await userController.createUser(req, res)

    })
})
