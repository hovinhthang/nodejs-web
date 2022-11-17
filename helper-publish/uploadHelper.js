const multer  = require('multer');
var path = require('path');
let uploadFile = (field,folderDes = './public/upload/users') =>{
    // multer upload storage
 const storage = multer.diskStorage({
    destination:  (req, file, cb) =>{
      cb(null, folderDes)
    },
  
    filename:  (req, file, cb) => {
        var test = 'hvt';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  
      cb(null, file.fieldname + '-' + test +'-'+ uniqueSuffix +'-'+ path.extname(file.originalname));
      
    }, 
  
  });
   
  
  const upload = multer({ 
    storage: storage,
   
    fileFilter: (req, file, cb) => {
        
        const filetypes = new RegExp('jpeg|jpg|png|gif');
        const extname 	= filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype  = filetypes.test(file.mimetype);

        if(mimetype && extname){
             cb(null,true);
        }else {
            cb(new Error('Lỗi'));
        }			
    }

 }).single(field);

    return upload;
  
}

module.exports = {
    upload : uploadFile
}