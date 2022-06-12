const http = require('http');
const PORT = 3000;
const friends = [
    {
        id: 0,
        name: 'Thomas'
    },
    {
        id: 1,
        name: 'Edmund'
    },
    {
        id: 2,
        name: 'James'
    }
]
const server = http.createServer((req, res) => {
    const items = req.url.split('/');
if (req.method === 'POST' && items[1] === 'friends'){
req.on('data', (data) => {
    const friend = data.toString();
    console.log('Request:', friend);
    friends.push(JSON.parse(friend));
});
req.pipe(res);
}else if (req.method === 'GET' && items[1] === 'friends') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    if (items.length === 3){
        const frinedIndex = Number(items[2]);
        res.end(JSON.stringify(friends[frinedIndex]));
    } else {
        res.end(JSON.stringify(friends));
    }
    
} else if (req.method === 'GET' && items[1] === 'messages'){
    res.setHeader(
        'Content-Type',
        'text/html'
        );
    res.write('<html>');
    res.write('<body>');
    res.write('<ul>');
    res.write('<li><h3>Hello</h3></li>');
    res.write('<li><h4>My friend</h4></li>');
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
}else {
    res.statusCode = 404;
    res.end();
}
});
server.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}...`);
});