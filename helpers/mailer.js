const fs = require("fs");

exports.send = async (args, smtpServer) => {

  if (!args) {
    console.log("Empty args, skipping mailing");
    return false;
  }
    const msg = {
      to: args.to,
      from: args.from,
      subject: args.subject,
      text: args.text,
      attachments: [
        {
          content: args.attachmentData,
          filename: args.attachmentName,
          type: "text/csv",
          disposition: "attachment"
        }
      ] 
    };

  smtpServer.send(msg);

  return true;

}