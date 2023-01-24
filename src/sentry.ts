import { env } from "./env";
import axios, { AxiosResponse } from "axios";

export type CheckinResponse = {
    checkinId: string | undefined,
    startTime: Date
}

const authorizationHeaders = {
    'Authorization': `Bearer ${env.SENTRY_AUTH_TOKEN}`,
    'Content-Type': 'application/json'
}

/**
 * Begin the checkin process
 * @returns {Promise<CheckinResponse>}
 */
export async function checkin(): Promise<CheckinResponse> {
    const now = new Date();
    const createUrl = `https://sentry.io/api/0/organizations/${env.SENTRY_ORGANIZATION}/monitors/${env.SENTRY_MONITOR_ID}/checkins/`;
    const response: AxiosResponse<{id: string}> = await axios.post(createUrl, {status: "in_progress"}, {
        headers: authorizationHeaders,
        validateStatus: null
    })

    return {checkinId: response.data.id, startTime: now}
}

/**
 * 
 * @param checkinId The identifier of the checkin originally obtained from the @see checkin
 * @param startTime 
 * @param success {boolean} If true,
 * @returns 
 */
export async function checkout(checkinId: string | null, startTime: Date, success: boolean) {
    const endTime = new Date();

    const updateURL = `https://sentry.io/api/0/organizations/${env.SENTRY_ORGANIZATION}/monitors/${env.SENTRY_MONITOR_ID}/checkins/${checkinId}/`;
    const response = await axios.put(updateURL, {status: success ? "ok" : "error"}, {
        headers: authorizationHeaders,
        validateStatus: null
    });

    return {endTime}
}