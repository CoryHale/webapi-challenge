const express = require('express');

const projectRouter = require('./routes/ProjectRouter');
const actionRouter = require('./routes/ActionRouter');

const server = express();

server.use(express.json());
server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);

server.get('/', (req, res) => {
    res.send(`<h1>Let's get started!</h1>`)
});

server.listen(4000, () => {
    console.log('server listening on port 4000');
})
