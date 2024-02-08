import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  private storage = getStorage(); 

  uploadVideo(blob: Blob, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Get a reference to the storage service
      const storageRef = ref(this.storage, path);
      const uploadTask = uploadBytes(storageRef, blob);

      uploadTask
        .then((snapshot) => {
           // Upload completed successfully, now we can get the download URL
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log('File available at', downloadURL);
          resolve(downloadURL); // Resolve the promise with the download URL
        })
        .catch((error) => {
          console.error('Upload failed', error);
          reject(error); // Reject the promise if there was an error

        });
    });
  }
}