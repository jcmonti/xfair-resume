var jade = require('jade');
var email = require('emailjs');
if (process.env.SMTP_ENABLE == 'yes') {
  console.log('Hey, SMTP is enabled')
  var server = email.server.connect({
    user: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    host: process.env.SMTP_HOST,
    port: 587,
    ssl: true,
    tls: true
  });
  module.exports = function(options) {
    var email = options.email;
    var subject = options.subject;
    var template = options.template;
    var locals = options.locals;
    jade.renderFile(__dirname + '/../views/' + template + '.jade', locals, function (err, html) {
      if (err)
        throw err;
      var message = {
        text: "Please view this email in an upgraded browser.",
        from: process.env.SMTP_SENDER,
        to: email,
        subject: subject,
        attachment: [
          { data: html, alternative: true }
        ]
      };
      server.send(message, function(err, message) {
	if (err)
	  console.log(err || message);
	  throw err;	
      });
    });
  };
} else {
  module.exports = function() {};
}
