const https = require('https');
const http = require('http');
const url = require('url')
const open = require('open');
const Configstore = require('configstore');
const packageJson = require('../package.json');
const simpleGit = require('simple-git');

const config = new Configstore(packageJson.name);


function getOauth(params, WORKING_DIR) {
  open('https://github.com/login/oauth/authorize?client_id=a9311e26ca422636fca0&scope=user%20repo');
  let userToken;
  const server = http.createServer()
  server.listen(7485);
  server.on("request", (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<script>window.close();</script>')
    res.end()
    server.close();
    if (url.parse(req.url, true).query.code) {
      userToken = url.parse(req.url, true).query.code;
      config.set({
        code: userToken
      });
      getData(userToken, params, WORKING_DIR);
    }
  });
}

function getData(code, params, WORKING_DIR) {
  const options = {
    host: 'github.com',
    path: `/login/oauth/access_token?client_id=a9311e26ca422636fca0&client_secret=2ccf482e78c67f80b143c41f9ec1d9b1abb00347&code=${code}`,
    Accept: 'application/json'
  }
  https.get(options, (res) => {
    let data = ''

    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      data = data.split('&');
      dataArr = [];
      data.forEach(obj => {
        dataArr.push(obj.split('='))
      });
      resData = {};
      dataArr.forEach(obj => {
        resData[obj[0]] = obj[1];
      })

      config.set({
        token: resData.access_token
      });
      createRepo(resData.access_token, params, WORKING_DIR);

    })
  }).on("error", (error) => {
    console.log("Error: " + error.message);
  });
}

function createRepo(token, params, WORKING_DIR) {
  const body = JSON.stringify({
    "name": params.name,
    "description": params.description,
    "private": false,
  });
  const options = {
    host: 'api.github.com',
    path: '/user/repos',
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'User-Agent': 'esize',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
    },
  };
  let response;
  const req = https.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      response += chunk;
    });
    res.on('end', () => {
      let parsed = JSON.parse(response.replace('undefined', ''));
      const git = simpleGit(WORKING_DIR);
      git.init()
        .outputHandler((command, stdout, stderr) => {
          stdout.pipe(process.stdout);
          stderr.pipe(process.stderr);
        })
        .add('./*')
        .commit("Initial commit with project")
        .addRemote('origin', parsed.clone_url)
        .push(['-u', 'origin', 'master'], () => open(parsed.html_url));
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  // Write data to request body
  req.write(body);
  req.end();
}

module.exports = {
  getOauth,
  createRepo
}
