module.exports =  {
    'start': {
        phrase: "Hello, i am a virt.ass. i have a %15 Discount for you. wonna it rigth now? (yes|no)",
        answers: {
            yes: 'coupon15',
            no: 'delay4video'
        }
    },
    'coupon15': {
        phrase: "here is your link for %15 discount wwww.couponator.com/443634333",
        delay: 3 * 1000,
        nextStage: 'discount30',
    },
    'discount30': {
        phrase: 'I have %30 discount for highlevel product',
    },
    'delay4video': {
        delay: 3 * 1000,
        nextStage: 'video'
    },
    'video': {
        phrase: 'Here is cool video about our coompany https://youtu.be/UReB_N8sPbY'
    }
};