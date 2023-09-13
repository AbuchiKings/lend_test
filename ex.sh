for i in $(cat .env); do
   export $i;
done;
sleep 10;
npm run migrate:latest;