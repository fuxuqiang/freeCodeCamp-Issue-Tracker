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
          .keepOpen()
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
          .keepOpen()
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
    test('Create an issue with missing required fields', (done) => {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/fcc-project')
          .send({ created_by: 'fCC' })
          .end((err, res) => {
            assert.equal(res.body.error, 'required field(s) missing');
            done();
          });
    });
    test('View issues on a project', (done) => {
        chai
          .request(server)
          .keepOpen()
          .get('/api/issues/fcc-project')
          .end((err, res) => {
            assert.isArray(res.body);
            done();
          });
    });
    test('View issues on a project with one filter', (done) => {
        chai
          .request(server)
          .keepOpen()
          .get('/api/issues/fcc-project?created_by=fCC')
          .end((err, res) => {
            assert.equal(res.body[0].created_by, 'fCC');
            done();
          });
    });
    test('View issues on a project with multiple filters', (done) => {
        chai
          .request(server)
          .keepOpen()
          .get('/api/issues/fcc-project?created_by=fCC&status_text=open')
          .end((err, res) => {
            assert.equal(res.body[0].created_by, 'fCC');
            assert.equal(res.body[0].status_text, 'open');
            done();
          });
    });
    test('Update an issue with missing _id', (done) => {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/fcc-project')
          .send({ issue_text: 'New Issue Text' })
          .end((err, res) => {
            assert.equal(res.body.error, 'missing _id');
            done();
          });
    });
    test('Update one field on an issue', (done) => {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/fcc-project')
          .send({ _id: _id1, issue_text: 'New Issue Text' })
          .end((err, res) => {
            assert.equal(res.body.result, 'successfully updated');
            done();
          });
    });
    test('Update multiple fields on an issue', (done) => {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/fcc-project')
          .send({
            _id: _id2,
            issue_text: 'New Issue Text',
            issue_title: 'Faux Issue Title 3'
          })
          .end((err, res) => {
            assert.equal(res.body.result, 'successfully updated');
            done();
          });
    });
    test('Update an issue with no fields to update', (done) => {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/fcc-project')
          .send({ _id: _id1 })
          .end((err, res) => {
            assert.equal(res.body.error, 'no update field(s) sent');
            done();
          });
    });
    test('Update an issue with an invalid _id', (done) => {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/fcc-project')
          .send({ _id: '674ac53a1a54b5fca17e813b', issue_text: 'New Issue Text' })
          .end((err, res) => {
            assert.equal(res.body.error, 'could not update');
            done();
          });
    });
    test('Delete an issue', (done) => {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/fcc-project')
          .send({ _id: _id1 })
          .end((err, res) => {
            assert.equal(res.body.result, 'successfully deleted');
            done();
          });
    });
    test('Delete an issue with an invalid _id', (done) => {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/fcc-project')
          .send({ _id: '674ac53a1a54b5fca17e813b' })
          .end((err, res) => {
            assert.equal(res.body.error, 'could not delete');
            done();
          });
    });
    test('Delete an issue with missing _id', (done) => {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/fcc-project')
          .end((err, res) => {
            assert.equal(res.body.error, 'missing _id');
            done();
          });
    });
});
