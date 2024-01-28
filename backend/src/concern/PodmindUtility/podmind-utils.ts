
// TOOD: https://github.com/senecajs/seneca-reload/issues/1
// export default function make_podmind_utils() {

module.exports = function make_podmind_utils() {
  return function getUtils() {
    return {
      humanify,
    }
  }
}


function humanify(when: number) {
  const d = new Date(when)
  return +(d.toISOString().replace(/[^\d]/g, '').replace(/\d$/, ''))
}
