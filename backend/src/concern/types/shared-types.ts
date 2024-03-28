
export type PodcastChunk = {
  knd: 'txt' | 'tlk' // txt:Context text, tlk: host+guest talking
  txt: string // plain text
  bgn: number // begin time; float seconds
  end: number // end time; float seconds
  dur: number // duration; float seconds
}

