// // optionally configure local env vars
// require('dotenv').config()

// // details in https://css-tricks.com/using-netlify-forms-and-netlify-functions-to-build-an-email-sign-up-widget
const process = require('process');

const fetch = require('node-fetch');

const { GITHUB_TOKEN } = process.env;
const branch = 'main';

const checker = async domain => {
  if (
    ['demo', 'example', 'imap', 'pop', 'smtp', 'webmail', 'www'].includes(
      domain
    )
  ) {
    return false;
  }

  const response1 = await fetch(
    `https://api.github.com/repos/kanav99/netlify-autodeploy/commits/${branch}`,
    {
      method: 'GET',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const data1 = await response1.json();

  const response2 = await fetch(
    `https://api.github.com/repos/kanav99/netlify-autodeploy/git/trees/${data1.commit.tree.sha}`,
    {
      method: 'GET',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const data2 = await response2.json();

  let answer = true;
  let sha = '';
  data2.tree.forEach(element => {
    if (element.path == 'subdomains') {
      sha = element.sha;
    }
  });

  const response3 = await fetch(
    `https://api.github.com/repos/kanav99/netlify-autodeploy/git/trees/${sha}`,
    {
      method: 'GET',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const data3 = await response3.json();

  data3.tree.forEach(e => {
    if (e.path == domain + '.json') {
      answer = false;
    }
  });

  return answer;
};

const deploy = async domain => {
  const response = await fetch(
    `https://api.github.com/repos/kanav99/netlify-autodeploy/contents/subdomains/${domain}.json`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add subdomain ${domain}`,
        content: Buffer.from(
          JSON.stringify({
            repository: 'https://github.com/kanav99/optym',
            commands: ['npm install', 'npm run build'],
            directory: 'build',
          })
        ).toString('base64'),
        branch: branch,
      }),
    }
  );

  console.log(await response.text());
  console.log(response.status);
  if (response.status === 201) {
    return { statusCode: 200, body: 'ok' };
  } else {
    return { statusCode: 400, body: `not ok` };
  }
};

const handler = async event => {
  console.log(event.body);
  const { domain } = JSON.parse(event.body).payload.data;
  const check = await checker(domain);

  if (check) {
    return await deploy(domain);
  } else {
    return { statusCode: 400, body: 'domain taken' };
  }
};

module.exports = { handler };
