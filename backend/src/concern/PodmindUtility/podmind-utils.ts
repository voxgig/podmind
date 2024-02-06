
// TOOD: https://github.com/senecajs/seneca-reload/issues/1
// export default function make_podmind_utils() {

module.exports = function make_podmind_utils() {
  return function getUtils() {
    return {
      humanify,
      listPaths,
      makeDebug,
    }
  }
}


function humanify(when?: number) {
  const d = when ? new Date(when) : new Date()
  return +(d.toISOString().replace(/[^\d]/g, '').replace(/\d$/, ''))
}


function listPaths(event: any) {
  const paths = event?.Records?.map((r: any) =>
    decodeURIComponent(r.s3.object.key).replace(/\+/g, ' '))
  return paths
}

function makeDebug(seneca: any) {
  seneca.shared.debug = (_mark: string, _: any) =>
    (_ = (..._args: any[]) => null, _.active = false, _)

  if (seneca.plugin.options.debug) {
    seneca.shared.debug = (mark: string, _: any) =>
      (_ = (...args: any[]) => console.log('##', mark, ...args), _.active = true, _)
  }

  return seneca.shared.debug
}
