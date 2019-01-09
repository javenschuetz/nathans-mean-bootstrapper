# replace myDomain with a real domain

server {
	listen 80;
	listen [::]:80;

	return 301 https://myDomain.com$request_uri;
}

server {
	listen 443 ssl;
	listen [::]:443 ssl;

	server_name myDomain.com www.myDomain.com;

	# hsts
	add_header Strict-Transport-Security "max-age=31536000" always;

	location / {
		proxy_pass http://127.0.0.1:9000;
	}
}
