const express = require('express'); 
const app = express();
const bodyParser = require('body-parser');

const [ mssqlClient, mysqlClient ] = [ 'mssql', 'mysql' ].map(require);

app.use(express.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());

const returnMssqlQueryResult = async (sqlConfig, query, res) => {   

    console.log(
        `\nmssqlConfig: ${JSON.stringify(sqlConfig, null, 2)}`    
        + `\nquery: \n"${query}"`);
    
    try {
        await mssqlClient.connect(sqlConfig);        
        result = await mssqlClient.query(query);
        
        res.type('json');
        res.end(JSON.stringify(result)); // Result in JSON format
    }
    catch(err){
        console.log(err);
        res.status(500).send(`Database error - ${err}`);
    }
    finally{
        await mssqlClient.close();
    }
};

const returnMysqlQueryResult = (sqlConfig, query, res) => {   

    console.log(
        `\nmysqlConfig: ${JSON.stringify(sqlConfig, null, 2)}`    
        + `\nquery: \n"${query}"`);
    
    try {
        const connection = mysqlClient.createConnection(sqlConfig);        
        connection.connect(err => {
            if (err) {
                console.log(err);
                res.status(500).send(`Database error - ${err}`);
                return;
            }
            connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(`Database error - ${err}`);
                    return;
                };
                res.type('json');
                res.end(JSON.stringify(result)); // Result in JSON format
            });
        });               
    }
    catch(err){
        
    }    
};

// routes
app.post('/db-api/mssql', (req, res) => {
    if (req.headers['content-type'] != 'application/json'){ 
        res.status(500).send('Only JSON is supported!');
        return false;
    }
    else{
        const { query, mssqlConfig } = req.body;
        returnMssqlQueryResult(mssqlConfig, query, res);
   }
});

app.post('/db-api/query', (req, res) => {
    if (req.headers['content-type'] != 'text/plain'){ 
        res.status(500).send('Only TEXT is supported!');
        return false;
    }
    else{
        res.send(req.body);
   }
});

app.post('/db-api/mysql', (req, res) => {
    if (req.headers['content-type'] != 'application/json'){ 
        res.status(500).send('Only JSON is supported!');
        return false;
    }
    else{
        const { query, mysqlConfig } = req.body;
        returnMysqlQueryResult(mysqlConfig, query, res);
   }
});

// Start server and listen on http://localhost:1111/ by default.
// Port can be passed as first CLI argument.
const args = process.argv.slice(2);
const port = args[0] ? args[0] : 1111;

const server = app.listen(port, () =>
    console.log(`db-api server listening at http://localhost:${port}/db-api`)
);

