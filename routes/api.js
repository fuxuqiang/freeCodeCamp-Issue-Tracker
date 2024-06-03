'use strict';

const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI);

const issue = new mongoose.Schema({
  project: {
    type: String,
    required: true
  },
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  assigned_to: {
    type: String
  },
  status_text: {
    type: String
  },
  open: {
    type: Boolean
  }
}, {
  timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
  }
});

const Issue = mongoose.model('Issue', issue);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      res.json(await Issue.find(Object.assign({ project: req.params.project }, req.query)));
    })
    
    .post(async (req, res) => {
      const { issue_title, issue_text, created_by } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      let issue = new Issue({
        project: req.params.project,
        issue_title,
        issue_text,
        created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      });
      await issue.save();
      res.json(issue);
    })
    
    .put(async (req, res) => {
      if (!req.body._id) {
        return res.json({ error: 'missing _id' });
      }
      if (Object.keys(req.body).length == 1) {
        return res.json({ error: 'no update field(s) sent', '_id': req.body._id });
      }
      const result = await Issue.updateOne({ _id: req.body._id }, req.body);
      if (result.matchedCount) {
        res.json({  result: 'successfully updated', '_id': req.body._id }); 
      } else {
        res.json({ error: 'could not update', _id: req.body._id });
      }
    })
    
    .delete(async (req, res) => {
      if (!req.body._id) {
        return res.json({ error: 'missing _id' });
      }
      const result = await Issue.deleteOne({ _id: req.body._id });
      if (result.deletedCount) {
        res.json({ result: 'successfully deleted', '_id': req.body._id });
      } else {
        res.json({ error: 'could not delete', '_id': req.body._id });
      }
    });
    
};
