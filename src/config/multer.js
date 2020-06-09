import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'), // Pasta onde as imagens vao ser salvas
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => { // Passando o parametro de 16 Bytes e o callback de erro e resposta
        if (err) return cb(err); // Caso de errado

        return cb(null, res.toString('hex') + extname(file.originalname)); // Caso de certo o 1 parametro é o null pois nao deu erro, o segundo é transformando os bytes em hexadecimal e concatenando com o tipo do arquivo. Ex: 35ufjsdklgjsdg.png
      })
    },
  }),
};

