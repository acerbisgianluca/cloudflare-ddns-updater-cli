import axios from 'axios';

interface Response<T> {
    success: boolean;
    errors: Array<{
        code: number;
        message: string;
    }>;
    result: T;
}

export interface Token {
    id: string;
    status: 'active' | 'disabled' | 'expired';
}

export interface Zone {
    id: string;
    name: string;
}

export interface Record {
    id: string;
    name: string;
    type: string;
    content: string;
}

export type PatchRecordBody = Omit<Record, 'id'>;

export class CloudflareService {
    private readonly client;

    constructor(token: string) {
        this.client = axios.create({
            baseURL: 'https://api.cloudflare.com/client/v4',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    public async verifyToken(): Promise<Token> {
        const response = await this.client.get<Response<Token>>('/user/tokens/verify');

        return response.data.result;
    }

    public async listZones({ name }: Partial<{ name: string }>): Promise<Zone[]> {
        const response = await this.client.get<Response<Zone[]>>('/zones', {
            params: {
                name,
            },
        });

        return response.data.result;
    }

    public async getZone(zoneId: string): Promise<Zone> {
        const response = await this.client.get<Response<Zone>>(`/zones/${zoneId}`);

        return response.data.result;
    }

    public async listDnsRecords(zoneId: string): Promise<Record[]> {
        const response = await this.client.get<Response<Record[]>>(`/zones/${zoneId}/dns_records`);

        return response.data.result;
    }

    public async patchDnsRecord(
        zoneId: string,
        recordId: string,
        record: PatchRecordBody,
    ): Promise<Record> {
        const response = await this.client.patch<Response<Record>>(
            `/zones/${zoneId}/dns_records/${recordId}`,
            record,
        );

        return response.data.result;
    }
}
