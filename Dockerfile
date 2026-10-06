# Nothing to compile - this is plain HTML/CSS/JS, so we just serve it.
FROM nginx:1.27-alpine

COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY src/ /usr/share/nginx/html/src/

# nginx's default config already serves on port 80 and handles static files
# correctly out of the box - no custom config needed for a site this simple.
EXPOSE 80
