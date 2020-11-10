# cmpt470-project

## 470 - Frontend 

### Environment Variables Setup

To ensure that the frontend works with the backend, we need to ensure that the proper environment variables are set.

1. Navigate to `./cmpt470-project/frontend`
2. Make a new file called `.env`
3. Populate the `.env` file with the following:

    ```javascript
    REACT_APP_BACKEND = http://localhost:8080
    ```
    > the prefix of `REACT_APP_` is necessary so that React can properly detect environment variables

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

## 470 - Spotify Authentication Setup 
To log in with Spotify, we need to run the node server inside the /auth_server/authorisation_code folder. 
1. Run this command in the cmpt470-project folder: 
    ```bash
    node .\auth_server\authorization_code\app.js
    ```
If you do not have a Spotify account to use, you can test the app with these credentials:  
Username: jbaltar@sfu.ca  
Password: cmpt470470  


## 470 - Backend Setup (Windows)

### Google Cloud SDK Installation and Running the Database Proxy

To be able to properly run the node server, we need to ensure that the database will properly connect. In this case, we need to ensure that the Google Cloud SDK is properly intalled in your local computer, you are authenticated to use the project, and that you have downloaded and ran the proxy of the database.

1. If the Google Cloud SDK is already installed and authenticated, skip to Step 4.
2. Go to [the Google Cloud SDK installation](https://cloud.google.com/sdk/docs/install) to install. 
3. Authenticate with the Google Cloud SDK.
4. Download [the cloud proxy for the database](https://cloud.google.com/sql/docs/postgres/connect-admin-proxy), following "Step 2. Install the proxy". Keep track of where you have placed the executable file.
5. Use the Google SDK terminal and go to the folder where you have downloaded the proxy. 
6. On the Google SDK terminal, run the following command:
    ```bash
    cloud_sql_proxy -instances=cmpt470-proj:northamerica-northeast1:cmpt470db=tcp:5431
    ```
    If done properly, the following should be the output:
    ```bash
    2020/10/29 16:29:30 Listening on 127.0.0.1:5431 for cmpt470-proj:northamerica-northeast1:cmpt470db
    2020/10/29 16:29:30 Ready for new connections
    ```

    To terminate the connection, run the command: 
    ```bash
    ctrl + c
    ```
7. You can now run the server while the database is properly connected.

### Running the Backend Server Locally

1. Ensure that the database proxy is properly running. If not, refer to **Google Cloud SDK Installation and Running the Database Proxy**
2. Using a terminal/console, go to `cmpt470-project/server` and type the following command to install all dependencies for the server:
    ```bash
    npm install
    ```
3. Create a `.env` file in `cmpt470-project/backend`, ensuring that the following environment variables are set:

    ```javascript
    DB_USER = <populate username>
    DB_PASS = <populate password>
    DB_NAME = <populate database name>
    DB_HOST = 127.0.0.1:5432
    BACKEND_PORT = 8080
    BACKEND_REDIRECT = http://localhost:8080
    FRONTEND_REDIRECT = http://localhost:3000
    ```
3. To run the server using Typescript: `npm run dev`. To build the Typescript into Javascript: `npm run build`. To run the Javascript after building: `npm start`.

    To terminate the server, run the command:
    ```bash
    ctrl + c
    ```

### Testing the Backend Server with the Database

> To be determined, but right now, a valid output from the console would look like such

```bash
/api called
{ attr1: 'test' }
value of attribute in request is test
┌─────────┬───────────┬─────────────┬────────────────────┐
│ (index) │ group_uid │ group_name  │    description     │
├─────────┼───────────┼─────────────┼────────────────────┤
│    0    │    '1'    │ 'testGroup' │ 'some description' │
└─────────┴───────────┴─────────────┴────────────────────┘
```

Also, in the browser, there should be an alert saying `successful post`.

###Libraries


- Express (framework to make middleware)
- Cors (allows to make http requests to and from react and node)
- Pg (Postgres)
