import { Router } from 'express';
import { ProxyService } from '../../infrastructure/services/proxy.service';
import { ServiceConfig } from '../../infrastructure/config/service.config';

export class TodoRoutes {
  public router: Router;
  private proxyService: ProxyService;

  constructor() {
    this.router = Router();
    this.proxyService = new ProxyService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get all todos
    this.router.get('/', (req, res) => {
      const targetUrl = `${ServiceConfig.TODO_SERVICE_URL}/todos${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Get todo stats
    this.router.get('/stats', (req, res) => {
      const targetUrl = `${ServiceConfig.TODO_SERVICE_URL}/todos/stats${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Get single todo
    this.router.get('/:id', (req, res) => {
      const targetUrl = `${ServiceConfig.TODO_SERVICE_URL}/todos/${req.params.id}${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Create todo
    this.router.post('/', (req, res) => {
      const targetUrl = `${ServiceConfig.TODO_SERVICE_URL}/todos`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Update todo
    this.router.put('/:id', (req, res) => {
      const targetUrl = `${ServiceConfig.TODO_SERVICE_URL}/todos/${req.params.id}${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Delete todo
    this.router.delete('/:id', (req, res) => {
      const targetUrl = `${ServiceConfig.TODO_SERVICE_URL}/todos/${req.params.id}${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });
  }

  private buildQueryString(req: any): string {
    const queryString = new URLSearchParams(req.query).toString();
    return queryString ? `?${queryString}` : '';
  }
}
