module.exports = {
    testEnvironment: 'jsdom', // Simulates a browser-like environment
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Setup file for custom configurations
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
        '\\.(jpg|jpeg|png|gif|mp4|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock static assets
    },
};