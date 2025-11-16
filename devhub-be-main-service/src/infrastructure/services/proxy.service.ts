import axios, { AxiosInstance } from 'axios';
import { IProxyService } from '../../domain/services/proxy.service.interface';

export class ProxyService implements IProxyService {
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      timeout: 30000,
      validateStatus: () => true, // Don't throw on any status
    });
  }

  async forward(targetUrl: string, req: any, res: any): Promise<void> {
    try {
      const response = await this.httpClient({
        method: req.method,
        url: targetUrl,
        data: req.body,
        params: req.query,
        headers: {
          ...req.headers,
          host: new URL(targetUrl).host,
        },
      });

      // Forward status and headers
      res.status(response.status);
      
      // Forward relevant headers
      const headersToForward = ['content-type', 'content-length'];
      headersToForward.forEach(header => {
        if (response.headers[header]) {
          res.set(header, response.headers[header]);
        }
      });

      // Send response
      res.send(response.data);
    } catch (error: any) {
      console.error(`Proxy error to ${targetUrl}:`, error.message);
      res.status(503).json({
        error: 'Service Unavailable',
        message: 'The requested service is temporarily unavailable',
      });
    }
  }
}
