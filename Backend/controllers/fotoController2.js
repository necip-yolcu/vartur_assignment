const fs = require('fs-extra')
const multer = require('multer')
const sharp = require("sharp");
const BACKEND_URL = process.env.BACKEND_URL;


// PHOTO CONTROLLER

//servere foto yükle (uploads klasörüne)
//1-else error handling
//2-path exist controller
const addFoto = async (req, res) => {
  // console.log("AddFOTO", req.params)
  const type = req.params.TYPE;
  const foto_id = req.params.fotoID;

  const imageToFolder = (req, res, foto_id) => {

    var myStorage = multer.diskStorage({
      destination: (callback) => {
        callback(null, `./uploads/${type}/${foto_id}`)  //orj foto uzantısı
      },
      filename: (file, callback) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8') //türkçe karakter izin veriyor
        callback(null, file.originalname) //orj foto isim belirleme //TODO eğer tarih gerekirse ???
      }
    })

    var upload = multer({ storage: myStorage }).array('foto_sending_name'); //orj foto yükleme

    //küçük resim dosya uzantı kontrol ve küçük resim kaydetme
    upload(req, res, async function (error) {
      if (error) {
        return res.end('Error Uploading File');
      } else {
        req?.files?.map(async (file) => {
          try {
            await sharp(`./uploads/${type}/${foto_id}/${file.filename}`)
              .resize({ width: 200, })
              .toFile(`./uploads/${type}/${foto_id}/` + "200x-" + file.filename);

            const imagePath = `${type}/${foto_id}`;
            // console.log("imagePath", imagePath);
            return res.status(200).send({ imagePath, message: "Fotoğraf başarıyla yüklendi !" })
          } catch (error) { console.log("image ", error) }
        })
      }
    })

  }
  //Dosya Yolunun Olup olmadığı Kontrolü
  if (await fs.pathExists(`./uploads/${type}/${foto_id}`))
    imageToFolder(req, res, foto_id)
  else
    await fs.mkdirs(`./uploads/${type}/${foto_id}`, function (err) {
      if (err) {
        return console.error(err)
      }
      // console.log("success!")
      imageToFolder(req, res, foto_id)
      // res.send(req.file)
    })
};

//serverden fotoları çağır
const getFotos = async (req, res) => {
  const type = req.params.TYPE;
  const foto_id = req.params.fotoID;
  const fotoName = req.params.fotoName;
  // console.log("BACKEND getfotos:c,p,f", foto_id, fotoName)

  try {
    res.sendFile(`./uploads/${type}/${foto_id}/${fotoName}`, { root: "./" })
  } catch (error) {
    return res.send("Foto çağırma başarısız")
  }
}

//serverdan foto sil
const deleteFoto = async (req, res) => {
  // console.log("foto silinme çağrıldı NEW !!!", req.params)
  const type = req.params.TYPE;
  const foto_id = req.params.fotoID;
  const fotoName = req.params.fotoName;

  try {
    fs.remove(`./uploads/${type}/${foto_id}/${fotoName}`, err => {
      if (err && err.code == 'ENOENT') {// file doens't exist
        res.send("Dosya yok, yani kaldırılamıyor.")
      } else if (err) { // other errors, e.g. maybe we don't have enough permission
        res.send("Dosya kaldırılmaya çalışılırken hata meydana geldi")
      } else {
        res.send("Dosya kaldırıldı")
      }
    })
  } catch (error) {
    return res.send("Foto silinme başarısız")
  }
}

//serverdan klasör sil //TODO belki üstteki ile birleştirilebilir.
const deleteFolder = async (req, res) => {
  // console.log("klasör silinme çağrıldı NEW !!!", req.params)
  const type = req.params.TYPE;
  const foto_id = req.params.fotoID;

  try {
    fs.remove(`./uploads/${type}/${foto_id}`)
      .then((result) => {
        res.send({ message: "Klasör kaldırıldı" })
      }).catch((err) => {
        if (err && err.code == 'ENOENT') {// file doens't exist
          res.send({ message: "Klasör yok, yani kaldırılamıyor." })
        } else if (err) { // other errors, e.g. maybe we don't have enough permission
          res.send({ message: "Klasör kaldırılmaya çalışılırken hata meydana geldi" })
        }

    });
    // fs.remove(`./uploads/${type}/${foto_id}`, err => {
    //   if (err && err.code == 'ENOENT') {// file doens't exist
    //     res.send({ message: "Klasör yok, yani kaldırılamıyor." })
    //   } else if (err) { // other errors, e.g. maybe we don't have enough permission
    //     res.send({ message: "Klasör kaldırılmaya çalışılırken hata meydana geldi" })
    //   } else {
    //     res.send({ message: "Klasör kaldırıldı" })
    //   }
    // })
  } catch (error) {
    return res.send({ message: "Klasör silinme başarısız" })
  }
}

module.exports = {
  addFoto,
  getFotos,
  deleteFoto,
  deleteFolder
};
