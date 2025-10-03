const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
const serversRoute = require('./routes/servers');
const nodesRoute = require('./routes/nodes');
const domainsRoute = require('./routes/domains');

app.use('/api/servers', serversRoute);
app.use('/api/nodes', nodesRoute);
app.use('/api/domains', domainsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Ravens Panel backend running on port ${PORT}`));
