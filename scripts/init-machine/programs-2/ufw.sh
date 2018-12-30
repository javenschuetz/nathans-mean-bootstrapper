#!/bin/bash

# notes: to get current ufw status:
# 	sudo ufw status verbose
#
# see here for more details
# https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-18-04

# *********************************************** install uncomplicated firewall
sudo apt-get install ufw

# by default, ipv6 is enabled, which is good

# ************************************************************** set to defaults
# note: this does not kick us off the server b/c ufw is not enabled at this time
sudo ufw default deny incoming
sudo ufw default allow outgoing

# ******************************************************* allow ssh, http, https
sudo ufw allow ssh
# if ssh is not in /etc/services, this version may be needed
# sudo ufw allow 22
sudo ufw allow http
sudo ufw allow https

# ******************************************************************* enable ufw
sudo ufw --force enable
