"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalSetup = exports.setup = exports.base = exports.basic = void 0;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
function basic(seneca, options) {
    options = options || {};
    const deep = seneca.util.deep;
    seneca
        .use('promisify', deep(base.options.promisify, options.promisify))
        .use('telemetry', deep(base.options.telemetry, options.telemetry))
        .use('env', deep(base.options.env, options.env))
        .use('entity', deep(base.options.entity, options.entity))
        // .use('capture', deep(base.options.capture, options.capture))
        .use('config', deep(base.options.config, options.config))
        .use('user', deep(base.options.user, options.user))
        .use('owner', deep(base.options.owner, options.owner))
        .use('reload', deep(base.options.reload, options.reload));
    return seneca;
}
exports.basic = basic;
// After store plugins
function setup(seneca, options) {
    options = options || {};
    const deep = seneca.util.deep;
    const cloud = seneca.context.model.main.conf.cloud;
    // const model = cloud.aws.bedrock.model
    seneca
        .use('s3-store', {
        debug: true,
        map: {
            '-/pdm/transcript': '*',
            '-/pdm/rss': '*',
            '-/pdm/audio': '*',
        },
        suffix: '',
        prefix: '',
        folder: 'folder01',
        shared: {
            Bucket: `podmind01-backend01-file01-${seneca.context.stage}`
        },
        s3: {
            Region: 'us-east-1'
        },
        local: {
            active: 'local' === seneca.context.env,
            folder: __dirname + '/../../../data/storage/bucket01',
        },
    })
        .use('entity-util', deep(base.options.entity_util, options.entity_util))
        .use('env', {
        file: [__dirname + '/../local/local-env.js;?'],
        var: {
            DEEPGRAM_APIKEY: String,
        }
    })
        .use('provider', {
        provider: {
            deepgram: {
                keys: {
                    apikey: { value: '$DEEPGRAM_APIKEY' },
                }
            },
        }
    })
        .use('bedrock-chat', {
    /*
    opensearch: {
      region: cloud.aws.region,

      // TODO: move under aws
      node: cloud.opensearch.url,
      index: cloud.opensearch.index
      }
      */
    })
        .use('opensearch-store', {
        map: {
            'vector/podchunk': '*'
        },
        index: {
            exact: cloud.opensearch.index,
            // exact: 'tt01'
        },
        opensearch: {
            node: cloud.opensearch.url,
        }
    });
    return seneca;
}
exports.setup = setup;
// After services loaded
function finalSetup(seneca) {
    const chatLimiter = new rate_limiter_flexible_1.RateLimiterQueue(new rate_limiter_flexible_1.BurstyRateLimiter(new rate_limiter_flexible_1.RateLimiterMemory({
        points: 1,
        duration: 1,
    }), new rate_limiter_flexible_1.RateLimiterMemory({
        keyPrefix: 'burst',
        points: 3,
        duration: 1,
    })), {
        maxQueueSize: 111
    });
    seneca.message('aim:chat,chat:query', async function (msg) {
        let start = Date.now();
        await chatLimiter.removeTokens(1);
        console.log('CHAT WAIT', Date.now() - start);
        return this.prior(msg);
    });
}
exports.finalSetup = finalSetup;
const base = {
    seneca: {
        timeout: 5 * 60 * 1000, // 98765,
        legacy: false,
        log: {
            logger: 'flat',
            level: 'warn'
        }
    },
    options: {
        promisify: {},
        telemetry: {
            active: true,
        },
        env: {
            file: [__dirname + '/../local/local-env.js;?'],
            var: {}
        },
        entity: {},
        capture: {},
        config: {},
        user: {
            fields: {
                standard: ['id', 'handle', 'email', 'name', 'active'],
            },
        },
        entity_util: {
            when: {
                active: true,
                human: 'y',
            }
        },
        owner: {
            ownerprop: 'principal.user',
            fields: ['id:owner_id'],
            annotate: [
                'sys:entity',
            ]
        },
        reload: {},
    }
};
exports.base = base;
//# sourceMappingURL=basic.js.map