#! /bin/bash

mysql -u root -proot  -e "drop database if exists e2e_gmm;"
mysql -u root -proot  -e "create database e2e_gmm DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;"
sed -i "s!DATABASE_NAME: gmm!DATABASE_NAME: e2e_gmm!" gmm.ini
sed -i "s!config.read(HOME_DIR + '/gmm.ini')!config.read('gmm.ini')!" gmm/settings.py

python manage.py migrate
python manage.py runscript create_user

sed -i "s!localhost:8000!localhost:8001!" webclient/src/app/app.constants.js