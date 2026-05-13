import multer from 'multer'

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'thumbnails/')
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.')[1]

    const filename = req.params.recipe_id

    cb(null, `${filename}.${fileExtension}`)
  },
})

export const uploadMiddleware = multer({ storage })