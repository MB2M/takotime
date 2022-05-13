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

# change password

    passwd

# config GPIO 18 as PINUP

sudo nano /boot/config.txt

Add : gpio=18,24=pu

# update/upgrade

    sudo apt update && sudo apt upgrade

# setup wifi /etc/dhcpcd.conf

    sudo nano /etc/dhcpcd.conf
    interface wlan0
    static ip_address=192.168.3.10X
    static routers=192.168.3.1
    static domain_name_servers=192.168.3.1

<!-- # install python

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

    sudo apt install chrony -y

### config chrony

    sudo nano /etc/chrony/chrony.conf

add following line:

    server 192.168.3.100 iburst

then run:

    sudo systemctl enable chrony
    sudo systemctl start chrony

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

> sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev

> sudo su

> curl -fsSL https://deb.nodesource.com/setup_16.x | bash -

> sudo su pi

> sudo apt-get install -y nodejs git

> mkdir takotime && cd takotime

> git init

> git remote add -f origin https://github.com/MB2M/takotime.git

> git config core.sparseCheckout true

> echo "station/" >> .git/info/sparse-checkout

> git config pull.rebase true

> git pull origin main

> git checkout main

> cd station; npm install

> nano .env

> cd takotime/station; git pull origin main && sudo node index.js   
cd && sudo npm install pm2@latest -g

cd takotime/station 
pm2 start npm --name "livestation" -- start
pm2 start npm --name "restart button" -- run restartButton
pm2 startup
pm2 save

<!-- ## Setup systemd services

### station.service

>sudo nano /etc/systemd/system/station.service

[Unit]
Description=Station Service
Wants=network-online.target
After=network-online.target

[Service]
WorkingDirectory=/home/pi/takotime/station
ExecStartPre=sudo rm -f livestation.json
ExecStart=sudo /usr/bin/node index.js
Restart=on-failure
User=pi
Environment=PORT=3000

[Install]
WantedBy=multi-user.target

### station_reload.service

>sudo nano /etc/systemd/system/station_service.service

[Unit]
Description=Station Service
Wants=network-online.target
After=network-online.target

[Service]
WorkingDirectory=/home/pi/takotime/station
ExecStart=sudo /usr/bin/node buttonRestartScript.js
Restart=on-failure
User=pi
Environment=PORT=3000

[Install]
WantedBy=multi-user.target -->