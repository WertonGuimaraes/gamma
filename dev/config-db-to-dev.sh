#!/bin/sh

sudo apt-get install python-dev libmysqlclient-dev mysql-server-5.6

export PATH=$PATH:/usr/local/mysql/bin

mysql -u root -proot -e "drop database if exists gmm"
mysql -u root -proot -e "create database gmm DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci"
