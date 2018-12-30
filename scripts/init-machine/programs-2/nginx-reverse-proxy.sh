#!/bin/bash

# notes
#
# status: sudo systemctl status nginx
# stop: sudo systemctl stop nginx
# start: sudo systemctl start nginx
#
#
# more information at:
# 	https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04-quickstart
#
# depends on ufw !!
#
#

readonly sites_enabled_path='/etc/nginx/sites-enabled'
readonly sites_available_path='/etc/nginx/sites-available'
readonly init_files_path='files'
readonly our_site='posturetracking.com'

# install nginx
sudo apt install nginx -y

# disable default server
sudo rm ${sites_enabled_path}/default

# enable our site
# sites_available contains config files for all sites nginx can serve
sudo cp ${init_files_path}/nginx-reverse-proxy/${our_site} \
		${sites_available_path}/${our_site}

# sites_enabled contains symbolic links to files in sites-available
# syntax notes:
#		ln -s target_of_symlink location_of_symlink
#		where "-s" means 'symbolic'
#
sudo ln -s ${sites_available_path}/${our_site} \
		${sites_enabled_path}/${our_site}

# enable nginx
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl restart nginx # to prevent loading of cached default page
