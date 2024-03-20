




// Custom podcast processing
function PodcastProcess(this: any, options: any) {
  const seneca = this

  console.log('PodcastProcess OPTIONS')
  console.dir(options, { depth: null })


  // NOTE: assumes a serverless function, so cache is not cleared, and lives for as long as the
  // function instance.
  this.shared.cache = {}


  const reload = seneca.export('reload/make')(require)

  seneca
    .message('concern:episode,process:episode', {
      podcast_earmark: 'voxgigfireside'
    }, reload('./process_episode_voxgigfireside'))
}


const defaults: any = {
  podcast: {}
}

Object.assign(PodcastProcess, { defaults })

export default PodcastProcess

