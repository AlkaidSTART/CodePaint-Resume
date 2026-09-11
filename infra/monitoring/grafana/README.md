Grafana data is persisted by the Compose volume. Add dashboards and datasource
provisioning under this directory when the API metrics endpoint is enabled.

The current API does not expose `/metrics`, so Prometheus scraping is prepared
but will remain empty until application metrics are added.
