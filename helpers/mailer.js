const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

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