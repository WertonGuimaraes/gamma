#!/bin/sh

file_config=~/gmm_conf.ini

if [ -f "$file_config" ] 
then
    echo "\nUpdate settings"

    . ~/gmm_conf.ini

    if [ "$server_name" = "test-asus" ]
    then
        echo "\nSend configurations to TEST server."
        sshpass -p $password_asus_test scp -r ~/gmm_conf.ini virtus-asus@10.75.202.5:~
        sshpass -p $password_asus_test scp -r ./dev/script_to_create_build.sh virtus-asus@10.75.202.5:~

        echo "\nDoing SSH in TEST server."
        sshpass -p $password_asus_test ssh -o StrictHostKeyChecking=no virtus-asus@10.75.202.5 < dev/configure_users_server.sh
    else
        echo "\nSend configurations to AMAZON server."
        scp -i ~/aws-asus-test.pem ~/gmm_conf.ini ubuntu@52.33.49.4:~
        scp -i ~/aws-asus-test.pem ./dev/script_to_create_build.sh ubuntu@52.33.49.4:~

        echo "\nDoing SSH in AMAZON server."
        ssh -i ~/aws-asus-test.pem ubuntu@52.33.49.4 < dev/configure_users_server.sh
    fi

    rm $file_config
else
    echo "The $file_config not found."
fi

