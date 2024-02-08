# podmind - virtual conversations with podcast guests

Here is the live system: [Voxgig Podcasts](https://www.voxgig.com/podcast).

This is an open source example of a Retrieval Augmented Generation (RAG) system that includes:

- A document (audio transcript) ingestion pipeline;
- Simple vector embeddig using AWS LLMs and OpenSearch;
- An embeddable chat widget that can run on third party websites;
- A scalable Node.js Serverless Microservices architecture in TypeScript;
- An exmaple of the local-monolith development style;
- An example of a type-safe model-driven system;


This code is derived from code written by
[Mikael Vesavuori](https://www.mikaelvesavuori.se):
[bedrock-rag-demo](https://github.com/mikaelvesavuori/bedrock-rag-demo) (Thanks Mikael!)


| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source code is sponsored and supported by [Voxgig](https://www.voxgig.com). |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |


## Requirements

Locally the system runs as a single Node.js process (a "local monolith").

You will need a [Deepgram](https://deepgram.com/) account to perform
audio transcriptions. Register for a free developer account.

You will also need an AWS account to access the Bedrock LLM.


## Running Locally

Clone this repo, and run `npm install` in these folders:
- `backend`
- `widget/ask`

Add you Deepgram API Key to the `srv/env/local/local-env.ts` file and
recompile with `npm run build`

Set your `$AWS_PROFILE` environment variable so that the AWS SDK can
access the Bedrock LLM.

In `backend` run:
```sh
$ npm run local
```

Verify the backend by opening another terminal in the `backend` folder
and running the system REPL:

```sh
$ npm run repl
```

Using the REPL, ingest a podcast:

```
> aim:ingest,subscribe:podcast,feed:'https://feeds.resonaterecordings.com/voxgig-fireside-podcast'
```

This is a [Seneca](https://senecajs.org) microservices system.

To chat to the system, run the chat widget in development mode:

In the `widget/ask` folder:
```
$ npm run dev 
```

And open a browser as directed.


## Deployment

This system uses the [Serverless](https://www.serverless.com/) framework for deployment to AWS.

The following AWS services are used:
- Lambda
- DynamoDB
- OpenSearch
- S3
- Cloudwatch
- SQS
- API Gateway
- Cloudfront

Basic AWS and Serverless knowledge is assumed.










