TO RUN THE PROJECT IN LOCAL
    - npm run dev (frontend)
    - npm run start (backend)
    - sudo docker run --name=vartur_mysql -e MYSQL_ROOT_PASSWORD=admin -d mysql:latest (docker)



WHAT HAVE DONE;
BACKEND
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
    sudo docker run --name=vartur_mysql -e MYSQL_ROOT_PASSWORD=admin -d mysql:latest
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

- create routes directory for category & product & photo routes to comminucate with frontend easily
- create controllers directory for category & product & photo
- create uploads directory folder for photos created by MULTER (also resize by SHARP in Backend)

FRONTEND
- create a frontend directory and install vue
    npm create vue@latest (then selecting necessary options)
    npm install
    npm run dev
- 3 pages created via vue-router(Even though there's a 3 pages, I combined Product & Category into FormItem.vue): 
    1.Index
        mainpage
        list of products & categories
    2.FormProduct
        page for adding and editing product
    3.FormCategory
        page for adding and editing category
- 2 components
    CategorySelect.vue
        select box for showing nested categories
    TableRowCat
        category list in the mainpage




POSTMAN API
    - https://api.postman.com/collections/21517592-9593aa1c-4c38-4a71-9e98-92d054075b7f?access_key=PMAT-01HAH0B0TC8S45H7S7J5BVBA5P

    - https://elements.getpostman.com/redirect?entityId=21517592-9593aa1c-4c38-4a71-9e98-92d054075b7f&entityType=collection
