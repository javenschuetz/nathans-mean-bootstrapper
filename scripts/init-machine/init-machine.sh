#!/bin/bash

# sets up fresh ubuntu 18 machine to act as server
#
# promises
#    - machine installs each program in the programs script directory
# requires
#    - user is set up
#    - user is logged in and executes the scripts
#    - ubuntu 17.10
#    - .bashrc exists

# bash "safe mode"
# causes the script to terminate if something fails
set -euo pipefail
IFS=$'\n\t'

# welcome
echo
echo
echo '****************************************************************'
echo 'Initializing Ubuntu 18 server...'
echo '****************************************************************'


# update repos
echo
echo
echo '****************************************************************'
echo "updating & upgrading package managers"
echo '****************************************************************'
sudo apt-get -y upgrade
sudo apt-get -y update


# for each install script, execute it
echo
echo
echo '****************************************************************'
echo "installing each program found in programs directory"
echo '****************************************************************'

# for prereqs
echo
echo 'stage 1'
for file in ./programs-1/*.sh
do
#echo "$file --- note: this is just test mode, not actually installing. Uncomment to install."
bash $file
done

# middle level prereqs (if needed)
echo
echo 'stage 2'
for file in ./programs-2/*.sh
do
#echo "$file --- note: this is just test mode, not actually installing. Uncomment to install."
bash $file
done

# bottom level prereqs
echo
echo 'stage 3'
for file in ./programs-3/*.sh
do
#echo "$file --- note: this is just test mode, not actually installing. Uncomment to install."
bash $file
done

# # our software
# # todo - right now we're just doing it manually
# echo
# echo 'stage 7'
# for file in ./programs-7/*.sh
# do
# #echo "$file --- note: this is just test mode, not actually installing. Uncomment to install."
# bash $file
# done

# cleanup
echo
echo
echo '****************************************************************'
echo "cleaning up"
echo '    (removing redundant packages)'
echo '****************************************************************'
# cryptsetup apparently gets removed by autoremove w/o this line
sudo apt-mark manual cryptsetup
sudo apt-get autoremove -y
source ~/.bashrc

# bye
echo
echo
echo '****************************************************************'
echo 'initialization successful!'
echo '****************************************************************'
echo
echo
