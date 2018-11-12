'use strict';

// just to get something online quickly

const fs = require('fs');
const express = require('express'); // express makes request handling nice and boring
const app = express();

app.set('view-engine', 'ejs');

// in the html, 'assets' is an alias for the 'public' folder
app.use('/assets', express.static(`${__dirname}/public`));

// the data viewer, for internal testing
app.get('/data_viewer', (req, res) => {
  res.sendFile(`${__dirname}/public/data_viewer.html`);
});

// says 'no matter the request, serve back the index page'
app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

// server listens on port X (set to 80 for http requests, but we'll put nginx there)
const port = process.env.PORT || 9000;
app.listen(port);
