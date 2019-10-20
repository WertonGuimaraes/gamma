# Dev tips and Configuration

# Running project

Here are the necessary steps to configure and run the GMM project in any environment.

## Development environment

### Setting up environment

The first step is to install pip.

```bash
$ sudo apt-get install python-pip
```

Once you have pip, for make sure the projects dependencies going to be completed isolated from other projects
dependencies, you need to install virtualenv.

```bash
$ sudo pip install virtualenv
```

After install virtualenv, there's a optional but high recommended step. If you want a more easy life while doing
awesome thing in Django, install virtualenvwrapper.

```bash
$ sudo pip install virtualenvwrapper
```

If you have done the above step (you're awesome), tell the operating system to add a new environment variable.

```bash
$ export WORKON_HOME=~/.envs
```

Now lets create the directory when you create your virtualenv environments.

```bash
$ mkdir -p $WORKON_HOME
```

For load your virtualenvwrapper configurations on your shell startup, run the command down below.

```bash
$ source /usr/local/bin/virtualenvwrapper.sh
```

Now, lets create your environment for the project. But first, change to your environments directory.

```bash
$ cd $WORKON_HOME
```

Create the environment.

```bash
$ mkvirtualenv game
```

And it's done!!!

Now when you going to work on the GMM project, all you need to do is:

```bash
$ workon game
```

### Running backend

If you have already done the steps described on 'Setting up the environment' section, you only need to do is make sure you have all the necessaries dependencies on your current virtualenv environment. For doing that, once you are on the game environment run the command in the project's directory:

```bash
$ sudo pip install -r requirements.txt
```

If all goes well you'll have all dependencies installed on game environment. After that, you need to configure the initial setting of the project and migrate the database schema. To do that, create a symbolic link to gmm.ini and run the script config-database.sh. You can do that running the following commands:

```bash
$ ln -s gmm.ini ~/gmm.ini
$ sudo sh dev/config-database.sh
```

And it's done! To make sure all is working run the django embedded application server.

```bash
$ python manage.py runserver
```

### Running frontend

First, move to the webclient folder

```bash
$ cd webclient
```

Now, you need to install all required node packages.

```bash
$ npm install
```

Next step is to install the required bower packages.

```bash
$ npm install -g bower
$ bower install
```

If you don't have gulp, install the package gulp globally.

```bash
$ sudo npm install -g gulp
```

Done! To make sure everything is working fine, start GMM frontend:

```bash
$ gulp serve
```

## Test/production environment

IMPORTANT: Before you deploy GMM to a machine, be sure the release jobs of the branch `master` runned successfuly.

### Setting up environment

There are some machines which the GMM is deployed for testing. All they are configured to use the same steps on the process of deploy. The access to them is made via ssh.

```bash
$ ssh <username>@<server>
```

When connected to the machine, assure you are using the user `test`.

If GMM is already running, stop it to avoid unexpected problems. To do that, stop the nginx service and the wsgi processes:

```bash
$ stop service nginx
$ pkill wsgi
```

Maybe not all wsgi processes will be stopped in previous step. So, you need to guarantee all them are killed. Do that looking for the processes and killing them manually.

```bash
$ ps -ax | grep uwsgi
$ kill -9 <process number>
```

Now, update the current GMM source code. To do that, verify if you are in the branch `master` and do a git pull.

```bash
$ git status
$ git pull
```

Now you are ready to run the project.

### Running backend

First step here is to create a symbolic link to gmm.ini at $HOME/gmm.ini, so Django can find the project initial configurations.

```bash
$ ln -s gmm.ini ~/gmm.ini
```

Now, activate the pyenv virtualenv and install all backend requirements.

```bash
$ source ~/pyenv/bin/activate
$ pip install -r requirements.txt
```

Make the necessary migrations in Django database (if you are asked to confirm the database changes, type 'yes' and press Enter).

```bash
$ ./manage.py makemigrations
$ ./manage.py migrate
```

Finally, start the uwsgi by running the run-uwsgi script.

```bash
$ ./run-uwsgi.sh &
```

After that, press Enter again. Now, configure nginx to use the correct address. Edit the file nginx.conf and update the server_name value with the current server address.

Finally, start the nginx service to allow frontend and backend communication.

```bash
$ sudo service nginx start
```

Check if the project is running and available by accessing the '<server_adress>/gmm/' on a browser and check if a Django page was displayed.

### Running frontend

First, go to webclient folder:

```bash
$ cd webclient
```

Edit the file src/app/app.constants.js and update the value of URL to use the relative path (/gmm/).

Now, remove the previously deployed front end files.

```bash
$ rm -rf dist
```

Now, install all necessary npm and bower packages.

```bash
$ npm install
$ bower install
```

Run gulp to deploy the new frontend files.

```bash
$ gulp build
```

Verify if the project is working correctly by accessing '<server_address>/' on a browser and check if the webclient login page is displayed. Try to login and verify if it works correctly.

## Using Django Extensions (optional)

You should use django-extensions to automate tasks using Python scripts. The advantage is that you are running in your django application context, like 'manage.py shell'.

We consider you have already runned previous steps of this tutorial.

### Installing 

Download [django-extensions](https://pypi.python.org/packages/source/d/django-extensions/django-extensions-1.5.7.tar.gz#md5=848bd98759ea32cf58f4977cd41e7cad) and unpack it.
Inside is a script called setup.py. Enter this command:

```bash
$ python setup.py install
```

### Running

Now you can address your python script (e.g: scripts/delete_all_users.py) on script directory and run the following command:

```bash
$ ./manage.py runscripts delete_all_users
```

IMPORTANT: your script needs to contain run() method to run correctly.

To more details... read the [documentation](http://django-extensions.readthedocs.org/en/latest/runscript.html).