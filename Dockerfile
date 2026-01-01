FROM nginx:alpine

COPY . /usr/share/nginx/html

# Nginx config is already set up to serve from /usr/share/nginx/html by default
# Expose port 80
EXPOSE 80
