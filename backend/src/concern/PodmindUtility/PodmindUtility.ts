

const defaults = {}


function PodmindUtility(this: any, _options: any) {
  const seneca = this

  const reload = seneca.export('reload/make')(require)

  return {
    exports: {
      getUtils: reload('./podmind-utils')
    }
  }

}


Object.assign(PodmindUtility, { defaults })

export default PodmindUtility
