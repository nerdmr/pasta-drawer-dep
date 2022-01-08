docker build -t url-preview .
docker tag url-preview gcr.io/nerdmr-web-space/url-preview
docker push gcr.io/nerdmr-web-space/url-preview