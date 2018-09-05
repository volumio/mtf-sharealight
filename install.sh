#!/bin/sh

echo "Installing dependencies"
apt-get update 
apt-get install -y build-essential libusb-1.0-0-dev

npm install


echo "Setting powermate permissions"
echo 'SUBSYSTEM=="usb", ATTRS{idVendor}=="077d", ATTRS{idProduct}=="0410", SYMLINK+="powermate", MODE="660", GROUP="volumio"' > /etc/udev/rules.d/95-powermate.rules
