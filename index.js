// Import a module
const http = require('http')
const handles = require('./handles')

const server = http.createServer(handles.serverHandle);
server.listen(8082)

// curl localhost:8080 or go to http://localhost:8080
