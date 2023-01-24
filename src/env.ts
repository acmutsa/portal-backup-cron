import { envsafe, str } from "envsafe";

export const env = envsafe({
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  AWS_S3_BUCKET: str(),
  AWS_S3_REGION: str(),
  BACKUP_DATABASE_URL: str({
    desc: 'The connection string of the database to backup.'
  }),
  BACKUP_CRON_SCHEDULE: str({
    desc: 'The cron schedule to run the backup on.',
    default: '0 5 * * *',
    allowEmpty: true
  }),
  AWS_S3_ENDPOINT: str({
    desc: 'The S3 custom endpoint you want to use.',
    default: '',
    allowEmpty: true,
  }),
  SENTRY_ORGANIZATION: str({
    desc: 'The organization ID of the Sentry monitoring system.'
  }),
  SENTRY_MONITOR_ID: str({
    desc: 'The monitor ID of the Sentry monitor for this cron job.'
  }),
  SENTRY_AUTH_TOKEN: str({
    desc: 'The authorization token to be used for this cron job\'s API calls.'
  })
})
