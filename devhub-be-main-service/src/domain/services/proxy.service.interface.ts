export interface IProxyService {
  forward(targetUrl: string, req: any, res: any): Promise<void>;
}
