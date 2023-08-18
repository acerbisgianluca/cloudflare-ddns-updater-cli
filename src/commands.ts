import { Command, Option } from '@commander-js/extra-typings';
import packageJson from '../package.json';
import { CloudflareService, Zone, Record, PatchRecordBody } from './services/CloudflareService';
import { isAxiosError } from 'axios';
import * as IpifyService from './services/IpifyService';

export const program = new Command();

program
    .name(packageJson.name)
    .description(packageJson.description)
    .version(packageJson.version)
    .showHelpAfterError();

const zoneIdOption = new Option(
    '-i, --zone-id <zoneId>',
    'Zone ID. Required if `--zone-name` is not provided',
)
    .env('CF_ZONE_ID')
    .conflicts('zoneName');
const zoneNameOption = new Option(
    '-n, --zone-name <zoneName>',
    'Zone Name, such as `domain.com`. Required if `--zone-id` is not provided',
).env('CF_ZONE_NAME');
const recordNameOption = new Option(
    '-r, --record-name <recordName>',
    'Record Name, such as `home.domain.com`',
)
    .env('CF_RECORD_NAME')
    .makeOptionMandatory();
const apiTokenOption = new Option('-t, --token <apiToken>', "CloudFlare's API Token")
    .env('CF_API_TOKEN')
    .makeOptionMandatory();

program
    .addOption(zoneIdOption)
    .addOption(zoneNameOption)
    .addOption(recordNameOption)
    .addOption(apiTokenOption)
    .action(async ({ zoneId, zoneName, recordName, token }) => {
        if (!zoneId && !zoneName) {
            return program.error('Either --zone-id or --zone-name must be provided');
        }

        const cloudflareService = new CloudflareService(token);

        try {
            const tokenStatus = await cloudflareService.verifyToken();
            if (tokenStatus.status !== 'active') {
                return program.error('Provided API token is not active');
            }
        } catch (err) {
            return program.error('Invalid API token');
        }

        let zone: Zone;
        if (zoneId) {
            try {
                zone = await cloudflareService.getZone(zoneId);
            } catch (err) {
                if (isAxiosError(err)) {
                    if (err.response?.status === 404) {
                        return program.error(`Zone with ID ${zoneId} not found`);
                    }
                }

                return handleCloudflareError(err);
            }
        } else {
            try {
                const zones = await cloudflareService.listZones({ name: zoneName });
                if (zones.length === 0) {
                    return program.error(`Zone with name ${zoneName!} not found`);
                }

                zone = zones[0];
            } catch (err) {
                return handleCloudflareError(err);
            }
        }

        let record: Record;
        try {
            const records = await cloudflareService.listDnsRecords(zone.id);
            const foundRecord = records.find((record) => record.name === recordName);
            if (foundRecord == null) {
                return program.error(`Record with name ${recordName} not found`);
            }

            record = foundRecord;
        } catch (err) {
            return handleCloudflareError(err);
        }

        let ip: string;
        try {
            ip = await IpifyService.getClientIpAddress();
        } catch (err) {
            return program.error('Unable to get client IP');
        }

        if (record.content === ip) {
            return console.log(`Record ${record.name} already points to ${ip}`);
        }

        try {
            const newRecord: PatchRecordBody = {
                type: record.type,
                name: record.name,
                content: ip,
            };

            const updatedRecord = await cloudflareService.patchDnsRecord(
                zone.id,
                record.id,
                newRecord,
            );

            console.log(`Record ${updatedRecord.name} updated to ${updatedRecord.content}`);
        } catch (err) {
            return handleCloudflareError(err);
        }
    });

const handleCloudflareError = (err: unknown): never => {
    if (isAxiosError(err)) {
        if (err.response?.status === 403) {
            return program.error('Invalid permissions for the provided API token');
        } else {
            return program.error('Cloudflare is having issues. Please try again later');
        }
    }

    return program.error('An unknown error occurred');
};
