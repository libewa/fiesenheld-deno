var http = require('http');

http
  .createServer(function (req, res) {
    res.write(`Trust me, I'm still alive. Now visit https://discord.com/api/oauth2/authorize?client_id=1049397374952419368&permissions=380171769856&scope=bot%20applications.commands to try me out!`);
    res.end();
  })
  .listen(8080);