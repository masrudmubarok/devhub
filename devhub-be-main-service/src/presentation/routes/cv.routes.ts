import { Router } from 'express';
import { ProxyService } from '../../infrastructure/services/proxy.service';
import { ServiceConfig } from '../../infrastructure/config/service.config';

export class CvRoutes {
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
      const targetUrl = `${ServiceConfig.CV_SERVICE_URL}/api/cv/ai-enhance`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Get all CVs
    this.router.get('/', (req, res) => {
      const targetUrl = `${ServiceConfig.CV_SERVICE_URL}/api/cv${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Get single CV
    this.router.get('/:id', (req, res) => {
      const targetUrl = `${ServiceConfig.CV_SERVICE_URL}/api/cv/${req.params.id}${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Create CV
    this.router.post('/', (req, res) => {
      const targetUrl = `${ServiceConfig.CV_SERVICE_URL}/api/cv`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Update CV
    this.router.put('/:id', (req, res) => {
      const targetUrl = `${ServiceConfig.CV_SERVICE_URL}/api/cv/${req.params.id}${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // Delete CV
    this.router.delete('/:id', (req, res) => {
      const targetUrl = `${ServiceConfig.CV_SERVICE_URL}/api/cv/${req.params.id}${this.buildQueryString(req)}`;
      this.proxyService.forward(targetUrl, req, res);
    });

    // CV sub-resources
    this.router.post('/:id/experiences', (req, res) => {
      const targetUrl = `${ServiceConfig.CV_SERVICE_URL}/api/cv/${req.params.id}/experiences`;
      this.proxyService.forward(targetUrl, req, res);
    });

    this.router.post('/:id/education', (req, res) => {
      const targetUrl = `${ServiceConfig.CV_SERVICE_URL}/api/cv/${req.params.id}/education`;
      this.proxyService.forward(targetUrl, req, res);
    });

    this.router.post('/:id/skills', (req, res) => {
      const targetUrl = `${ServiceConfig.CV_SERVICE_URL}/api/cv/${req.params.id}/skills`;
      this.proxyService.forward(targetUrl, req, res);
    });

    this.router.post('/:id/projects', (req, res) => {
      const targetUrl = `${ServiceConfig.CV_SERVICE_URL}/api/cv/${req.params.id}/projects`;
      this.proxyService.forward(targetUrl, req, res);
    });
  }

  private buildQueryString(req: any): string {
    const queryString = new URLSearchParams(req.query).toString();
    return queryString ? `?${queryString}` : '';
  }
}
