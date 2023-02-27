# takotime

launch mongo db on WSL:
sudo mongod --dbpath ~/data/db

launch mongo ubuntu:
mongod --dbpath /var/lib/mongodb2 --logpath /var/log/mongodb/mongod.log --logappend

launch nodemon:
npx nodemon --exec npm start --watch ./build

resync Index MongoDB:
ex:

await StationDevices.syncIndexes();
