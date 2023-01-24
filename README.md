# 🌀 Portal DB Backup To R2

A cron job that backs-up the [Portal][acm-portal] database daily at 5am.

- Cron-job reporting & monitoring provided by [Sentry.io][sentry-io].
- Configurable cron scheduling via environment variables (no .env)

__Note that the API keys are currently set to expire July 20th, 2028. They will need to regenerated at that point in time.__

---

Deployed with Railway:

[![Deploy on Railway][railway-button]][railway-template]

[acm-portal]: https://github.com/UTSA-ACM/Portal
[railway-button]: https://railway.app/button.svg
[railway-template]: https://railway.app/new/template/I4zGrH
[sentry-io]: https://sentry.io
