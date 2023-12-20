# Job Journey
#### <b>LAUNCH YOUR CAREER QUEST WITH CLARITY</b>
#### Plan, Track, Achieve!
#### Your career journey, mapped and mastered. With our intuitive tracking, turn every application into a stepping stone towards success.

![Screenshot](/public/screenshot.png)

#### Check out this application here
http://job-journey.us-east-2.elasticbeanstalk.com/
## Team Members

* Jay Talekar : 20015818
* Krutarth Maheshbhai Bhavani : 20011129
* Jiaxuan Shi : 20016097
* Yousef Khalil : 10462509

## Setup

### Installation of Docker

To run this project, you need to have Docker installed on your machine. If you don't have Docker installed, follow the official [Docker installation guide](https://docs.docker.com/get-docker/) to install it.

### Setting up the Github Repository

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/JayTalekar/job-journey.git
    ```
    OR 

    Fork the repository to your Github account and clone it to your local machine

2. Change into the project directory:
    ```bash
    cd Job-Journey
    ```

### Setting up AWS Elastic Beanstalk with AWS CodePipeline

1. Create an AWS Elastic Beanstalk environment for your application.
    * Log in to the AWS Management Console.
    * Create a new AWS Elastic Beanstalk (EBS) application.
    * Configure an environment within the application with the following specifications:
        1. Set the environment tier to "web server environment."
        2. Define a domain for hosting the application.
        3. Choose Docker as the platform.
        4. Opt for the Sample App as the initial application code.
        5. Select the preset as Single tier (free tier).
        6. Utilize existing or create new Service roles, EC2 key pair, and EC2 instance profile to grant service access.
        7. Retain default settings for networking and database configurations.
        8. Adjust the instance type to t2.micro (free tier), while leaving other settings in instance traffic and scaling as default.
        9. Set health monitoring to basic, deselect managed updates and keep other settings default.
    * Review the configured changes and settings before proceeding to create the environment.

2. Set up an AWS CodePipeline to automatically deploy your application to Elastic Beanstalk whenever changes are pushed to the main branch of your GitHub repository.
    * Log in to the AWS Management Console.
    * Create a new AWS CodePipeline.
    * Configure the CodePipeline with the following settings:
        1. Provide a name for the pipeline and optionally rename the Role name.
        2. In the "Add source stage," follow these instructions:
            1. Set the source provider as GitHub.
            2. Connect GitHub to AWS by clicking on the appropriate option.
            3. Select the repository name where your application is hosted.
            4. Choose "Pipeline trigger" as "Push in Branch."
            5. Specify the branch name that should trigger an action in the pipeline upon a push.
        3. Skip the build stage.
        4. In the "Add deploy stage," select the deploy provider as AWS Elastic Beanstalk, and then choose the application and environment created earlier.
    * Review the configured changes and proceed to create the pipeline.

## Execute (using NPM or Docker)

### Run the project using npm run dev

1. Make sure you have Node.js and npm installed on your machine.

2. Install the project dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```
### Containerize & Run the application using Docker Compose

1. Make sure you are in the project directory.
2. Install the project dependencies:
    ```bash
    npm install
    ```

2. Build the Docker container:
    ```bash
    docker-compose build
    ```

3. Start the Docker container:
    ```bash
    docker-compose up
    ```

Now you can access the Job Journey application in your browser at http://localhost:3000.
