#!/bin/sh

# UPDATE CONFIG
echo -e "\nPrepare to run build script"
. ~/gmm_conf.ini

sudo mv ~/gmm_conf.ini /home/test/gmm_conf.ini
sudo su test < script_to_create_build.sh

rm script_to_create_build.sh