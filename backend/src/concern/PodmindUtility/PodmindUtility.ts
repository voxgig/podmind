
import Path from 'node:path'
import Fs from 'node:fs/promises'


import {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  PutLogEventsCommand,
  DescribeLogStreamsCommand
} from '@aws-sdk/client-cloudwatch-logs'



const defaults = {}


function PodmindUtility(this: any, _options: any) {
  const seneca = this

  const reload = seneca.export('reload/make')(require)



  async function makeSharedLog(groupName: string, streamName: string) {
    if ('local' === seneca.context.env) {
      return makeLocalSharedLog(seneca, groupName, streamName)
    }
    else {
      return makeCloudWatchLog(seneca, groupName, streamName)
    }
  }


  return {
    exports: {
      makeSharedLog,
      getUtils: reload('./podmind-utils')
    }
  }
}



async function makeLocalSharedLog(_seneca: any, groupName: string, streamName: string) {
  const logfolder = Path.join(process.cwd(), 'log', groupName)

  try {
    await Fs.stat(logfolder)
  }
  catch (e: any) {
    if ('ENOENT' === e.code) {
      await Fs.mkdir(logfolder)
    }
    else {
      throw e
    }
  }

  const logpath = Path.join(process.cwd(), 'log', groupName, streamName)
  const loghandle = await Fs.open(logpath, 'a')
  const logstream = loghandle.createWriteStream({
    // flush: true
  })

  return async function sharedlog(...args: any) {
    const txt = lineify(args)
    logstream.write(new Date().toISOString() + ' ' + txt)
    if (!txt.endsWith('\n')) {
      logstream.write('\n')
    }
  }
}


async function makeCloudWatchLog(seneca: any, logGroupName: string, logStreamName: string) {
  const cloudwatchLogsClient = new CloudWatchLogsClient()

  const awsctx = seneca.root.context.aws = (seneca.root.context.aws || {})
  awsctx.sharedlog = (awsctx.sharedlog || {})
  awsctx.sharedlog[logGroupName] = (awsctx.sharedlog[logGroupName] || {})
  awsctx.sharedlog[logGroupName][logStreamName] =
    (awsctx.sharedlog[logGroupName][logStreamName] || {})

  try {
    try {
      const createLogGroupCommand = new CreateLogGroupCommand({ logGroupName })
      await cloudwatchLogsClient.send(createLogGroupCommand)
    }
    catch (e: any) {
      console.log('CREATE LOG GROUP', logGroupName, logStreamName, e)
    }

    try {
      const createLogStreamCommand = new CreateLogStreamCommand({ logGroupName, logStreamName })
      await cloudwatchLogsClient.send(createLogStreamCommand)
    }
    catch (e: any) {
      console.log('CREATE LOG STREAM', logGroupName, logStreamName, e)
    }


    const command = new DescribeLogStreamsCommand({
      logGroupName,
      logStreamNamePrefix: logStreamName,
    })
    const response: any = await cloudwatchLogsClient.send(command)

    awsctx.sharedlog[logGroupName][logStreamName].seqtoken =
      response?.logStreams[0].uploadSequenceToken

    return async function sharedlog(...args: any) {
      try {
        const txt = lineify(args)
        const timestamp = new Date().getTime()
        const seqtoken = awsctx.sharedlog[logGroupName][logStreamName].seqtoken
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
        }

        const command = new PutLogEventsCommand(params)
        const response = await cloudwatchLogsClient.send(command)
        awsctx.sharedlog[logGroupName][logStreamName].seqtoken = response.nextSequenceToken
      }
      catch (e: any) {
        console.error('makeCloudWatchLog ERROR', e);
      }
    }
  }
  catch (e: any) {
    console.log('makeCloudWatchLog ERROR', e)
    throw e
  }
}


function lineify(args: any[]) {
  return (args || [])
    .map((arg: any, _: any) =>
      (_ = typeof arg, 'object' === _ ? JSON.stringify(arg).replace(/["\n]/g, '') : arg))
    .join(' ')
}


Object.assign(PodmindUtility, { defaults })

export default PodmindUtility

