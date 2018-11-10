# install git

echo; echo "installing and configuring git"

#### install
sudo apt-get install -y git

#### configure
#### note - this is just for the root user, might change after we elim that
git config --global user.name "backbone-server"
git config --global user.email server@teambackbone.com
git config --global core.editor emacs
