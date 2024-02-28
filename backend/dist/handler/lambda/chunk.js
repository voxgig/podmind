"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda_1 = require("../../env/lambda/lambda");
function complete(seneca) {
    seneca.client({ type: 'sqs', pin: 'aim:embed,handle:chunk' });
    const makeGatewayHandler = seneca.export('s3-store/makeGatewayHandler');
    seneca
        .act('sys:gateway,kind:lambda,add:hook,hook:handler', {
        handler: makeGatewayHandler('aim:chunk,handle:transcript')
    });
}
exports.handler = async (event, context) => {
    let seneca = await (0, lambda_1.getSeneca)('chunk', complete);
    let handler = seneca.export('gateway-lambda/handler');
    let res = await handler(event, context);
    return res;
};
//# sourceMappingURL=chunk.js.map