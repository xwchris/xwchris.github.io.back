// combine
const combine = (...fns) => fns.reduce((a, b) => (...args) => b(a(...args)));

module.exports.combine = combine;
