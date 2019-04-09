'use strict';

const fs = require('fs');
const path = require('path');
const tjs = require('../src/utils/templateEngine');

// combine
const combine = (...fns) => fns.reduce((a, b) => (...args) => b(a(...args)));

// 格式化数据
function formatData(data) {
  return data.map(item => {
    const newItem = { ...item };
    let index = 0;
    newItem.date = 'yyyy-mm-dd'.replace(/[^-]/g, () => newItem.id[index++]);
    newItem.tags = newItem.tags || [];
    if (Array.isArray(newItem.data)) {
      newItem.data = newItem.data.map(dataItem => ({
        ...dataItem,
        link: dataItem.link ? [].concat(dataItem.link) : [],
      }))
    }
    return newItem;
  });
}

// 根据时间降序排列
function sortByDate(data) {
  const time = item => new Date(item.date).getTime();

  return data.sort((a, b) => time(b) - time(a));
}

// 生成最终html
function generateHTML(data) {
  const itemTemplate = `
    <li class="timeline-item">
      <h3 class="item-date"><%= data.date %></h3>
      <div class="tags">
        <% for (const tag of data.tags) { %>
          <span class="tag"><%= tag %></span>
        <% } %>
      </div>
      <ul class="item-data">
        <% for (const item of data.data) { %>
          <li class="data-li">
            <span class="li-title"><%= item.name %></span>
            <% for (const link of item.link) { %>
              <a class="li-link" href="<%= link %>" target="_blank">相关链接</a>
            <% } %>
          </li>
        <% } %>
      </ul>
    </li>
  `;

  const listTemplate = `<ul>${data.map(item => tjs(itemTemplate)({ data: item })).join("")}</ul>`;
  const html = fs.readFileSync(path.join(__dirname, '../src', 'template.html'), 'utf8');

  return tjs(html)({ template: listTemplate });
}

function formatHTML(html) {
  return html.replace(/>\s+</g, '><');
}

// // 主函数
function main() {
  const data = require('../data');
  const html = combine(formatData, sortByDate, generateHTML, formatHTML)(data);

  const filename = path.join(__dirname, '..', 'index.html');

  console.log('[generate]', 'start writing file');
  fs.writeFile(filename, html, 'utf8', (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('[generate]', 'finish to write file => index.html');
    }
  })
}

main();

module.exports = main;
