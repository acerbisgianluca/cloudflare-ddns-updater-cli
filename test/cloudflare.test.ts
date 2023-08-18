import 'dotenv/config';
import { CloudflareService } from '../src/services/CloudflareService';

const cloudflareService = new CloudflareService(process.env.CF_API_TOKEN as string);

describe('Verify API token', () => {
    test('throws on invalid token', async () => {
        const invalidCloudflareService = new CloudflareService('asdf');

        await expect(invalidCloudflareService.verifyToken()).rejects.toThrow();
    });

    test('is active', async () => {
        const tokenStatus = await cloudflareService.verifyToken();

        expect(tokenStatus.status).toBe('active');
    });
});
