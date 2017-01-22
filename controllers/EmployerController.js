var Record = require('../models/Record');

module.exports = {
  search: function(req, res) {
    res.render('employers');
  },
  records: function(req, res) {
    Record.find({ filled_out: true }, function (err, records) {
      hash = {};
      for (var i = 0; i < records.length; i += 1) {
        id = records[i].mit_id;
        email = records[i].email;
        createdAt = records[i].createdAt;
        if (hash[id] === undefined
         || hash[id].email !== email
         || hash[id].createdAt < createdAt) {
          hash[id] = {
            createdAt: records[i].createdAt,
            name: records[i].name,
            resume: records[i].s3_url,
            email: records[i].email,
            major: records[i].major_name,
            year: records[i].year_name,
            degree: records[i].degree_name,
            citizenship: records[i].citizenship_name
          };
        }
      }
      if (err)
        throw err;

      var result = [];
      Object.keys(hash).forEach( function(key) {
        result.push(hash[key]);
      })
      res.json(result);
    });
  }
};
