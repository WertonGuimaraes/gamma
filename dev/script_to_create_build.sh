#!/bin/sh

# UPDATE CONFIG
echo -e "\nUpdate configurations to server test"
. ~/gmm_conf.ini

# CREATE BACKUP AND UPDATE PROJECT
if ! $is_build_local
then
    cd
    if ! [ -d "~/gmm_backup_builds" ]
    then
        mkdir ~/gmm_backup_builds
    fi

    cp -r ~/gmm ~/gmm_backup_builds/gmm$(date +%Y_%m_%d_%H_%M_%S)

    echo -e "\nUpdating project"

    if ! [ -d "./gmm" ]
    then
        git clone http://$gitlab_login:$gitlab_password@10.75.202.1/gamma/gmm.git
        cd gmm
    else
        cd gmm
        git checkout .
        git pull http://$gitlab_login:$gitlab_password@10.75.202.1/gamma/gmm.git
    fi

    if [ $server_name == "test-asus" ]
    then
        sed -i 's/localhost:8000/10.75.202.5/' webclient/src/app/app.constants.js
    else
        sed -i 's/localhost:8000/gmm.asusaws.embedded.ufcg.edu.br/' webclient/src/app/app.constants.js
        sed -i 's/server_name gamma-asus.virtus.ufcg.edu.br 10.75.202.5;/server_name gmm.asusaws.embedded.ufcg.edu.br;/' nginx.conf
        sed -i 's/DATABASE_PASSWORD: root/DATABASE_PASSWORD: asustestmysql/' gmm.ini
        sed -i 's/DATABASE_HOST: localhost/DATABASE_HOST:  asus-gmm-test.css7uaiq2j1r.us-west-2.rds.amazonaws.com/' gmm.ini
    fi
fi


# STOP SERVICES
kill -9 $(pidof uwsgi)


# CLEAR PROJECT
if $remove_pyenv
then
    echo -e "\nRecreate virtualenv"
    rm -r ../pyenv
fi

if $remove_npm
then
    echo -e "\nRemoving npm (node_modules) folder"
    rm -r webclient/node_modules
fi

if $remove_bower
then
    echo -e "\nRemoving bower (bower_components) folder"
    rm -r webclient/bower_components
fi

echo -e "\nRemoving dist folder"
rm -r webclient/dist


# START VIRTUALENV
echo -e "\nRecreate virtualenv"
virtualenv ../pyenv --python=/usr/local/lib/python2.7.11/bin/python
. ../pyenv/bin/activate


# BACKEND
echo -e "\nInstalling dependencies"
pip install -r requirements.txt

echo -e "\nMigrating data base"
mysql -u root -proot -e "drop database if exists gmm"
mysql -u root -proot -e "create database if not exists gmm DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci"
python manage.py migrate

echo -e "\nStating uwsgi.sh"
nohup ./run-uwsgi.sh > /dev/null 2>&1 &


# FRONTEND
cd webclient

echo -e "\nUsing current node"
source ~/.nvm/nvm.sh
nvm use 4.2.6

echo -e "\nInstalling npm"
npm install

echo -e "\nInstalling bower"
bower install

echo -e "\nCreating new build"
gulp build

rm ~/gmm_conf.ini
