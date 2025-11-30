import '../model/connection.js';
import  CategorySchemaModel from '../model/category.model.js';
import rs from 'randomstring';
import url from 'url';
import path from 'path';

export const save =async (req,res)=>{
    //console.log("h1");
    var cList=await CategorySchemaModel.find();    
    var l=cList.length;
    var _id=l==0?1:cList[l-1]._id+1;  
    var caticon=req.files.caticon;
    console.log(caticon);
    var caticonnm = rs.generate()+"-"+Date.now()+"-"+caticon.name;
    var cDetails={...req.body,"caticonnm":caticonnm,"_id":_id};
  try {
   await CategorySchemaModel.create(cDetails);
   var __dirname = url.fileURLToPath(new URL('.', import.meta.url));
   var uploadpath=path.join(__dirname,"../../API/uploads/caticons",caticonnm);
   caticon.mv(uploadpath);  
   res.status(201).json({"status":true}); 	
 }
 catch(error)
 {
    console.log(error);
    res.status(500).json({"status":false});  
 }

}

export const fetch =async (req,res)=>{
var condition_obj=  url.parse(req.url,true).query;
//console.log(condition_obj);
   var cList = await CategorySchemaModel.find(condition_obj);
   //console.log(cList);
   if(cList.length!=0)
   {
     res.status(201).json(cList);
   }
   else
   {
    res.status(404).json({"msg":"Resource not Fount"});
   }  
} 