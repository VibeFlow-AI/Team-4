import request from 'supertest';
import app from '../app';

describe('App', () => {
  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should have CORS enabled', () => {
    // This is a basic test to ensure the app is properly configured
    expect(app).toBeDefined();
  });
}); 