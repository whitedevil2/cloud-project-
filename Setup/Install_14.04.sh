#!/bin/sh

###########################
# Docker SETUP
###########################
apt-get update
apt-get install -y docker.io
ln -sf /usr/bin/docker.io /usr/local/bin/docker
sed -i '$acomplete -F _docker docker' /etc/bash_completion.d/docker.io

echo "Docker Setup complete"

###########################
# NodeJS setup
###########################
apt-get update
apt-get install -y nodejs
apt-get install -y npm
echo "NodeJS setup Complete"

###########################
# Start Docker
###########################
chmod 777 ../DockerTimeout.sh
chmod 777 ../Payload/script.sh
chmod 777 ../Payload/javaRunner.sh
chmod 777 UpdateDocker.sh

service docker.io restart
./UpdateDocker.sh
