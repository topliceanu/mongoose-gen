#!/usr/bin/env bash

# Install mongodb.
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu precise/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org-server mongodb-org-shell

# Install nvm
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash
echo ". ~/.nvm/nvm.sh" >> ~/.bash_profile
source ~/.bash_profile

# Install node v4.2.4.
nvm install 4

# Install package dependencies.
cd /vagrant; nvm use; npm install
