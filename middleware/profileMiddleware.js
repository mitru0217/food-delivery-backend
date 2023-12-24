const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = path.resolve(__dirname, '../tmp'); // Используем абсолютный путь
//Движок дискового пространства. Дает полный контроль над размещением файлов на диск.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); //указываем куда сохраняем
  },
  filename: (req, file, cb) => {
    const [, extension] = file.originalname.split('.');
    //с помощью uuidv генерируем новое уникальное название файла,потому что файлы с одинаковым названием презатирают
    //друг друга
    cb(null, `${uuidv4()}.${extension}`);
  },
  //огранииваем размер файла 2Мб:
  limits: {
    fileSize: 2000000,
  },
  //Задаём функцию для того, чтобы решать, какие файлы будут загружены, а какие — нет:
  fileFilter: (req, file, cb) => {
    // Проверка типа файла
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png'
    ) {
      // Разрешаем загрузку
      cb(null, true);
      return;
    } else {
      // Отклоняем файлы других типов
      cb(new Error('Недопустимый тип файла'));
    }
  },
});

const profileMiddleware = multer({ storage: storage }).single('avatar');

module.exports = { profileMiddleware };
