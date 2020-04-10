'use strict';

const express = require('express'); 
const app = express();
const bodyParser = require('body-parser');

const [ mssqlClient, mysqlClient, postgresClient ] = [ 
    './mssqlClient',
    './mysqlClient',
    './postgresClient'
].map(require);

app.use(express.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());

const home = (req, res) => {
    const postmanUrl = 
        `https://github.com/danrusu/db-api/blob/master/postman/db-api.postman_collection.json`
    const homeText = `<h3>This is a back-end REST project.</h3>`
        + `<br> For usage info check this <a href="${postmanUrl}">Postman collection<a>.`;
    res.send(homeText);
}

// routes
app.get('/', home);
app.post('/db-api/mssql', mssqlClient.requestHandler);
app.post('/db-api/mysql', mysqlClient.requestHandler);
app.post('/db-api/postgres', postgresClient.requestHandler);


app.post('/db-api/query', (req, res) => {
    if (req.headers['content-type'] != 'text/plain'){ 
        res.status(500).send('Only TEXT is supported!');
        return false;
    }
    else{
        res.send(req.body);
   }
});

// Start server and listen on http://localhost:1111/ by default.
const port = process.env.PORT || 1111;

app.listen(port, () =>
    console.log(`db-api server listening at http://localhost:${port}/db-api`)
);
