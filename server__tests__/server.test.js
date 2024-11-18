// Import required testing and application dependencies
const request = require('supertest');
const express = require('express');
const axios = require('axios');
const app = require('../server');

// Configure Jest to mock all axios HTTP requests
jest.mock('axios');

describe('GitHub API Integration', () => {
    // Test Suite for GitHub API endpoints
    
    // Test Case 1: User Search Functionality
    test('GET /api/search/users/:query returns user data', async () => {
        // Mock data to simulate GitHub API response
        const mockData = {
            data: {
                items: [
                    { id: 1, login: 'user1' },
                    { id: 2, login: 'user2' }
                ]
            }
        };

        // Configure mock to return our test data
        axios.get.mockResolvedValueOnce(mockData);

        // Make request to our endpoint and verify response
        const response = await request(app)
            .get('/api/search/users/test')
            .expect(200);

        // Assertions to validate response structure
        expect(response.body.items).toHaveLength(2);
        expect(response.body.items[0].login).toBe('user1');
    });

    // Test Case 2: User Details and Repositories
    test('GET /api/users/:username returns user and repo data', async () => {
        // Mock user profile data
        const mockUserData = {
            data: {
                login: 'testuser',
                name: 'Test User'
            }
        };

        // Mock repository data
        const mockRepoData = {
            data: [
                {
                    id: 1,
                    name: 'repo1',
                    description: 'Test repo'
                }
            ]
        };

        // Configure mock for both API calls (user data and repos)
        axios.get
            .mockResolvedValueOnce(mockUserData)
            .mockResolvedValueOnce(mockRepoData);

        // Make request and verify response
        const response = await request(app)
            .get('/api/users/testuser')
            .expect(200);

        // Validate both user and repository data
        expect(response.body.user.login).toBe('testuser');
        expect(response.body.repos).toHaveLength(1);
    });

    // Test Case 3: Error Handling
    test('handles API errors gracefully', async () => {
        // Simulate API failure
        axios.get.mockRejectedValueOnce(new Error('API Error'));

        // Verify error handling behavior
        const response = await request(app)
            .get('/api/search/users/test')
            .expect(500);

        // Confirm error message is present
        expect(response.body.error).toBeTruthy();
    });
});
