Kubernetes Example Voting App (arm64 machines)
=========

A simple distributed application running across multiple Docker containers.

This is based on the original [example-voting-app](https://github.com/dockersamples/example-voting-app) from docker-examples(https://github.com/dockersamples)

modified to work on Kubernetes on arm64 machines

Run the app in Kubernetes
-------------------------

The folder k8s-specifications contains the yaml specifications of the Voting App's services.

First create the vote namespace

```
$ kubectl create namespace vote
```

Run the following command to create the deployments and services objects:
```
$ kubectl create -f k8s-specifications/
deployment "db" created
service "db" created
deployment "redis" created
service "redis" created
deployment "result" created
service "result" created
deployment "vote" created
service "vote" created
deployment "worker" created
```

The vote interface is then available on port 31000 on each host of the cluster, the result one is available on port 32000.

Architecture
-----

![Architecture diagram](architecture.png)

* A front-end web app in [Python](/vote) which lets you vote between two options
* A [Redis](https://hub.docker.com/_/redis/) queue which collects new votes
* A [.NET Core](/worker/src) worker which consumes votes and stores them in…
* A [Postgres](https://hub.docker.com/_/postgres/) database backed by a Docker volume
* A [Node.js](/result) webapp which shows the results of the voting in real time


Notes
-----

The voting application only accepts one vote per client. It does not register votes if a vote has already been submitted from a client.

This isn't an example of a properly architected perfectly designed distributed app... it's just a simple 
example of the various types of pieces and languages you might see (queues, persistent data, etc), and how to 
deal with them in Docker at a basic level. 
