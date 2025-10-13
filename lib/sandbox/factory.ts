import { SandboxProvider, SandboxProviderConfig } from './types';
import { E2BProvider } from './providers/e2b-provider';
import { VercelProvider } from './providers/vercel-provider';

export class SandboxFactory {
  static create(provider?: string, config?: SandboxProviderConfig): SandboxProvider {
    // Use environment variable if provider not specified, default to E2B
    const selectedProvider = provider || process.env.SANDBOX_PROVIDER || 'e2b';
    
    console.log('[SandboxFactory] Creating provider:', selectedProvider);
    console.log('[SandboxFactory] Available providers:', this.getAvailableProviders());
    console.log('[SandboxFactory] Provider availability check:', {
      e2b: this.isProviderAvailable('e2b'),
      vercel: this.isProviderAvailable('vercel')
    });
    
    switch (selectedProvider.toLowerCase()) {
      case 'e2b':
        if (!this.isProviderAvailable('e2b')) {
          throw new Error('E2B provider is not available. Please check E2B_API_KEY environment variable.');
        }
        return new E2BProvider(config || {});
      
      case 'vercel':
        if (!this.isProviderAvailable('vercel')) {
          throw new Error('Vercel provider is not available. Please check Vercel configuration.');
        }
        return new VercelProvider(config || {});
      
      default:
        throw new Error(`Unknown sandbox provider: ${selectedProvider}. Supported providers: e2b, vercel`);
    }
  }
  
  static getAvailableProviders(): string[] {
    return ['e2b', 'vercel'];
  }
  
  static isProviderAvailable(provider: string): boolean {
    switch (provider.toLowerCase()) {
      case 'e2b':
        return !!process.env.E2B_API_KEY;
      
      case 'vercel':
        // Vercel can use OIDC (automatic) or PAT
        return !!process.env.VERCEL_OIDC_TOKEN || 
               (!!process.env.VERCEL_TOKEN && !!process.env.VERCEL_TEAM_ID && !!process.env.VERCEL_PROJECT_ID);
      
      default:
        return false;
    }
  }
}