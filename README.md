# 🌀 Portal DB Backup To R2

A one-shot backup that for the [Portal][acm-portal] database.

- Uses `pg_dump` to create a compressed backup of the database, usable with `pg_restore`.
- Cron-job reporting & monitoring provided by [Sentry.io][sentry-io].
- Connects to an S3-compatible storage API (e.g. Cloudflare R2) to store the backup file.
- Cron-job is scheduled by Railway, not the application.

__Note that the API keys are currently set to expire July 20th, 2028. They will need to regenerated at that point in time.__


[acm-portal]: https://github.com/UTSA-ACM/Portal
[sentry-io]: https://sentry.io
