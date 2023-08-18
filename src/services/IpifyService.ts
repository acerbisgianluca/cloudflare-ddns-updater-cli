import axios from 'axios';

interface IpResponse {
    ip: string;
}

const client = axios.create({
    baseURL: 'https://api64.ipify.org',
});

export async function getClientIpAddress(): Promise<string> {
    const result = await client.get<IpResponse>('/', {
        params: {
            format: 'json',
        },
    });

    return result.data.ip;
}
