const { PubSub } = require('@google-cloud/pubsub');

const topicName = 'test-topic';
const subName = 'test-subscription';

async function waitMs(ms) {
    return new Promise((accept, _) => {
        setTimeout(accept, ms);
    });
};

async function main() {
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
        const msg = Buffer.from(rawMsg.data, 'base64').toString();
        console.log(`Decoded message: ${msg}`);
        if (msg === testMsg) {
            receivedExpected = true;
        }
        rawMsg.ack();
    };

    sub.on('message', msgHandler);
    console.log(`Subscription "${subName}" listening.`);

    await topic.publish(Buffer.from(testMsg));
    console.log(`Published message "${testMsg}" to topic "${topicName}".`);

    console.log(`Begin waiting 2 seconds.`);
    await waitMs(2000);
    console.log(`Finished waiting two seconds.`);

    sub.removeListener('message', msgHandler);
    console.log(`Stopped subscription "${subName}" listening.`);

    if (!receivedExpected) {
        throw new Error('test failed because did not receive expected message from test subscription');
    }
}

main().catch(e => {
    console.log(e);
    process.exit(1);
});
