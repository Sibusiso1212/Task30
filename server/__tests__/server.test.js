const request = require('supertest');
const express = require('express');
const axios = require('axios');
const app = require('../server');

// Mock axios
jest.mock('axios');

describe('GitHub API Integration', () => {
    // Test user search endpoint
    test('GET /api/search/users/:query returns user data', async () => {
        const mockData = {
            data: {
                items: [
                    { id: 1, login: 'user1' },
                    { id: 2, login: 'user2' }
                ]
            }
        };

        axios.get.mockResolvedValueOnce(mockData);

        const response = await request(app)
            .get('/api/search/users/test')
            .expect(200);

        expect(response.body.items).toHaveLength(2);
        expect(response.body.items[0].login).toBe('user1');
    });

    // Test user details endpoint
    test('GET /api/users/:username returns user and repo data', async () => {
        const mockUserData = {
            data: {
                login: 'testuser',
                name: 'Test User'
            }
        };

        const mockRepoData = {
            data: [
                {
                    id: 1,
                    name: 'repo1',
                    description: 'Test repo'
                }
            ]
        };

        axios.get
            .mockResolvedValueOnce(mockUserData)
            .mockResolvedValueOnce(mockRepoData);

        const response = await request(app)
            .get('/api/users/testuser')
            .expect(200);

        expect(response.body.user.login).toBe('testuser');
        expect(response.body.repos).toHaveLength(1);
    });

    // Test error handling
    test('handles API errors gracefully', async () => {
        axios.get.mockRejectedValueOnce(new Error('API Error'));

        const response = await request(app)
            .get('/api/search/users/test')
            .expect(500);

        expect(response.body.error).toBeTruthy();
    });
});
