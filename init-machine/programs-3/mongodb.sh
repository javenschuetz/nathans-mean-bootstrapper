# mongodb
# depends on node - maybe

echo; echo "installing mongo package manager"
# TODO: is this idempotent?
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
# TODO: is this idempotent?
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" \
        | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get -y update
sudo apt-get -y upgrade

sudo apt-get install -y mongodb-org
