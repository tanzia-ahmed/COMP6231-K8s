
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

## Google Kubernetes Engine.
To deploy the cluster of nodes/machine we decided to use GCP - Google Cloud Platform tools as it provide $300 worth free credit which can be used within 90 days. To create the cluster with specifications we used google cloud command line interface. Following steps are required to install the cli-tool and manage the cluster. 

- Install the command-line tool from the dockerhub and run the container from it 
    ``` 
    docker pull google/cloud-sdk
    ```
    ```
    docker run -it  google/cloud-sdk:latest
    ```
    The command above will run the docker container in the interactive mode and we can run the google cloud cli commands
- Next step would be to authenticate to the project for which we need to use the following command.
    ```
    gcloud auth login
    ```
    The command above will generate a link on the terminal which needs to be copied to the browser and login with google account to create the project, manage clusters.
- Next Step would be to create the project.

    ```
    gcloud projects create gke-project-comp6231
    ```
- Set the cli to bind to the project, so we can create the cluster within the project which we created.

    ```
    gcloud config set project gke-project-comp6231
    ```
- Once it done region needs to be selected where we need to have the cluster. For the project asia-east2-c is selected at random with e2-small machine type. Furthermore, we also need to look into the available version of the kubernetes using the following command. 

```
gcloud container get-server-config --zone asia-east2-c
```
In the cluster command shown in the next step the kubernetes 1.18.16-gke.500 is good enough for this project.

``` 
gcloud container clusters create gke-project-comp6231 \
--cluster-version 1.18.16-gke.500 \
--disk-size 200 \
--num-nodes 1 \
--machine-type e2-small \
--no-enable-cloud-logging \
--no-enable-cloud-monitoring  \
--zone asia-east2-c
```


- Delete the Cluster After Testing. 
```
gcloud container clusters delete gke-project-comp6231 --zone asia-east2-c
```
Since we have limited quota we need to delete the cluster after performing the operations.


## AutoScaling & Load Testing. 
In the Kubernetes cluster we are using HPA (Horizontal Pod Autoscaler) and following command is being used to scale the app-deployment from minimum of 3 pods to 6 pods to manage the cpu utilisation in the cluster.
```
    kubectl autoscale deployment app-deployment --cpu-percent=60 --min=3 --max=10
```
Furthermore, to perform the load testing we are using Autocannon library from npm.com and can be found at <a href="https://www.npmjs.com/package/autocannon"> here </a> Once it is installed following command was used to send the traffic to the load-balancing service of the Node.js Api.

```
autocannon -c 2000 -d 10 -p 200 EXTERNAL_IP
```

## Authors. 
The Kubernetes project is developed for COMP6231 module and 
 the repository is maintained by following authors.
* Nadip.
* Tanzia.
* Vinayak.
* Protim.
