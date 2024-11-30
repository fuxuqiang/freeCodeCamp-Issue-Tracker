const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    let _id1, _id2;
    test('Create an issue with every field', (done) => {
        chai
          .request(server)
          .post('/api/issues/fcc-project')
          .send({
            issue_title: 'Faux Issue Title 2',
            issue_text: 'Functional Test - Every field filled in',
            created_by: 'fCC',
            assigned_to: 'Chai and Mocha',
            status_text: 'open'
          })
          .end((err, res) => {
            _id1 = res.body._id;
            assert.isString(_id1);
            done();
          });
    });
    test('Create an issue with only required fields', (done) => {
        chai
          .request(server)
          .post('/api/issues/fcc-project')
          .send({
            issue_title: 'Faux Issue Title',
            issue_text: 'Functional Test - Required Fields Only',
            created_by: 'fCC'
          })
          .end((err, res) => {
            _id2 = res.body._id;
            assert.isString(_id2);
            done();
          });
    });
    test('Create an issue with missing required fields', () => {
        chai
          .request(server)
          .post('/api/issues/fcc-project')
          .send({ created_by: 'fCC' })
          .end((err, res) => {
            assert.equal(res.body.error, 'required field(s) missing');
          });
    });
    test('View issues on a project', () => {
        chai
          .request(server)
          .get('/api/issues/fcc-project')
          .end((err, res) => {
            assert.isArray(res.body);
          });
    });
    test('View issues on a project with one filter', () => {
        chai
          .request(server)
          .get('/api/issues/fcc-project?created_by=fCC')
          .end((err, res) => {
            assert.equal(res.body[0].created_by, 'fCC');
          });
    });
    test('View issues on a project with multiple filters', () => {
        chai
          .request(server)
          .get('/api/issues/fcc-project?created_by=fCC&status_text=open')
          .end((err, res) => {
            assert.equal(res.body[0].created_by, 'fCC');
            assert.equal(res.body[0].status_text, 'open');
          });
    });
    test('Update an issue with missing _id', () => {
        chai
          .request(server)
          .put('/api/issues/fcc-project')
          .send({ issue_text: 'New Issue Text' })
          .end((err, res) => {
            assert.equal(res.body.error, 'missing _id');
          });
    });
    test('Update one field on an issue', () => {
        chai
          .request(server)
          .put('/api/issues/fcc-project')
          .send({ _id: _id1, issue_text: 'New Issue Text' })
          .end((err, res) => {
            assert.equal(res.body.result, 'successfully updated');
          });
    });
    test('Update multiple fields on an issue', () => {
        chai
          .request(server)
          .put('/api/issues/fcc-project')
          .send({
            _id: _id2,
            issue_text: 'New Issue Text',
            issue_title: 'Faux Issue Title 3'
          })
          .end((err, res) => {
            assert.equal(res.body.result, 'successfully updated');
          });
    });
    test('Update an issue with no fields to update', () => {
        chai
          .request(server)
          .put('/api/issues/fcc-project')
          .send({ _id: _id1 })
          .end((err, res) => {
            assert.equal(res.body.error, 'no update field(s) sent');
          });
    });
    test('Update an issue with an invalid _id', () => {
        chai
          .request(server)
          .put('/api/issues/fcc-project')
          .send({ _id: '674ac53a1a54b5fca17e813b', issue_text: 'New Issue Text' })
          .end((err, res) => {
            assert.equal(res.body.error, 'could not update');
          });
    });
    test('Delete an issue', () => {
        chai
          .request(server)
          .delete('/api/issues/fcc-project')
          .send({ _id: _id1 })
          .end((err, res) => {
            assert.equal(res.body.result, 'successfully deleted');
          });
    });
    test('Delete an issue with an invalid _id', () => {
        chai
          .request(server)
          .delete('/api/issues/fcc-project')
          .send({ _id: '674ac53a1a54b5fca17e813b' })
          .end((err, res) => {
            assert.equal(res.body.error, 'could not delete');
          });
    });
    test('Delete an issue with missing _id', () => {
        chai
          .request(server)
          .delete('/api/issues/fcc-project')
          .end((err, res) => {
            assert.equal(res.body.error, 'missing _id');
          });
    });
});
