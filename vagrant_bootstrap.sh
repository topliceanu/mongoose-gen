#!/usr/bin/env bash

# Init.
apt-get update

# Install mongodb.
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list
apt-get update
apt-get install -y mongodb-org-server mongodb-org-shell

# Install node.
NODE_VERSION=0.10.35
apt-get -y install g++ gcc make
wget http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION.tar.gz -O /tmp/nodejs.tar.gz
tar -xzvf /tmp/nodejs.tar.gz -C /home/vagrant
chown -R vagrant:vagrant /home/vagrant/node-v$NODE_VERSION
su - vagrant -c "/home/vagrant/node-v$NODE_VERSION/configure"
su - vagrant -c "cd /home/vagrant/node-v$NODE_VERSION; make"
su - vagrant -c "cd /home/vagrant/node-v$NODE_VERSION; sudo make install"

# Install node dependencies.
su - vagrant -c "cd /vagrant/; npm install"
