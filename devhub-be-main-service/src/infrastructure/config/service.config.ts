export class ServiceConfig {
  static readonly TODO_SERVICE_URL = process.env.TODO_SERVICE_URL || 'http://localhost:3001';
  static readonly NOTES_SERVICE_URL = process.env.NOTES_SERVICE_URL || 'http://localhost:3002';
  static readonly CV_SERVICE_URL = process.env.CV_SERVICE_URL || 'http://localhost:3003';
  static readonly AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
}
