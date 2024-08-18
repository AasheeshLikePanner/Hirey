import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req:any, file:any, cb:any) {
      cb(null, './public/temp')
    },
    filename: function (req:any, file:any, cb:any) {
      const uniqueSuffix = Date.now() + '-' +
         Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
export const upload = multer({ storage, })