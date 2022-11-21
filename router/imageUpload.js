const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/UserModel');
const Storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./config/files')
    },
    filename:(req,file,cb)=>{
       cb(null,req.query.name+file.originalname) 
    }
})
const upload = multer({
    storage:Storage
}).array('images', 3);
router.post('/upload',(req,res)=>{
    console.log("axios.post",req.param)
    upload(req,res,(err)=>{
        console.log("axios.post",req.files,req.query.name)
        if(err){
            res.status(401).json({ error: "not upladed" ,err:err})
        }else{
            //  req.flash('sucess',req.file.fieldname);
            //  res.redirect("./config/image");
   res.status(200).json({ msg: 'Successfully fetch data',file:req.files });
        // let image =Meeting.updateOne({_id:req.body.Id},{$set: {
        //         file:req.body.file
        //        }}
        //        ,function(err,response){
        //         if(err){
        //             res.status(401).json({ error: "upladed" ,err:err})
        //         }else{
        //             res.status(200).json({ msg: "successfully upladed" ,res:response})
        //         }
        //        }
        //        )
        }
    })
})


const userStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./src/uploads')
    },
    filename:(req,file,cb)=>{
       cb(null,req.query.name+file.originalname) 
    }
})

// const fileFilter =(req,file,cb)=>{
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' ||file.mimetype === 'image/png'){
//         cb(null,true)
//     }else{
//         cb(null,false)
//     }
// }
const profile = multer({
    storage:userStorage
}).single('images');
router.post('/profiles',(req,res,next)=>{
    console.log("axios.post000",req.files)
    profile(req,res,(err)=>{
        console.log("axios.post--",req.file,req.query.name,)
        if(err){
            res.status(401).json({ error: "not upladed" ,err:err})
        }else{
            //  req.flash('sucess',req.file.fieldname);
            //  res.redirect("./config/image");
//    res.status(200).json({ msg: 'Successfully fetch data' });
        let image =User.updateOne({name:req.query.name},{$set: {
            avatar:req.file.originalname
               }}
               ,function(err,response){
                if(err){
                 return   res.status(401).json({ error: "upladed" ,err:err})
                }else{
                 return   res.status(200).json({ msg: "successfully upladed" ,path:req.file.path})
                }
               }
               )
        }
     })
})
module.exports = router;