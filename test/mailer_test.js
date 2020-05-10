const mailer = require('../helpers/mailer');
var expect = require('chai').expect;

describe('#Mailer', function() {
  let args = {to: "foo",
    from: "PuppetFinder@test.com", 
    subject: "Foor Results", 
    text: "Please find the results attached.",
    attachmentName: "results.csv",
    attachmentData:  null};

    it('should send', async function() {
      let mock_smpt = {};
      mock_smpt.send = function(){return true;}

      let success = await mailer.send(args, mock_smpt);
      expect(success).to.equal(true);
    });


    it('should not send', async function() {
      let mock_smpt = {};
      mock_smpt.send = function(){return true;}

      let missing_args = null;
      let success = await mailer.send(missing_args, mock_smpt);
      expect(success).to.equal(false);
    });
  });
