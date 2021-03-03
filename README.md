
# Kubernetes Project.
The repository contains the implementation of Restful api implemented in 
Node.js using express framework. The Api is converted into the docker image. Furthermore, the implementation 
details are mentioned in the Dockerfile file.
## Navigating to the docker Image.
The docker image was hosted to the hub.docker.com and can be found at 
https://hub.docker.com/repository/docker/sareenv/test-repo. <br />
## Running docker container
<b> Assumption:</b> Docker must be installed in your system to run the containers!
There are following steps to run the project as docker container in your system.
<br/>

* <i> Pull the image from Dockerhub using following commands. </i>
```bash 
    docker pull sareenv/test-repo:1
```
* <i> Run the following command to run docker container. </i>
```bash 
    docker run -p 8080: 8080 -d test-repo  
```
In the above docker command -p option maps the port and -d runs in the 
detached mode.
<br />

## Kubernetes Configuration Files.

All the specifications for the kubernetes are present in the k8s folder with 
.yaml extension. These configuration files can be used using the following 
command:
```bash
    kubectl apply -f file_name
```
Furthermore, the mongo-express folder also contains the yaml configuration 
files. However, it is only for the learning purpose and does not directly 
link to our project. <i> Directory will be removed soon!</i>

## Authors. 
The Kubernetes project is developed for COMP6231 module and 
 the repository is maintained by following authors.
* Nadip.
* Tanzia.
* Vinayak.
* Protim.