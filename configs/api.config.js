const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


client.messages
  .create({
      body: 'This is a test, Hello there',
      to: process.env.CELL_PHONE,
      from: process.env.TWIL_NUM
    })
  .then(message => console.log(message.sid))
  .catch((err) => console.log(`error while sending message ${err}`));
