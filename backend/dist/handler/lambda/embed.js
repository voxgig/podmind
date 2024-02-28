"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda_1 = require("../../env/lambda/lambda");
function complete(seneca) {
    seneca.listen({ type: 'sqs', pin: 'aim:embed,handle:chunk' });
    seneca.listen({ type: 'sqs', pin: 'aim:embed,store:embed' });
    seneca.client({ type: 'sqs', pin: 'aim:embed,store:embed' });
}
exports.handler = async (event, context) => {
    let seneca = await (0, lambda_1.getSeneca)('embed', complete);
    let handler = seneca.export('gateway-lambda/handler');
    let res = await handler(event, context);
    return res;
};
//# sourceMappingURL=embed.js.map