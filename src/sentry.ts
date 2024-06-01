import { randomUUID } from "crypto";
import { env } from "./env";
import axios, { AxiosResponse } from "axios";

const SENTRY_INGEST_URL = `https://${env.SENTRY_ORGANIZATION_ID}.ingest.sentry.io`;
const SENTRY_MONITOR_URL = `${SENTRY_INGEST_URL}/api/${env.SENTRY_PROJECT_ID}/cron/${env.SENTRY_MONITOR_SLUG}/${env.SENTRY_ORGANIZATION_PUBLIC_KEY}`;


/**
 * Begin the check-in process, returning a check-in ID and the start time
 * @returns {Promise<CheckinResponse>}
 */
export async function checkin(): Promise<{check_in_id: string, startTime: Date}> {
    const now = new Date();
    const check_in_id = randomUUID();
    
    await axios.get(SENTRY_MONITOR_URL, {params: { check_in_id: check_in_id, status: "in_progress"}});
    
    return {check_in_id, startTime: now}
}

/**
 * 
 * @param check_in_id The identifier of the check-in originally obtained from the @see checkin
 * @param isSuccess {boolean} If true, the check-in will be marked as successful. If false, it will be marked as failed.
 * @returns {Promise<{endTime: Date}>}
 */
export async function checkout(check_in_id: string | null, isSuccess: boolean): Promise<{endTime: Date}> {
    const endTime = new Date();

    await axios.get(SENTRY_MONITOR_URL, {params: { check_in_id: check_in_id, status: isSuccess ? "ok" : "error"}});

    return {endTime}
}