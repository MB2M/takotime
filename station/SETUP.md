Setup sd Card :

    1 -Install debian OS lite
    2- add empty filename with name 'ssh'
    3- add wpa_supplicant.conf file :

    ```
    ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
    update_config=1

    network={
        ssid="Great Again"
        psk=<PWD>
        key_mgmt=WPA-PSK
    }
    ```
    https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi#4-boot-ubuntu-server

# update/upgrade

    sudo apt-get update
    sudo apt-get upgrade

<!-- # setup wifi /etc/dhcpcd.conf

    interface wlan0
    static ip_address=192.168.3.10X
    static routers=192.168.3.1
    static domain_name_servers=192.168.3.1

# install python

    [link info](https://linuxize.com/post/how-to-install-python-3-9-on-debian-10/)

    sudo apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev curl libbz2-dev

    wget https://www.python.org/ftp/python/3.9.9/Python-3.9.9.tgz

    tar -xf Python-3.9.9.tgz

    cd Python-3.9.9/
    ./configure --enable-optimizations

    make -j 4 (4 is the number of processor cores)

    sudo make altinstall

# install postgres sql

    sudo apt-get install postgresql

### Config postgres:

change user:

    sudo -i -u postgres
    psql
    create database workout;
    ALTER USER postgres WITH PASSWORD 'postgres';
    \q
    exit -->

# Install chrony

    sudo apt-get install chrony

### config chrony

    sudo nano /etc/chrony/chrony.conf

add following line:

    server 192.168.3.100 iburst

then run:

    sudo systemctl enable chronyd.service
    sudo systemctl start chronyd.service

reboot and run cmd to verify:

    sudo chronyc tracking

change timezone

    sudo timedatectl set-timezone Europe/Paris

<!-- # install pip

    sudo apt-get install pip

# prepare station

### from dev:

    scp -r station pi@192.168.3.1XX:~

### from station:

    pip install psycopg2
    pip install websocket-client
    pip install smbus -->

<!-- # Configure bluetooth:

1st time install:

    sudo apt install bluetooth pi-bluetooth bluez

Reboot and run:

    sudo bluetoothctl
    scan on
    pair XX:XX:XX:XX:XX:XX
    trust XX:XX:XX:XX:XX:XX
    exit -->

# NEW VERSION

sudo apt-get install libbluetooth-dev
sudo apt-get install nodejs npm
sudo apt-get install git-all

mkdir takotime
git init
git remote add -f origin https://github.com/MB2M/takotime.git
git config core.sparseCheckout true
echo "station/" >> .git/info/sparse-checkout
git pull origin <BRANCH>

cd station
npm install

sudo node index.js