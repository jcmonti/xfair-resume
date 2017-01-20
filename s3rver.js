var S3rver = require('s3rver');
var client = new S3rver({
  port: 4569,
  hostname: '127.0.0.1',
  silent: false,
  directory: './s3rver/'
});
client.run(function(err, host, port) {
  if (err)
    throw err;
  console.log("Running s3rver on http://" + host + ":" + port);
});
