## Technologies

- TypeScript
- Rollup
- Web Components
- IndexedDB API
- Docker

## Backend deployment

docker build -t pasta-drawer .
docker tag pasta-drawer gcr.io/nerdmr-web-space/pasta-drawer
docker push gcr.io/nerdmr-web-space/pasta-drawer