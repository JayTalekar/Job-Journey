import { storage } from "../main";
import { ref, uploadBytesResumable, getDownloadURL, getMetadata, listAll, updateMetadata, deleteObject } from "firebase/storage";

const maxSize = 5*1024*1024
export function uploadDocumentWithMetadata(uid, file, metadata, onUploadSuccessCallback, onUploadErrorCallback) {
    if(file.size > maxSize){
      throw Error("File size exceeds the allowed limit")
    }
    const file_id = metadata.customMetadata.id
    // Upload file and metadata
    const documentRef = ref(storage, `${uid}/${file_id + ".pdf"}`);
    const uploadTask = uploadBytesResumable(documentRef, file, metadata)
  
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle progress, like showing a progress bar
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Handle errors during the upload
        console.error('Error uploading document:', error);
        onUploadErrorCallback(error)
      },
      () => {
        // Handle successful upload completion
        console.log('Document uploaded successfully.');
  
        // access the download URL and metadata here
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('Download URL:', downloadURL);
          const urlMetaData = {
            customMetadata: {
              downloadURL: downloadURL
            }
          }
          updateMetadata(documentRef, urlMetaData)
          onUploadSuccessCallback(downloadURL)
        });
        
        getMetadata(uploadTask.snapshot.ref).then((metadata) => {
          console.log('Metadata:', metadata);
        });
        
      }
    );

    return true
  }

export async function getDocumentsData(uid){

  const listRef = ref(storage, uid)

  const fileArr = await listAll(listRef)
  let filesRef = []
  fileArr.items.forEach((fileRef) => {
    filesRef.push(fileRef)
  })

  let allMetaData = []

  for (let i=0; i<filesRef.length; i++){
    const data = await getMetadata(filesRef[i])
    allMetaData.push(data.customMetadata)
  }

  return allMetaData
}

export function updateDocMetadata(uid, file_id, metadata, onUpdateSuccess, onUpdateError){
  try{
    const documentRef = ref(storage, `${uid}/${file_id + ".pdf"}`);
    updateMetadata(documentRef, metadata).then(metadata => {
      onUpdateSuccess()
    }).catch(error => onUpdateError(error))
  }catch(e){
    console.error(e.message)
    return false
  }
}

export function deleteDocument(uid, file_id, onDeleteSuccess, onDeleteError){
  try{
    const documentRef = ref(storage, `${uid}/${file_id + ".pdf"}`);
    deleteObject(documentRef).then(metadata => {
      onDeleteSuccess()
    }).catch(error => onDeleteError(error))
  }catch(e){
    console.error(e.message)
    return false
  }
}