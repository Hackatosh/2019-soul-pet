/*** This file defines the storage used directly on the NodeJS server ***/

import multer from 'multer'

/*** In memory storage : nothing is written on the disk ***/
const memoryStorage = multer.memoryStorage();
const inMemoryStorage = multer({storage:memoryStorage});

export { inMemoryStorage }