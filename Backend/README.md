- create a folder named: 
    vartur_assignment
- open it with vscode
- go to its terminal and type
    npm init -y
- install fastify and typescript with their dependencies:
    npm install fastify fastify-cors typescript @types/node
- add following to the scripts section of te package.json:
    "build": "tsc -p tsconfig.json",
    "start": "node index.js"
- initialize typescript configuration:
    npx tsc --init
- set target property in tsconfig.json to es2017 or greater
- create an index.ts file 
- compile index.ts into index.js
    npm run build
- run the Fastify server
    npm run start

- install docker dependencies:
    sudo apt install apt-transport-https ca-certificates curl software-properties-common
- add the Docker GPG key:
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
- add the Docker repository:
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
- install docker:
    sudo apt install docker-ce docker-ce-cli containerd.io
- start the Docker service and enable it to start on boot:
    sudo systemctl start docker
    sudo systemctl enable docker

- run MySQL in Docker:
    sudo docker pull mysql:latest
- run a MySQL container 
    sudo docker run --name=vartur_mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:latest
- verify that the MySQL container is running
    sudo docker ps
- after that, i granted all privileges to my user

- install prisma
    npm install -g prisma
    prisma init
- after configuring mysql url to prisma, i created Category and Product models in prisma
- generate prisma client
    prisma generate
- create db migration
    prisma migrate dev --name init


