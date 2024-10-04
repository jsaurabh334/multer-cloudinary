const express = require('express')
const mongoose = require('mongoose');
const multer= require('multer');
const cloudinary=require('./cloudinary/cloudinary')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://jsaurabh334:jsaurabh334@cluster0.w1qui.mongodb.net/img?retryWrites=true&w=majority&appName=Cluster0").then(()=>console.log("database connected")).catch((err)=>console.log(err))

const userschema = mongoose.Schema({
    username:String,
    password:String,
    file:String,
})
const models = mongoose.model('user', userschema)

const storage=multer.diskStorage({
    destination: function (req,file,callback) {
        callback(null,"./uploads")
        
    },
    filename: function (req,file,callback) {
        const filename=`image-${Date.now()}.${file.originalname}`
        callback(null,filename)
    }
})
const filefilter=(req,file,callback)=>{
if (file.mimetype==="image/png" || file.mimetype==="image/jpg" || file.mimetype ==="image/jpeg") {
    callback(null,true)
    
}
else{
    callback(null,false)
    return callback(new Error("only png jpg and jpeg are allowed"))
}
}
const upload = multer({storage:storage,fileFilter:filefilter})



app.post('/register', upload.single("profile"),async(req, res) => {
    const filepath =req.file?.path
   const upload= await cloudinary.uploader.upload(filepath)
   console.log(upload.secure_url)

    res.send('Hello World!')
}
)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))