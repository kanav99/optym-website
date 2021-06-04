const process = require('process');
const fetch = require('node-fetch');

const { GITHUB_TOKEN } = process.env;
const branch = 'main';
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

  let answer = true;
  let sha = '';
  data2.tree.forEach(element => {
    if (element.path == 'src') {
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
    if (e.path == domain + '.js') {
      answer = false;
    }
  });

  return answer;
};

const compile = async (domain, code) => {
  const response = await fetch(
    `https://api.github.com/repos/${registry}/contents/src/${domain}.js`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add Code ${domain}`,
        content: Buffer.from(code).toString('base64'),
        branch: branch,
      }),
    }
  );

  if (response.status === 201) {
    let obj = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'ok',
        pollId: obj.commit.sha,
      }),
    };
  } else {
    return { statusCode: 400, body: JSON.stringify({ message: 'not ok' }) };
  }
};
// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async event => {
  console.log(event.body);
  const { domain, code } = JSON.parse(event.body);
  const check = await checker(domain);

  if (check) {
    return await compile(domain, code);
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'domain taker' }),
    };
  }
};
module.exports = { handler };
