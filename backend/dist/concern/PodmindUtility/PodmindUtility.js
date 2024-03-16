"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = __importDefault(require("node:fs/promises"));
const client_cloudwatch_logs_1 = require("@aws-sdk/client-cloudwatch-logs");
const defaults = {};
function PodmindUtility(_options) {
    const seneca = this;
    const reload = seneca.export('reload/make')(require);
    async function makeSharedLog(groupName, streamName) {
        if ('local' === seneca.context.env) {
            return makeLocalSharedLog(seneca, groupName, streamName);
        }
        else {
            return makeCloudWatchLog(seneca, groupName, streamName);
        }
    }
    return {
        exports: {
            makeSharedLog,
            getUtils: reload('./podmind-utils')
        }
    };
}
async function makeLocalSharedLog(seneca, groupName, streamName) {
    const logfolder = node_path_1.default.join(process.cwd(), 'log', groupName);
    try {
        await promises_1.default.stat(logfolder);
    }
    catch (e) {
        if ('ENOENT' === e.code) {
            await promises_1.default.mkdir(logfolder);
        }
        else {
            throw e;
        }
    }
    const logpath = node_path_1.default.join(process.cwd(), 'log', groupName, streamName);
    const loghandle = await promises_1.default.open(logpath, 'a');
    const logstream = loghandle.createWriteStream({
    // flush: true
    });
    return async function sharedlog(...args) {
        const txt = lineify(args);
        logstream.write(new Date().toISOString() + ' ' + seneca.id + ' ' + txt);
        if (!txt.endsWith('\n')) {
            logstream.write('\n');
        }
    };
}
async function makeCloudWatchLog(seneca, logGroupName, logStreamName) {
    const cloudwatchLogsClient = new client_cloudwatch_logs_1.CloudWatchLogsClient();
    const awsctx = seneca.root.context.aws = (seneca.root.context.aws || {});
    awsctx.sharedlog = (awsctx.sharedlog || {});
    awsctx.sharedlog[logGroupName] = (awsctx.sharedlog[logGroupName] || {});
    awsctx.sharedlog[logGroupName][logStreamName] =
        (awsctx.sharedlog[logGroupName][logStreamName] || {});
    try {
        async function getLogStreamSequenceToken() {
            try {
                const command = new client_cloudwatch_logs_1.DescribeLogStreamsCommand({
                    logGroupName,
                    logStreamNamePrefix: logStreamName,
                });
                const response = await cloudwatchLogsClient.send(command);
                // console.log('DESCRIBE LOG STREAM')
                // console.dir(response, { depth: null })
                return awsctx.sharedlog[logGroupName][logStreamName].seqtoken =
                    response?.logStreams[0].uploadSequenceToken;
            }
            catch (e) {
                console.log('ERROR: DESCRIBE LOG STREAM', logGroupName, logStreamName, e);
                return null;
            }
        }
        let seqtoken = await getLogStreamSequenceToken();
        if (null == seqtoken) {
            try {
                const createLogGroupCommand = new client_cloudwatch_logs_1.CreateLogGroupCommand({ logGroupName });
                await cloudwatchLogsClient.send(createLogGroupCommand);
            }
            catch (e) {
                console.log('ERROR: CREATE LOG GROUP', logGroupName, logStreamName, e);
            }
            try {
                const createLogStreamCommand = new client_cloudwatch_logs_1.CreateLogStreamCommand({ logGroupName, logStreamName });
                await cloudwatchLogsClient.send(createLogStreamCommand);
            }
            catch (e) {
                console.log('ERROR: CREATE LOG STREAM', logGroupName, logStreamName, e);
            }
            seqtoken = await getLogStreamSequenceToken();
            if (null == seqtoken) {
                console.log('ERROR: GET LOG STREAM TOKEN', logGroupName, logStreamName, 'no-seqtoken');
            }
        }
        return async function sharedlog(...args) {
            try {
                const txt = seneca.id + ' ' + lineify(args);
                const timestamp = new Date().getTime();
                const seqtoken = awsctx.sharedlog[logGroupName][logStreamName].seqtoken;
                const params = {
                    logGroupName,
                    logStreamName,
                    logEvents: [
                        {
                            message: txt,
                            timestamp,
                        },
                    ],
                    sequenceToken: seqtoken,
                };
                const command = new client_cloudwatch_logs_1.PutLogEventsCommand(params);
                const response = await cloudwatchLogsClient.send(command);
                awsctx.sharedlog[logGroupName][logStreamName].seqtoken = response.nextSequenceToken;
            }
            catch (e) {
                console.error('makeCloudWatchLog ERROR', e);
            }
        };
    }
    catch (e) {
        console.log('makeCloudWatchLog ERROR', e);
        throw e;
    }
}
function lineify(args) {
    return (args || [])
        .map((arg, _) => (_ = typeof arg, 'object' === _ ? JSON.stringify(arg).replace(/["\n]/g, '') : arg))
        .join(' ');
}
Object.assign(PodmindUtility, { defaults });
exports.default = PodmindUtility;
//# sourceMappingURL=PodmindUtility.js.map