/**
 * a simple template engine by xwchris
 *
 * syntax supports <% %> and <%= %>
 */


function templateEngine(tpl) {
  return function (data) {
    const reg1 = /<%(.+)?%>/g;
    const reg2 = /<%=(.+)?%>/;
    const reg3 = /if|else|for|while|break|continue|switch|{|}/;
    let code = 'var r = [];\n';
    let cursor = 0;
    let match;

    const addCode = (line, isJS) => isJS ? (reg3.test(line) ? `${line}\n` : `r.push(${line});\n`) : `r.push("${line.replace(/"|'/g, '\\"')}");\n`;

    while (match = reg1.exec(tpl)) {
      code += addCode(tpl.slice(cursor, match.index));
      code += addCode(reg2.test(match[0]) ? reg2.exec(match[0])[1] : match[1], true);
      cursor = match.index + match[0].length;
    }
    code += addCode(tpl.slice(cursor, tpl.length));
    code += 'return r.join("");';
    code = code.replace(/\n/g, '');

    const args = Object.keys(data).join(',');
    return new Function (args, code)(...Object.values(data));
  }
}

module.exports = templateEngine;
