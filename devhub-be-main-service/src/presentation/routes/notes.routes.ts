import { Router } from 'express';
import { ProxyService } from '../../infrastructure/services/proxy.service';
import { ServiceConfig } from '../../infrastructure/config/service.config';

export class NotesRoutes {
  public router: Router;
  private proxyService: ProxyService;

  constructor() {
    this.router = Router();
    this.proxyService = new ProxyService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // AI enhance
    this.router.post('/ai-enhance', (req, res) => {
      const targetUrl = `${ServiceConfig.NOTES_SERVICE_URL}/notes/ai-enhance`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Search notes
    this.router.get('/search', (req, res) => {
      const targetUrl = `${ServiceConfig.NOTES_SERVICE_URL}/notes/search${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Get all notes
    this.router.get('/', (req, res) => {
      const targetUrl = `${ServiceConfig.NOTES_SERVICE_URL}/notes${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Get single note
    this.router.get('/:id', (req, res) => {
      const targetUrl = `${ServiceConfig.NOTES_SERVICE_URL}/notes/${req.params.id}${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Create note
    this.router.post('/', (req, res) => {
      const targetUrl = `${ServiceConfig.NOTES_SERVICE_URL}/notes`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Update note
    this.router.put('/:id', (req, res) => {
      const targetUrl = `${ServiceConfig.NOTES_SERVICE_URL}/notes/${req.params.id}${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Delete note
    this.router.delete('/:id', (req, res) => {
      const targetUrl = `${ServiceConfig.NOTES_SERVICE_URL}/notes/${req.params.id}${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });
  }

  private buildQueryString(req: any): string {
    const queryString = new URLSearchParams(req.query).toString();
    return queryString ? `?${queryString}` : '';
  }
}
