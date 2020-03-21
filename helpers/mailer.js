const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const fs = require("fs");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.send = async (args) => {
  
  console.log(args);
  console.log(process.env.RESULTS_DESTINATION);

  //attachment = fs.readFileSync(args.csvPath).toString("base64");

  // const msg = {
  //   to: process.env.RESULTS_DESTINATION,
  //   from: args.from,
  //   subject: args.subject,
  //   text: args.text,
  //   };

    const msg = {
      to: 'test@example.com',
      from: 'test@example.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
    };

  sgMail.send(msg).catch(err => {
    console.log(err);
  });

}


/*

attachments: [
      {
        content: attachment,
        filename: args.csvPath,
        type: "text/csv",
        disposition: "attachment"
      }
    ]

exports.send = async (subject, text) => {
    let params = {
        Message: text, 
        Subject: subject,
        TopicArn: 'arn:aws:sns:us-east-1:743986540256:PuppetFinderNotification' //from config!
      };

      await new AWS.SNS().publish(params, function(err, data) {
        if (err) console.log(err, err.stack); 
        else console.log(data);
    });
}
*/