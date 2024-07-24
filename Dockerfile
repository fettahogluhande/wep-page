# Base image olarak nginx kullan
FROM nginx:alpine

# HTML dosyasını nginx'in varsayılan dizinine kopyala
COPY index.html /usr/share/nginx/html/

# Nginx'in çalışacağı portu belirt
EXPOSE 80
