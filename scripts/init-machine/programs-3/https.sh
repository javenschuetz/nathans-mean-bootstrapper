#!/bin/bash

# notes
#
# for certbot info, type:
#		certbot --help
#
# more information
#	https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04
#
# depends on:
#		- nginx
#		- ufw
#

# add certbot repository & install
sudo add-apt-repository ppa:certbot/certbot -y
sudo apt-get install python-certbot-nginx -y

echo "error, remember to set the domain value!"
# exit 1

# obtain tls certificate
# --nginx means "use the nginx plugin"
# -d means "the cert is for these domains"
# 		note - probably, the domains need to match the server_name directive in the nginx
# 		config file at <sites_enable_path>/myDomain.com
sudo certbot --nginx -d myDomain.com -d www.myDomain.com \
		--rsa-key-size 4096 \
		--non-interactive --agree-tos \
		--email mail@nathanschuetz.ca
