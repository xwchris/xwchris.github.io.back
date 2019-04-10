#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const commander = require('../utils/commander');
const data = require('../data');
const combine = require('../utils/common').combine;

// command set
commander
  .version('1.0.0')
  .option('-d, --date', 'the date wanted to add')
  .option('-l, --link', 'links of item to add')
  .parse(process.argv);

function formatDate(date) {
  const d = date ? new Date(date) : new Date;

  const transform = str => (0 + String(str)).substr(-2, 2);

  return `${d.getFullYear()}${transform(d.getMonth() + 1)}${transform(d.getDate())}`
}

function createItem(commander) {
  let { date, args, link } = commander;
  const name = args && args.length > 0 ? args[0] : '';

  date = formatDate(date);

  return {
    id: date,
    data: [{ name, link }]
  }
}

function add(item) {
  let nextItem = data.find(t => t.id === item.id);

  if (nextItem) {
    nextItem.data = nextItem.data.concat(item.data);
  } else {
    data.push(item);
  }

  return data;
}

function main() {
  const data = combine(createItem, add)(commander);

  const filename = path.join(__dirname, '../data/index.js');

  const str = `module.exports = ${JSON.stringify(data)}`;

  fs.writeFile(filename, str, 'utf8', (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('[add]', 'add new item success');
    }
  });
}

main();

module.exports = main;
