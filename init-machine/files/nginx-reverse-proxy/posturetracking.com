
server {
	listen 80;
	listen [::]:80;

	server_name posturetracking.com;

	location / {
		proxy_pass http://127.0.0.1:9000;
	}
}
