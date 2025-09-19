# GCS Proxy

Minimal proxy that returns objects from a configured GCS bucket when presented with a matching token.

Usage:

- Set `PROXY_TOKEN` to the secret token the container will accept.
- Set `GCS_BUCKET` to the bucket name to serve from.

Example POST body:

```
{ "token": "foobar", "path": "path/to/object" }
```

Build:

```
docker build -t gcs-proxy:latest .
```

Run locally (require application default credentials for GCS access):

```
docker run -e PROXY_TOKEN=secret -e GCS_BUCKET=my-bucket -p 8080:8080 gcs-proxy:latest
```

Deploy to Cloud Run:

```
gcloud builds submit --tag gcr.io/PROJECT_ID/gcs-proxy
gcloud run deploy gcs-proxy --image gcr.io/PROJECT_ID/gcs-proxy --platform managed --region us-central1 --allow-unauthenticated --set-env-vars PROXY_TOKEN=secret,GCS_BUCKET=my-bucket
```

Notes:
- Container uses Application Default Credentials (the Cloud Run service account) to access GCS.
- This proxy performs only a token equality check and a simple existence check on the object.
