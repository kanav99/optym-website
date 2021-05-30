// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const process = require('process');
const fetch = require('node-fetch');

const { GITHUB_TOKEN } = process.env;
const branch = 'main';
const registry = 'optymtech/registry';

const handler = async event => {
  const domain = event.queryStringParameters.domain;

  if (
    ['demo', 'example', 'imap', 'pop', 'smtp', 'webmail', 'www'].includes(
      domain
    )
  ) {
    return {
      statusCode: 200,
      body: JSON.stringify({ available: false }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  try {
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

    return {
      statusCode: 200,
      body: JSON.stringify({ available: answer }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
