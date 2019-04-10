function Commander() {
  this.innerVersion = '';
  this.options = new Map();
}

Commander.prototype.version = function(version) {
  this.innerVersion = version;
  return this;
}

Commander.prototype.option = function(opt, desc) {
  const [sopt, lopt] = opt.replace(/ /, '').split(',');

  const transform = param => param.replace('--', '').replace(/-(\w)/, (p, c) => c.toUpperCase())

  const data = {
    id: transform(lopt),
    sopt,
    lopt,
    desc,
    value: null
  };

  this.options.set(sopt, data);
  this.options.set(lopt, data);

  return this;
}

Commander.prototype.parse = function(argv) {
  const args = argv.slice(2);
  const indexs = [];

  args.forEach((arg, index) => {
    if (/^-/.test(arg)) {
      indexs.push(index);
    }
  });

  indexs.push(args.length);

  for (let i = 0; i < indexs.length - 1; i++) {
    const pos = indexs[i];
    const arg = args[pos];

    let value = [];
    if (pos + 1 < indexs[i + 1]) {
      value = args.slice(pos + 1, indexs[i + 1]);
    }

    const data = this.options.get(arg);
    if (data) {
      data.value = value;
    }
  }

  for (const opt of this.options.values()) {
    this[opt.id] = opt.value && opt.value.length === 1 ? opt.value[0] : opt.value;
  }
}

module.exports = new Commander;
