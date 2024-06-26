# Waqqly: A web app for booking local dog walkers!

Welcome to Waqqly, a user-friendly web app designed to connect dog owners with reliable walkers in their area. Our platform streamlines scheduling, making sure both pups and their owners are happy and stress-free!

## Environment Variables

Before running this project, ensure you've added the necessary environment variables to your `.env` file. Each micro-service comes with its own `.env` file.

## Installation Guide

For cloud deployment: 

First of all, Go to your favorite cloud provider (e.g AWS). Make a server instance (e.g EC2) of linux - Linux is preffered choice. Now ssh into this server or connect through the online connect service. Install necessary updates of Linux and then proceed towards the setup steps. 

### Manual Setup

1. **Clone the Repository**: First, make sure you have Git installed on your system. Then, clone the repository using the following command:
   
    ```bash
    git clone <project-url>
    ```

2. **Install Node.js**: Ensure you have Node.js installed on your system. Then, navigate to each directory (except the gateway) and initialize the micro-services. For example:

    ```bash
    cd bookings
    npm install
    ```

    ```bash
    cd users
    npm install
    ```

    ```bash
    cd walkers
    npm install
    ```

    Repeat this process for all sub-directories except the gateway.

3. **Initialize the Gateway**: Navigate to the gateway directory and install its dependencies:

    ```bash
    cd gateway
    npm install
    ```

4. **Start the Server**: Run the following command to start the server in development mode. The app will be served on `localhost:3000`.

    ```bash
    npm run dev
    ```


Now, your Node js application is running on your server. You can check the application running at specified port of gateway (e.g 3000) 

### Docker (Preferred Method)

1. **Install Docker and Docker Compose**: Ensure both Docker and Docker Compose are installed on your system.

   Install docker using

   ``` bash
   sudo snap install docker
   ```

3. **Run Docker Compose**: Use the following command to build and run the Docker containers:

    ```bash
    docker-compose -f docker-compose.yml down && \
    docker-compose -f docker-compose.yml up --build
    ```

    If the `docker-compose` command is not found, try `docker compose` instead.

    This will build the Docker images from scratch and run the containers. The server will also be served on `localhost:3000`.

## Deployment

Waqqly is deployed on Kubernetes. Follow these steps to deploy the project:


![image](https://github.com/Ravi1141/Waqqly/assets/105180025/533acbf7-2958-4aaa-8607-a0a8ffdc97be)

## Communication between Services

![waqqly drawio](https://github.com/Ravi1141/Waqqly/assets/105180025/c0030dab-8cbb-459b-8c6f-c34d2d3d1d85)


1. **Setup Kubernetes Cluster**: Ensure you have a Kubernetes cluster running, either on a cloud provider or on-premise.

2. **Install kubectl**: Install `kubectl` and connect it to your Kubernetes cluster.

3. **Check Cluster Status**: Use the following command to verify that the cluster is up and running:

    ```bash
    kubectl get nodes
    ```

4. **Apply Configurations**: Navigate to the `k8s` directory and apply all the configuration files:

    ```bash
    cd k8s
    kubectl apply -f .
    ```

    This will apply the configurations, and your app should be deployed and running.

5. **Get Public IP**: To get the public IP of your cluster for testing, use the following command:

    ```bash
    kubectl get svc gateway-service -o wide
    ```

    This command will output the details, including the public IP of your cluster for connecting to the deployed app.
