
module.exports = function make_web_chat_query() {
  return async function web_chat_query(this: any, msg: any, meta: any) {
    const seneca = this

    let out: any = {
      ok: false,
      why: '',
      answer: '',
    }

    const query = msg.query
    const vxghdr = msg.gateway.headers['voxgig-podmind-widget']
    console.log('VXGHDR', vxghdr)

    let res = await this.post('aim:chat,chat:query', {
      query
    })

    if (res.ok) {
      out.ok = res.ok
      out.answer = res.answer
      out.hits = res.context.hits
      delete out.why
    }
    else {
      out.why = res.why
    }

    /*
        out = {
          "ok": true,
          "answer": "Developer relations, often abbreviated as DevRel, is a field within software development that is focused on fostering positive relationships between software developers and the technology they create, as well as with the larger community of software developers. It encompasses a range of activities, including developer advocacy, community management, content creation, and event organizing. The goal of DevRel is to promote the use of a particular technology or platform, and to support the developers who use it.",
          "hits": [
            {
              "episode_id": "m3kg85",
              "podcast_id": "r2d56q",
              "guest": "Liz Acosta",
              "topics": [
                "community",
                "the evolution of DevRel",
                "the value of real vs imposters"
              ],
              "links": [
                {
                  "url": "https://www.linkedin.com/in/lizacostalinkedin/",
                  "text": "Liz Acosta LinkedIn"
                },
                {
                  "url": "https://www.voxgig.com/podcast",
                  "text": "VoxGig Podcast"
                },
                {
                  "url": "https://voxgig.substack.com/",
                  "text": "VoxGig Newsletter"
                },
                {
                  "url": "https://www.devrelmeetup.com/",
                  "text": "Dublin DevRel Meetup"
                }
              ],
              "title": "Episode 157, Liz Acosta, Developer Content Marketing Manager for Streamlit",
              "guid": "e2af4a39-acaf-4c72-a4fa-816d712e3465",
              "pubDate": "Thu, 07 Mar 2024 07:00:00 +0000",
              "audioUrl": "https://media.resonaterecordings.com/voxgig-fireside-podcast/e2af4a39-acaf-4c72-a4fa-816d712e3465.mp3",
              "page": "PAGE",
              "bgn": 89.28,
              "end": 95.6,
              "dur": 6.319999999999993,
              "score$": 0.6693638,
              "extract": " Liz Acosta: Yeah.So I just started last week.So I'm actually still figuring it out.Still figuring>"
            },
            {
              "episode_id": "m3kg85",
              "podcast_id": "r2d56q",
              "guest": "Liz Acosta",
              "topics": [
                "community",
                "the evolution of DevRel",
                "the value of real vs imposters"
              ],
              "links": [
                {
                  "url": "https://www.linkedin.com/in/lizacostalinkedin/",
                  "text": "Liz Acosta LinkedIn"
                },
                {
                  "url": "https://www.voxgig.com/podcast",
                  "text": "VoxGig Podcast"
                },
                {
                  "url": "https://voxgig.substack.com/",
                  "text": "VoxGig Newsletter"
                },
                {
                  "url": "https://www.devrelmeetup.com/",
                  "text": "Dublin DevRel Meetup"
                }
              ],
              "title": "Episode 157, Liz Acosta, Developer Content Marketing Manager for Streamlit",
              "guid": "e2af4a39-acaf-4c72-a4fa-816d712e3465",
              "pubDate": "Thu, 07 Mar 2024 07:00:00 +0000",
              "audioUrl": "https://media.resonaterecordings.com/voxgig-fireside-podcast/e2af4a39-acaf-4c72-a4fa-816d712e3465.mp3",
              "page": "PAGE",
              "bgn": 100.885,
              "end": 121.105,
              "dur": 20.22,
              "score$": 0.5767484,
              "extract": " Liz Acosta: Well, so my official title my official title is developer content marketing manager.So, basically,"
            },
            {
              "episode_id": "m3kg85",
              "podcast_id": "r2d56q",
              "guest": "Liz Acosta",
              "topics": [
                "community",
                "the evolution of DevRel",
                "the value of real vs imposters"
              ],
              "links": [
                {
                  "url": "https://www.linkedin.com/in/lizacostalinkedin/",
                  "text": "Liz Acosta LinkedIn"
                },
                {
                  "url": "https://www.voxgig.com/podcast",
                  "text": "VoxGig Podcast"
                },
                {
                  "url": "https://voxgig.substack.com/",
                  "text": "VoxGig Newsletter"
                },
                {
                  "url": "https://www.devrelmeetup.com/",
                  "text": "Dublin DevRel Meetup"
                }
              ],
              "title": "Episode 157, Liz Acosta, Developer Content Marketing Manager for Streamlit",
              "guid": "e2af4a39-acaf-4c72-a4fa-816d712e3465",
              "pubDate": "Thu, 07 Mar 2024 07:00:00 +0000",
              "audioUrl": "https://media.resonaterecordings.com/voxgig-fireside-podcast/e2af4a39-acaf-4c72-a4fa-816d712e3465.mp3",
              "page": "PAGE",
              "bgn": 121.805,
              "end": 171.46501,
              "dur": 49.66001,
              "score$": 0.54679835,
              "extract": " Liz Acosta: And we wanna find a way to showcase that, to showcase these creators, these users.And so my job is"
            }
          ],
        }
    */

    return out
  }
}
