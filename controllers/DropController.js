var uuid = require('node-uuid');
var Record = require('../models/Record');
var form = require('../utils/form');
var sendEmail = require('../utils/email');

module.exports = {
  index: function (req, res) {
    res.render('index');
  },

  team: function (req, res) {
    res.render('MBAn');
  },

  jobs: function (req, res) {
    res.render('jobs');
  },

  create: function (req, res) {
    Record.create({
      uuid: uuid.v4(),
      resume: req.file.key
    }, function (err, new_record) {
      if (err)
        throw err;
      res.send('/'+new_record.uuid);
    });
  },

  redrop_view: function (req, res) {
    res.render('index', { redrop: true });
  },

  redrop: function (req, res) {
    req.record.resume = req.file.key;
    req.record.save(function(err) {
      if (err)
        throw err;
      res.send('/'+req.record.uuid);
    });
  },

  view: function (req, res) {
    var record = req.record;
    res.render('record', {
      record: record,
      form: record.form
    });
  },

  update: function (req, res) {
    var record = req.record;
    form.handle(req, {
      success: function (form) {
        record.name = form.data.name;
        record.email = form.data.email;
        record.year = form.data.year;
        record.major = form.data.major;
        record.degree = form.data.degree;
        record.citizenship = form.data.citizenship;
        record.mit_id = form.data.mit_id;
        var first_time = !record.filled_out;
        record.filled_out = true;
        record.save(function(err) {
          if (err)
            throw err;
          if (true)
	    alert("Hi")
            sendEmail({
              email: record.email,
              subject: 'Thanks for dropping your resume!',
              template: 'email/thanks',
              locals: {
                record: record
              }
            });
          res.render('record', {
            record: record,
            form: record.form,
            success: true
          });
        });
      },
      error: function (form) {
        res.render('record', {
          record: record,
          form: form
        });
      }
    });
  },

  findRecord: function (req, res, next) {
    var token = req.params.token;
    Record.findOne({ uuid: token }, function (err, record) {
      if (err)
        throw err;
      if (record === null) {
        res.status(404).send('Not found');
        return;
      }
      req.record = record;
      next();
    });
  }
};
