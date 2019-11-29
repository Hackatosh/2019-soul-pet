import multer from 'multer'
const tempUpload = multer({ dest: 'temp' });

export { tempUpload }