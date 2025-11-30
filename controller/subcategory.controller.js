import '../model/connection.js';
import rs from 'randomstring';
import url from 'url';
import path from 'path';

import SubCategorySchemaModel from '../model/subcategory.model.js';


export const save =async(req,res)=>{
    var scList=await SubCategorySchemaModel.find();    
    var l=scList.length;
    var _id=l==0?1:scList[l-1]._id+1;
   
    var caticon=req.files.caticon;
    
    var subcaticonnm = rs.generate()+"-"+Date.now()+"-"+caticon.name;
    var scDetails={...req.body,"subcaticonnm":subcaticonnm,"_id":_id};
    
    try {
     await SubCategorySchemaModel.create(scDetails);
     var __dirname = url.fileURLToPath(new URL('.', import.meta.url));
     var uploadpath=path.join(__dirname,"../../API/uploads/subcaticons",subcaticonnm);
     caticon.mv(uploadpath);  
     res.status(201).json({"status":true}); 
    }
    catch(error)
    {
       //console.log(error);
       res.status(500).json({"status":false});  
    }
   
}

export var fetch=async(req,res)=>{
    var condition_obj=url.parse(req.url,true).query; 
    //console.log(condition_obj)   
    var scList=await SubCategorySchemaModel.find(condition_obj);
    //console.log(scList)
    if(scList.length!=0)
      res.status(200).json(scList);
    else
      res.status(404).json({"status":"Resource not found"});
  };
  