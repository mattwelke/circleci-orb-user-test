const { PubSub } = require('@google-cloud/pubsub');

const topicName = 'test-topic';
const subName = 'test-subscription';

async function waitMs(ms) {
    return new Promise((accept, _) => {
        setTimeout(accept, ms);
    });
};

(async () => {
    // Setup:
    const pubSubClient = new PubSub();
    console.log(`Created Pub/Sub client.`);

    await pubSubClient.createTopic(topicName);
    console.log(`Topic ${topicName} created.`);

    const topic = pubSubClient.topic(topicName);

    await topic.createSubscription(subName);
    console.log(`Subscription ${subName} to topic ${topicName} created.`);

    const sub = pubSubClient.subscription(subName);

    // Test:
    const testMsg = 'test-message';

    let receivedExpected = false;

    const msgHandler = rawMsg => {
        console.log(`Subscription received message.`);
        const msg = Buffer.from(rawMsg, 'base64');
        console.log(`Decoded message: ${msg}`);
        if (msg === testMsg) {
            receivedExpected = true;
        }
        rawMsg.ack();
    };

    sub.on('message', msgHandler);

    await topic.publish(Buffer.from(testMsg));

    await waitMs(2000);

    sub.removeListener('message', msgHandler);

    if (!receivedExpected) {
        throw new Error('test failed because did not receive expected message from test subscription');
    }
})();
