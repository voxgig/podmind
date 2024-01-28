
// TOOD: https://github.com/senecajs/seneca-reload/issues/1
// export default function make_podmind_utils() {

module.exports = function make_podmind_utils() {
  return function getUtils() {
    return {
      humanify,
      listPaths,
    }
  }
}


function humanify(when: number) {
  const d = new Date(when)
  return +(d.toISOString().replace(/[^\d]/g, '').replace(/\d$/, ''))
}


function listPaths(event: any) {
  const paths = event?.Records?.map((r: any) =>
    decodeURIComponent(r.s3.object.key).replace(/\+/g, ' '))
  return paths
}
