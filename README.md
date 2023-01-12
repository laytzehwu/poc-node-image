# Sample Node service in Docker

## Build and push image

Run below command to generate docker image:

> docker build -t poc-mock -f MockServerDockerfile .

## Run it

After an image created, we may run it in our local container:

> docker run -dp 3101:3101 poc-mock

Access http://localhost:3101/homePage via browser
