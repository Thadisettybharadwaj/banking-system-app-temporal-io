/**
 * This file Contains, How I deployed banking-system temporal backend in AWS
 *
 * DO FOLLOW THE SAME STEPS WHILE DOING AGAIN.
 */

/**

1. Temporal has been deployed as a Monolith application in Single EC2 Instance

Steps to Re-deploy the same

1. Create a Security Group with all the inbound rules - https://ap-south-1.console.aws.amazon.com/ec2/home?region=ap-south-1#SecurityGroup:groupId=sg-03ee4fe090ef33041

2. Created and EC2 instance (Ubuntu 22.04) with instance type - t3.xlarge and 100 GiB gp3 storage 

3. After Creating Instance, SSH into the instance and install all the required packages

    i. Updated all the packages present in the instance by running - sudo apt update

    ii. Installed docker by running - sudo apt install docker.io -y

    iii. Start the docker - sudo systemctl start docker

    iv. Enable the docker - sudo systemctl enable docker

    To Verify run ==>  docker --version

    v. Install docker compose package - sudo apt install docker-compose -y

    To Verify run ==> docker-compose --version

    vi. Install Node.js -- https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html


4. Fix Permissions (IMPORTANT)

     i. sudo usermod -aG docker ubuntu

     Then logout and reconnect:

        `exit`
         
        `ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>`
     


5. Now we've all the packages ready for usage. Now let's install temporal & banking-system-app into the instance

    i. Pull temporal from Git - git clone https://github.com/temporalio/docker-compose.git

    ii. Move into the folder - cd docker-compose

    iii. Start the services - docker-compose up -d

    This starts:
         Temporal Server
         PostgreSQL
         Temporal Web UI

    To See list of containers running, run ==> docker ps     

    To Verify Temporal web UI , Open  http://<EC2_PUBLIC_IP>:8080  in browser

    iv. Pull banking-system-app from the git - git clone https://github.com/Thadisettybharadwaj/banking-system-app-temporal-io

    v. Move into the folder - cd banking-system-app-temporal-io

    vi. Install the packages - npm i

  
6. Now we've completed all the setup, now it's time to change few configurations in the temporal backend. 

    i. Move into server/api/transfer.route.ts file and update these lines 

        const connection = await Connection.connect({ address: "localhost:7233" });
        const client = new Client({ connection })

7. Run Express Server & Temporal Worker
  
    i. npm run dev:server 
    
    ii. npm run dev:worker

    To Verify, Open http://<EC2_PUBLIC_IP>:3001/api/health in browser to fetch the health of the express-server


8. To Trigger the workflow, run the following `curl` command in the local machine terminal

curl -X POST http://<EC2_PUBLIC_IP>:3001/api/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccount": "user1",
    "toAccount": "user2",
    "amount": 100
  }'    


9. What happend as of now:: 

                             POST /transfer
                                ↓
                             Express API
                                ↓
                             Temporal Client
                                ↓
                             Temporal Server (localhost:7233)
                                ↓
                             Task Queue: transfer-queue
                                ↓
                             Worker picks it up
                                ↓
                             Workflow executes

10. Install pm2 

    Right now:
         If SSH disconnects → your app stops ❌
         If worker crashes → workflows stop ❌
         We’ll fix that using PM2.

     i. npm i -g pm2

     To Verify run ==> pm2 -v


     ii. Stop the existing the scripts which we ran earlier and now freshly run these scripts with pm2

          pm2 start "npx tsx server/index.ts" --name express-api
          pm2 start "npx tsx server/temporal/workers/transfer.worker.ts" --name worker

     To Verify run ==> pm2 list

     
     iii. Save the process list by running ==> pm2 save
     This will create the snapshot of list of servers in the path -- ~/.pm2/dump.pm2

     
     iv. To Enable Auto-Startup, run the below commands

        ->  pm2 startup
           This will output, something like this (EXAMPLE) --> sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

        -> Take the output command and run that again
        
        -> Then do "pm2 save" again

    To Verify, re-start the instance either by stopping & starting it again or by running "sudo reboot". 
    
    After reboot, run "pm2 list", this will show that the "express-api" & "workers" are running


11. To Auto-Start the docker, then follow the below process. THIS STEP IS REQUIRED.

      i. cd docker-compose

      ii. nano docker-compose.yml

      For EACH service, add =>  "restart: unless-stopped"

      Example: 
          services:
          temporal:
            image: temporalio/auto-setup
            restart: unless-stopped // here
        
          postgres:
            image: postgres
            restart: unless-stopped // here
        
          temporal-ui:
            image: temporalio/ui
            restart: unless-stopped // here
       
      IF YOU DO NOT WANT TO WRITE LIKE THIS, then copy paste this file (./docker-compose.yml) file into the docker-compose.yml file in the instance.
      
      iii. Recreate the containers

        -> docker-compose down
        -> docker-compose up -d

    To Verify, run "sudo reboot", then after re-connecting, the express-server and temporal-worker is up and running.



12. Add CloudWatch Monitoring Logs

   i. Create a IAM Role

   ii. Go to IAM Servie, Click "Create Role" -> "Trusted Entity Type" -> AWS Service -> Use Case -> EC2 -> Click Next 

   iii. Add a policy to the role -> CloudWatchLogsFullAccess

   iv. Give a name to the role like "MyTemporalCloudWatchRole"

   v. Add this newly created role to EC2 Instance by using Instance Settings

   vi. Download CloudWatch Agent inside the instance by running this command -- wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

   vii. Install the agent by running -- sudo dpkg -i amazon-cloudwatch-agent.deb

   viii. Fix Any Missing Dependencies -- sudo apt-get install -f -y

   Verify the Status of CloudWatch Agent -- /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a status

   Output shows like this:: 

      /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a status
        {
          "status": "stopped",
          "starttime": "",
          "configstatus": "not configured",
          "version": "1.300064.1b1344"
        }
        

    ix. Run the Cloudwatch config wizard -- sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
    
       Now this asks, lot of questions like

       a. OS - linux
       b. Collect Metrics - NO
       c. CollectorD - NO
       d. Existig Cloudwatch Agent - NO

    Save it. IF THIS "ix" step doesnt work then do this. THIS WILL DEFINITELY WORK
    
    x. Run -> sudo nano /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json

    and paste this JSON inside that
    
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/home/ubuntu/.pm2/logs/*.log",
            "log_group_name": "temporal-app-logs",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
}

   
   Save the file and then run this command

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
-a fetch-config \
-m ec2 \
-c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
-s

This gives the output

{
  "status": "running",
  "configstatus": "configured"
}

Now, when you do the workflow start or approve anything, all of the logs will be appear in cloudwatch logs with name "temporal-app-logs"



SUCCESS - If Every Step is done, then you have deployed temporal and banking-system in cloud. IF you want to test this, 
then open, banking-system-app in local machine and update the URL in frontend/constants/URLs.ts file to this

// export const BASE_SERVER_URL = 'http://localhost:3001/api';
export const BASE_SERVER_URL = 'http://<EC2_PUBLIC_IP>:3001/api';

Now, Everything works perfectly fine

 */
