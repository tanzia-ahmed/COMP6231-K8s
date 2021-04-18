docker build -t test-repo:1 .
wait
docker tag test-repo:1 sareenv/test-repo:1
wait
echo "Commit success"
docker push sareenv/test-repo:1
wait
docker rmi test-repo:1 --force