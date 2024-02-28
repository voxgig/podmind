"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda_1 = require("../../env/lambda/lambda");
function complete(seneca) {
    const makeGatewayHandler = seneca.export('s3-store/makeGatewayHandler');
    seneca
        .act('sys:gateway,kind:lambda,add:hook,hook:handler', {
        handler: makeGatewayHandler('aim:audio,transcribe:episode')
    });
}
exports.handler = async (event, context) => {
    let seneca = await (0, lambda_1.getSeneca)('audio', complete);
    let handler = seneca.export('gateway-lambda/handler');
    let res = await handler(event, context);
    return res;
};
//# sourceMappingURL=audio.js.map