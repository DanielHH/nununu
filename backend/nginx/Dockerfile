FROM nginx:1.15

RUN apt-get update \
    && apt-get install -y openssl

RUN openssl req \
            -x509 \
            -subj "/C=US/ST=Denial/L=Nowhere/O=Dis" \
            -nodes \
            -newkey rsa:2048 \
            -keyout /etc/ssl/private/localhost.key \
            -out /etc/ssl/certs/localhost.crt \
            -days 365
