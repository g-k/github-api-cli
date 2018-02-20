#!/usr/bin/env node

const octokit = require('@octokit/rest')();
const yargs = require('yargs');

yargs.boolean('verbose');
yargs.boolean('debug');  // no json output to see debug messages

yargs.command('get <service> <method> [method_args..]', 'fetch a resource', (yargs) => {
    yargs.positional('service', {
	describe: 'the octokit service to hit (activity, search, etc.)',
	type: 'string'
    });
    yargs.positional('method', {
	describe: 'the octokit method to use (e.g. code for search.code)',
	type: 'string'
    });
});


let args = yargs.argv;
args.method_args_obj = args.method_args.reduce((acc, arg) => {
    let [opt_key, opt_val] = arg.split('=');
    acc[opt_key] = opt_val;
    return acc;
}, {});

if (args.verbose) {
    console.debug('parsed args:', args);
}

if (process.env.GITHUB_TOKEN) {
  if (args.verbose) {
    console.debug('Authenticating with PAT');
  }

  octokit.authenticate({
    type: 'token',
    token: process.env.GITHUB_TOKEN
  });
}


// TODO: handling combining pages on non items keys
async function paginate (method, options) {
  let response = await method(options);
  let {data} = response;
  while (octokit.hasNextPage(response)) {
    response = await octokit.getNextPage(response);
    if (args.verbose) {
      console.debug('Got next page with items:', response.data.items.length);
    }
    data.items = data.items.concat(response.data.items);
  }
  return data;
}


paginate(octokit[args.service][args.method], args.method_args_obj).then((result) => {
  if (args.verbose) {
    console.debug('Total items:', result.items.length);
  }
  if (!args.debug) {
    process.stdout.write(JSON.stringify(result, null, 2));
  }
});
