'use strict'

const electron = require('electron')
const path = require('path')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const apiRequests = require('superagent')

let authWindow
let github = {
  client_id: 'b268f546f637c3d7f4c6',
  client_secret: '65583dd43d42cfcd5604e37d9caf19139020440a',
  scopes: ["user:email", "notifications", "repo"] // Scopes limit access for OAuth tokens.
}

function auth(mainWindow){

  /*
   * Github authenticate window options
   */
  authWindow = new BrowserWindow({
    width: 480,
    height: 640,
    show: false,
    'node-integration': false,
    animate: true
  });

  let githubUrl = 'https://github.com/login/oauth/authorize?'
  let authUrl = `${githubUrl}client_id=${github.client_id}&scope=${github.scopes}`

  /*
   * For github mobile view
   */
  let userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
  authWindow.webContents.setUserAgent(userAgent);

  authWindow.loadURL(authUrl);
  authWindow.show();

  authWindow.webContents.on('will-navigate', (event, url) => {
    handleCallback(url);
  });

  authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
    handleCallback(newUrl);
  });

  authWindow.on('close', () => {
    authWindow = null;
  }, false);


  function requestGithubToken(code) {

    /*
     * Get github access token
     */
    apiRequests
      .post('https://github.com/login/oauth/access_token', {
        client_id: github.client_id,
        client_secret: github.client_secret,
        code,
      })
      .end((err, response) => {
        if (response && response.ok) {

          let accessToken = response.body.access_token;

          mainWindow.webContents.send('storage', accessToken );

          /*
           * Get github user data
           */
          apiRequests
            .get(`https://api.github.com/user?access_token=${accessToken}`)
            .end((err, response) => {
              if (response && response.ok) {

                mainWindow.webContents.send('userData', response.body );

                /*
                 * Sign in to github service on herokuapp
                 */
                apiRequests
                .post('https://github-service.herokuapp.com/api/signin', {
                  access_token : accessToken,
                  github: response.body
                })
                .end((err, response) => {
                  if (response && response.ok) {
                    mainWindow.webContents.send('bearer', response.body.data );
                    mainWindow.webContents.send('dashboard');
                    mainWindow.setSize(1000, 800)
                    mainWindow.center();
                  }
                  else {
                    console.log(err);
                  }
                });
              } else {
                console.log(err);
              }
            })

        } else {
          console.log(err);
        }
      });

  }

  function handleCallback (url) {
    const raw_code = /code=([^&]*)/.exec(url) || null;
    const code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
    const error = /\?error=(.+)$/.exec(url);

    if (code || error) {
      setImmediate(() => {
        authWindow.close();
      });
    }

    // If there is a code, proceed to get token from github
    if (code) {
      console.log(code)
      requestGithubToken(code);
    } else if (error) {
      alert('Oops! Something went wrong and we couldn\'t' +
        'log you in using Github. Please try again.');
    }
  }

}


module.exports.auth = auth;
