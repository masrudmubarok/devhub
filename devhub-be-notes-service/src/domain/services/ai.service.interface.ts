export interface IAiService {
  enhanceNote(action: string, content: string): Promise<string>;
  generateTags(content: string): Promise<string[]>;
}
