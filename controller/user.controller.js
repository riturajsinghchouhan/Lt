import '../model/connection.js';
import url from 'url';
import jwt from 'jsonwebtoken';
import rs from 'randomstring';
import userSchemaModel from '../model/user.model.js';

 export var save =async(req,res)=>{
    var userList = await userSchemaModel.find();
    var len =userList.length;
    var _id = (len==0)?1:userList[len-1]._id+1;
   var userDetail ={...req.body,"_id":_id,"role":"user","status":0,"info":Date()}; 
  //  console.log(userDetail) ;
   try{
    const users =await userSchemaModel.create(userDetail);
    //console.log(userDetail)
    res.status(201).json({"status":"Resoure reated successfully"});
   }
   catch(err)
   { 
    
    console.log(err);
    res.status(500).json({"status":"false"});
   }
   }

   export const fetch = async(req,res)=>{
    //  console.log("h1");
     var condition_obj = url.parse(req.url,true).query;
      //console.log(condition_obj);
      var user =await userSchemaModel.find(condition_obj);
      //console.log(user);
     if(user.length!=0)
      {
        res.status(200).json(user);
      }
      else
      {
        res.status(404).json({"result":"user not found in database"});
      }

  }

  // export const update =async(req,res)=>{
  //  //console.log("h1");
  //   var condition_obj =req.body.condition_obj;    
  //   //console.log(condition_obj);
  //    var user= await userSchemaModel.findOne(condition_obj);
  //    //console.log(user);
  //     if(user)
  //     {
  //       var update_user = await userSchemaModel.updateOne(req.body.condition_obj,{$set:req.body.content_obj});
  //         if(update_user)
  //         {
  //           res.status(200).json({"result":"user updated succesffully"})
         
  //         } 
  //         else
  //         {
  //           res.status(500).json({"result":"user not updated succesffully"})
  //         }
  //     } 
  //     else
  //     {
  //       res.status(404).json({"result":"user not found in databse"});
  //     }
  //   }



export const deletUser = async (req, res) => {
  const { _id } = req.body;

  try {
    const user = await userSchemaModel.findById(_id);
    if (!user) {
      return res.status(404).json({ result: 'User not found in database' });
    }

    await userSchemaModel.deleteOne({ _id });
    res.status(200).json({ result: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: 'User deletion failed', error: err.message });
  }
};


    export const login =async(req,res)=>{
        //console.log("h1");
      
      var userDetail = {...req.body,"status":1};        
       //console.log(userDetail);
     var userList =await userSchemaModel.find(userDetail);
     //console.log(userList);
     if(userList.length!=0)
     {
       const payload ={"subject":userList[0].email};
       const token = jwt.sign(payload, process.env.JWT_SECRET);
       res.status(200).json({"token":token,"userList":userList[0]}); 
     }
     else
     {
       res.status(500).json({"token":"token error"});
     }
    }

