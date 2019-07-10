import { FileChecksum } from "./file_checksum"
import { BlobUpload } from "./blob_upload"

let id = 0

export class DirectUpload {

  // url: /gapi/ztoupiao/{{number}}/albums/createBeforeDirectUpload
  constructor(file, url, delegate) {
    this.id = ++id
    this.file = file
    this.url = url
    this.delegate = delegate
    this.directUploadData = directUploadData
  }

  create(callback) {
    FileChecksum.create(this.file, (error, checksum) => {
      if (error) {
        callback(error)
        return
      }
      const blob = new BlobRecord(this.file, checksum, this.url)

      //notify(this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr)

      blob.create(error => {
        if (error) {
          callback(error)
        } else {
          const upload = new BlobUpload(this.directUploadData)
          notify(this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr)
          upload.create(error => {
            if (error) {
              callback(error)
            } else {
              callback(null, blob.toJSON())
            }
          })
        }
      })
    })
  }
}

function notify(object, methodName, ...messages) {
  if (object && typeof object[methodName] == "function") {
    return object[methodName](...messages)
  }
}
