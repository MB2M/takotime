# takotime

launch mongo db on WSL:
sudo mongod --dbpath ~/data/db

launch nodemon:
npx nodemon --exec npm start --watch ./build

resync Index MongoDB:
ex:

await StationDevices.syncIndexes();
