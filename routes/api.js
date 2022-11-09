'use strict';
 const Issue = require("../models/issue");

module.exports = function (app) {

   app.route('/api/issues/:project')
  
    .get( async function (req, res){
      let project = req.params.project;
      
      
      
       req.query.project= req.params.project;
        
        
        let issues=  await Issue.find(req.query);
         return res.json(issues);
     
      
    })
    
    .post( async function (req, res){
      let project = req.params.project;
      
      
    const {issue_title,issue_text,created_by,assigned_to,status_text}=req.body;
      const issue = new Issue({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text
          
          
          
    })
        
      await issue.save()
        .then(data=>{
          
            return  res.json({issue_title:issue.issue_title,
                  issue_text:issue.issue_text,
                  created_by:issue.created_by ,
                  assigned_to:issue.assigned_to,
                  status_text:issue.status_text,
                  created_on:issue.created_on,
                  updated_on:issue.updated_on,
                  open:issue.open,
                  _id:issue._id});
        })
        .catch(error=>{
         return  res.json({error: 'required field(s) missing'})
      });
      
      
    })
    
    .put(async function (req, res){
      let project = req.params.project;
      
      const {_id,issue_title,issue_text,created_by,assigned_to,status_text,open}=req.body;
      const query= {};
      
      if(!issue_title==""){
        query.issue_title=issue_title;
      }
      if(!issue_text==""){
        query.issue_text=issue_text;
      }
      if(!created_by==""){
        query.created_by=created_by;
      }
      if(!assigned_to==""){
        query.assigned_to=assigned_to;
      }
      if(!status_text==""){
        query.status_text=status_text;
      }
      if(!open==false){
        query.open=open;
      }
      query.updated_on=Date.now();
      
      
      if(!_id){
      return   res.json({ error: 'missing _id' });
      }
      if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        
          return res.json({ error: 'could not update', '_id': _id });
        }  
      
      if(!issue_title && !issue_text && !created_by && !assigned_to && !status_text){
       
       return  res.json( { error: 'no update field(s) sent', '_id': _id } )
      }
        let issue = await Issue.findByIdAndUpdate(_id,{$set:query})
          if(issue){
            
            return  res.json({  result: 'successfully updated', '_id': _id });
          }else{
            return res.json({ error: 'could not update', '_id': _id });
          }
    
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      const _id= req.body._id;
      if(!_id){
        
        return   res.json({ error: 'missing _id' });
      }
      Issue. findByIdAndDelete(_id,(err,data)=>{
        if(err){
          
          res.json({ error: 'could not delete', '_id': _id });
        }else if(!data){
          
          res.json({ error: 'could not delete', '_id': _id });
        }else{
          
          return  res.json({  result: 'successfully deleted', '_id': _id });
        }
      })
    });
    
};
