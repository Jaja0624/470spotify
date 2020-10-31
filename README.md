# cmpt470-project

## 470 - Frontend 

### Component Directory
> TBD when we start building more components

Libraries
- React (Typescript) [Tutorial](https://www.youtube.com/watch?v=Z5iWr6Srsj8)
- [Zustand](https://github.com/pmndrs/zustand) (State Management) 
- React Router Dom (Client side routing)
- Material-UI (UI/styles library)
- Axios (allows to make http requests)
- `Testing TBD`

- Axios (allows for http requests)

## 470 - Backend (All steps done in Windows)

Libraries
- Express (framework to make middleware)
- Cors (allows to make http requests to and from react and node)
- Pg (Postgres)

> To be able to properly run the node server, we need to ensure that the db will properly connect. In this case, we need to make sure that the google cloud sdk is installed in your local computer, you are authenticated to use the project, and that you have downloaded, and ran the proxy.

Steps prior to running the node server:
1. If you have not yet installed the Google Cloud SDK to your local computer, go to this link: https://cloud.google.com/sdk/docs/install . This will allow you to authenticate with Google Cloud Platform so that you can properly authenticate when using the proxy.

2. Follow step (2) in the link : https://cloud.google.com/sql/docs/postgres/connect-admin-proxy to download the proxy. 

3. Use the Google SDK terminal and go to the folder where you have downloaded the proxy

4. in the Google SDK terminal : cloud_sql_proxy -instances=cmpt470-proj:northamerica-northeast1:cmpt470db=tcp:5431. If done correctly, the following should be the output:

2020/10/29 16:29:30 Listening on 127.0.0.1:5431 for cmpt470-proj:northamerica-northeast1:cmpt470db
2020/10/29 16:29:30 Ready for new connections

5. When step 4 is executed properly, you can start running the node server with a fully functioning database connection.

> To terminate the connection with the Proxy, type ctrl + c

Steps to run the node server:
1. First, we need to ensure that we can connect to the Cloud SQL proxy. Follow "Steps prior to running the node server" if not yet done.

2. Using the terminal, go to cmpt470-project/server and type the command to install all dependencies for the server: npm install

3. To run the server using Typescript: npm run dev. To build the Typescript into javascript: npm run build. To run the Javascript after building: npm start

4. Ensure the front end server is also running.

5. Go to the browser and go to localhost:3000 to see the front end.

6. Click the 'Login' button.

7. Click the 'Logout' button.

8. The following should be the console.log of the node server:

/api called
{ attr1: 'test' }
value of attribute in request is test
┌─────────┬───────────┬─────────────┬────────────────────┐
│ (index) │ group_uid │ group_name  │    description     │
├─────────┼───────────┼─────────────┼────────────────────┤
│    0    │    '1'    │ 'testGroup' │ 'some description' │
└─────────┴───────────┴─────────────┴────────────────────┘

Also, in the browser, there should be an alert saying 'successful post'.

> To terminate the local server, type ctrl + c