// ./handles.js
// Necessary imports

const url = require('url')
const qs = require('querystring')

const rootContent = '<!DOCTYPE html>' +
    '<html>' +
    '    <head>' +
    '        <meta charset="utf-8" />' +
    '        <title>Hello!</title>' +
    '    </head>' +
    '    <body>' +
    '         <h1>Hello!</h1>' +
    '           <p>Enter the /hello route with a name parameter to be greeted</p>' +
    '           <p>E.g. /hello?name=anonymous</p>' +
    '           <p>Enter the /hello?name=jose route to know more about the developer</p>' +
    '    </body>' +
    '</html>'

const helloContent = '<!DOCTYPE html>' +
    '<html>' +
    '    <head>' +
    '        <meta charset="utf-8" />' +
    '        <title>Hello!</title>' +
    '    </head>' +
    '    <body>' +
    '         <h1>Hello!</h1>' +
    '           <p>My name is José Alberto, but you may call me José. ' +
    '           I\'m a B.S. in Computer Science and Technology student at ' +
    '           Tecnológico de Monterrey, at Mexico City, Mexico. I\'m currently' +
    '            studying at ECE Paris and I\'m so thrilled to be here for a lot of reasons.</p>' +
    '    </body>' +
    '</html>'

module.exports = {
    serverHandle: function (req, res) {
        const route = url.parse(req.url)
        const path = route.pathname
        const params = qs.parse(route.query)

        res.writeHead(200, {'Content-Type': 'text/plain'});

        if (path === '/') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(rootContent);
        } else if (path === '/hello' && params['name'] === 'jose') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(helloContent);
        } else if (path === '/hello' && 'name' in params){
            res.write('Hello ' + params['name']);
        } else if (path === '/hello') {
            res.write('Hello anonymous');
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write('Sorry. Page not found.');
        }
        res.end();
    }
}