import multer from 'multer'

const memoryStorage = multer.memoryStorage();

const inMemoryStorage = multer({storage:memoryStorage});

export { inMemoryStorage }