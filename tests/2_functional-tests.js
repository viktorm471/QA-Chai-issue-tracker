const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  // post Test
  
  test('Check all the inputs', function (done) {
      let issue = {issue_title:"title1",
                  issue_text:"text2",
                  created_by:"mi" ,
                  assigned_to:"",
                  status_text:""};
    chai
        .request(server)
        .post('/api/issues/test')
        .send(issue)
    
        .end(function (err, res) {
          
          assert.typeOf(res.body, 'object');
          assert.property(res.body,"issue_title");
          assert.property(res.body,"issue_text");
          assert.property(res.body,"created_by");
          assert.property(res.body,"assigned_to");
          assert.property(res.body,"status_text");
          done();
        });
    });
 
  test('Check only the required inputs', function (done) {
      let issue = {issue_title:"title1",
                  issue_text:"text2",
                  created_by:"mi" 
                  };
    chai
        .request(server)
        .post('/api/issues/test')
        .send(issue)
    
        .end(function (err, res) {
          
          assert.typeOf(res.body, 'object');
          assert.property(res.body,"issue_title");
          assert.property(res.body,"issue_text");
          assert.property(res.body,"created_by");
          
          done();
        });
    });
  test('Check if a required input is missing', function (done) {
      let issue = {issue_title:"title1",
                  
                  created_by:"mi" 
                  };
    chai
        .request(server)
        .post('/api/issues/test')
        .send(issue)
    
        .end(function (err, res) {
          
          assert.typeOf(res.body, 'object');
          assert.equal(res.body.error,'required field(s) missing');
          
          
          done();
        });
    });
  // get Test
   test('Check get all the projects required inputs', function (done) {
      let issue = {issue_title:"title1",
                  issue_text:"text2",
                  created_by:"mi" 
                  };
    chai
        .request(server)
        .get('/api/issues/test')
        .send(issue)
    
        .end(function (err, res) {
          let response = res.body;
          assert.typeOf(res.body, 'Array');

          for (let key in response){
            assert.property(response[key],"issue_title");
          assert.property(response[key],"issue_text");
          assert.property(response[key],"created_by");
          }
          
          done();
        });
    });
  
  test('Check the filter for the project', function (done) {
      let issue = {issue_title:"get the id",
                  issue_text:"text2",
                  created_by:"mi" 
                  };
    let _id;
    chai
      
        .request(server)
        .post('/api/issues/test')
        .send(issue)
    
        .end(function (err, res) {
          _id = res.body._id;
          
             chai
          .request(server)
          .get(`/api/issues/test?_id=${_id}`)
          .end(function (err, res) {
           assert.equal(res.body[0].issue_title,"get the id");
             done();
          })
      
      
        
          })
      
      
        
   
          
         
        });
  let generalID;
  test('Test multiple filters', function (done) {
      let issue = {issue_title:"title3",
                  issue_text:"text2",
                  created_by:"victor" 
                  };
    let query={};
    chai
        .request(server)
        .post('/api/issues/test')
        .send(issue)
    
        .end(function (err, res) {
          
          
          query._id=res.body._id;
          query.issue_title=res.body.issue_title;
          generalID=res.body._id;
          
          chai
          .request(server)
        .get('/api/issues/test')
        .query(query)
        .end(function (err, res) {
          assert.equal(res.body[0].issue_title,"title3");
          done();
        })   
        });
        
          
        });
    // put Test
    
    test('Check one field updated', function (done) {
     
      
          chai
        .request(server)
        .put('/api/issues/test')
        .send({"_id":generalID, "issue_title":"new updated title"})
        .end(function (err, res) {
          assert.equal(res.body.result,"successfully updated");
          done();
          })
       
       
        });
  
  test('Check two fields updated', function (done) {
     
    chai
        .request(server)
        .put('/api/issues/test')
        .send({"_id":generalID, "issue_title":"new updated title","created_by":"other"})
        .end(function (err, res) {
          
          assert.equal(res.body.result,"successfully updated");
          done();
          })
      
        });
  test('Check update with missing id', function (done) {
     
    chai
        .request(server)
        .put('/api/issues/test')
        .send({})
        .end(function (err, res) {
          
          assert.equal(res.body.error,'missing _id');
          done();
          })
       
       
        });
  test('Check put without fields to uptated', function (done) {
     
    chai
        .request(server)
        .put('/api/issues/test')
        .send({_id:generalID})
        .end(function (err, res) {
          assert.equal(res.body.error,'no update field(s) sent');
          done();
        })
        });
  test('Check put with invalid id', function (done) {
     
    chai
        .request(server)
        .put('/api/issues/test')
        .send({_id:"invalid"})
        .end(function (err, res) {
          assert.equal(res.body.error,'could not update');
          done();
        })
        });

  // Delete TEST 
  test('Delete a issue', function (done) {
     
    chai
        .request(server)
        .del('/api/issues/test')
        .send({_id:generalID})
        .end(function (err, res) {
          assert.equal(res.body.result,'successfully deleted');
         
        })
    chai
          .request(server)
          .get(`/api/issues/test?_id=${generalID}`)
          .end(function (err, res) {
           assert.lengthOf(res.body,0);
             done();
          })
        });

  test('Delete without id', function (done) {
     
    chai
        .request(server)
        .del('/api/issues/test')
        .send({})
        .end(function (err, res) {
          assert.equal(res.body.error,'missing _id');
         done();
        })
      })
  
  test('Delete with invalid id', function (done) {
     
    chai
        .request(server)
        .del('/api/issues/test')
        .send({_id:"invalid"})
        .end(function (err, res) {
          assert.equal(res.body.error,'could not delete');
         done();
        })
      })
  
});
