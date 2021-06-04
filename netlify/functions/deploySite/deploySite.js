// // optionally configure local env vars
// require('dotenv').config()

// // details in https://css-tricks.com/using-netlify-forms-and-netlify-functions-to-build-an-email-sign-up-widget
const process = require('process');
const fetch = require('node-fetch');

const { GITHUB_TOKEN } = process.env;
const branch = 'main';
const registry = 'optymtech/registry';

const checker = async domain => {
  if (
    ['demo', 'example', 'imap', 'pop', 'smtp', 'webmail', 'www'].includes(
      domain
    )
  ) {
    return false;
  }

  const response1 = await fetch(
    `https://api.github.com/repos/${registry}/commits/${branch}`,
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
    `https://api.github.com/repos/${registry}/git/trees/${data1.commit.tree.sha}`,
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
    `https://api.github.com/repos/${registry}/git/trees/${sha}`,
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

const deploy = async (domain, siteConfig) => {
  const response = await fetch(
    `https://api.github.com/repos/${registry}/contents/subdomains/${domain}.json`,
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
            repository: 'https://github.com/optymtech/optym',
            commands: ['npm install', 'npm run build'],
            directory: 'build',
            siteConfig: siteConfig,
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
  const { domain, siteConfig } = JSON.parse(event.body);
  const check = await checker(domain);

  if (check) {
    return await deploy(domain, siteConfig);
  } else {
    return { statusCode: 400, body: 'domain taken' };
  }
};

module.exports = { handler };
