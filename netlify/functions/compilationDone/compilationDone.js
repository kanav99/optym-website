const process = require('process');
const fetch = require('node-fetch');

const { GITHUB_TOKEN } = process.env;
const branch = 'gh-pages';
const registry = 'optymtech/reachci';

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

  let answer = false;
  data2.tree.forEach(element => {
    if (element.path == domain) {
      answer = true;
    }
  });

  var content = '';
  if (answer) {
    const response3 = await fetch(
      `https://api.github.com/repos/${registry}/contents/${domain}/build/index.main.mjs?ref=gh-pages`,
      {
        method: 'GET',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data3 = await response3.json();
    content = data3.content;
  }

  return { complete: answer, content };
};

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async event => {
  const { domain } = JSON.parse(event.body);
  const resp = await checker(domain);
  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
};
module.exports = { handler };
