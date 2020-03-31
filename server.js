'use strict';

const express = require('express'); 
const app = express();
const bodyParser = require('body-parser');

const [ mssqlClient, mysqlClient ] = [ 
    './mssqlClient',
    './mysqlClient'
].map(require);

app.use(express.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());

// routes
app.post('/db-api/mssql', mssqlClient.requestHandler);
app.post('/db-api/mysql', mysqlClient.requestHandler);

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
// Port can be passed as first CLI argument.
const args = process.argv.slice(2);
const port = args[0] ? args[0] : 1111;

app.listen(port, () =>
    console.log(`db-api server listening at http://localhost:${port}/db-api`)
);
