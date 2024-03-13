"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_process_episode_voxgigfireside() {
    return async function process_episode_voxgigfireside(msg) {
        const seneca = this;
        const podcast_earmark = msg.podcast_earmark;
        const podcast_id = msg.podcast_id || msg.episode.podcast_id;
        const episode = msg.episode;
        const options = this.plugin.options.podcast[podcast_earmark] || {};
        const podcastCache = (this.shared.podcast = (this.shared.podcast || {}));
        const podcastEntry = podcastCache[podcast_id] || (podcastCache[podcast_id] = {
            webflow: { items: null }
        });
        console.log('QQQ', podcastEntry, options);
        if (null == podcastEntry.webflow.items) {
            let q = {
                collection_id: options.webflow?.collection_id
            };
            podcastEntry.webflow.items = await seneca.entity('provider/webflow/colitem').list$(q);
            // const episodeItem = items.find()
            // console.log('==============')
            // console.log(q)
            // console.log(episode)
            // console.log(podcastEntry.webflow.items)
        }
        const item = podcastEntry.webflow.items
            .find((item) => episode.guid === item.fieldData.uuid);
        episode.pageslug = item.fieldData.slug;
        episode.guestlink = item.fieldData['guest-speaker-link-to-social-or-website'];
        return {
            ok: true,
            episode,
        };
    };
};
//# sourceMappingURL=process_episode_voxgigfireside.js.map