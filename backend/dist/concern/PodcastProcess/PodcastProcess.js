"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Custom podcast processing
function PodcastProcess(_options) {
    const seneca = this;
    // NOTE: assumes a serverless function, so cache is not cleared, and lives for as long as the
    // function instance.
    this.shared.cache = {};
    const reload = seneca.export('reload/make')(require);
    seneca
        .message('concern:episode,process:episode', {
        podcast_earmark: 'voxgigfireside'
    }, reload('./process_episode_voxgigfireside'));
}
const defaults = {
    podcast: {}
};
Object.assign(PodcastProcess, { defaults });
exports.default = PodcastProcess;
//# sourceMappingURL=PodcastProcess.js.map