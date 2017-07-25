'use strict';

const http = require('http');
const url = require('url');
const queryString = require('querystring');
const cowsay = require('cowsay');
const parseBody = require('./lib/parse-body.js');
const PORT = process.env.PORT || 3000;

const server = http.createServer(function(req, res) {
  req.url = url.parse(req.url);
  req.url.query = queryString.parse(req.url.query);

  if(req.method === 'POST') {
    parseBody(req, function(err) {
      if(err) return console.error(err);
      if(req.body.text) {
        res.writeHead(200, { 'Content-Type': 'text/plain'});
        res.write(cowsay.say({ text: req.body.text }));
      } else {
        res.writeHead(400);
        res.write(cowsay.say({ text: 'bad request'}));
      }
    });
  }

  if(req.method === 'GET' && req.url.pathname === '/cowsay') {
    let params = req.url.query;

    if(params.text){
      res.writeHead(200, { 'Content-Type': 'text/plain'});
      res.write('hello from my server!');
      res.write(cowsay.say({ text: params.text }));
    } else if(params.text != 'string') {
      res.writeHead(400);
      res.write(cowsay.say({ text: 'bad request'}));
    }
    res.end();
  }

  if(req.url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain'});
    res.write('hello from my server!');
    res.end();
  }
});

server.listen(PORT, function() {
  console.log('server:', PORT);
});
