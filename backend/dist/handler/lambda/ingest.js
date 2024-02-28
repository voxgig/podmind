"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda_1 = require("../../env/lambda/lambda");
function complete(seneca) {
    seneca.client({ type: 'sqs', pin: 'aim:store,download:audio' });
}
exports.handler = async (event, context) => {
    let seneca = await (0, lambda_1.getSeneca)('ingest', complete);
    let handler = seneca.export('gateway-lambda/handler');
    let res = await handler(event, context);
    return res;
};
//# sourceMappingURL=ingest.js.map