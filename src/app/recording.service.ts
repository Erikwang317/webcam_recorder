import { Injectable } from '@angular/core';
import RecordRTC from "recordrtc";
import { Subject } from "rxjs";
import { FirebaseStorageService } from './firebase-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RecordingService {
  private mediaStream: any;
  private recorder: any;
  private blob: any;
  private _mediaStream = new Subject<any>();
  private _blob = new Subject<any>();

  constructor(private firebaseStorageService: FirebaseStorageService) {
  }

  getMediaStream() {
    return this._mediaStream.asObservable();
  }

  getBlob() {
    return this._blob.asObservable();
  }

  startRecording() {
    if (this.recorder) {
      console.error('Recording is already in progress.');
      return;
    }
    this.handleRecording();
  }

  async handleRecording() {
    // @ts-ignore
    try {
      this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      this._mediaStream.next(this.mediaStream);
  
      this.recorder = new RecordRTC(this.mediaStream, {
        type: 'video'
      });
  
      this.recorder.startRecording();
    } catch (error) {
      console.error('Error initializing recording:', error);
    }
  }

  stopRecording() {
    if (!this.recorder) {
      console.error('Recorder not initialized.');
      return;
    }
    this.recorder.stopRecording(() => {
      console.log('Recording stopped, creating Blob.');
      this.blob = this.recorder.getBlob();
      if (this.blob instanceof Blob) {
        console.log('Blob created successfully.');
        this._blob.next(URL.createObjectURL(this.blob));
      } else {
        console.error('Failed to create Blob.');
      }
      this.mediaStream.stop();
      this.recorder.destroy();
      this.mediaStream = null;
      this.recorder = null;
    }) 
  }

  downloadRecording() {
    RecordRTC.invokeSaveAsDialog(this.blob, `${Date.now()}.webm`);
  }

  clearRecording() {
    this.blob = null;
    this.recorder = null;
    this.mediaStream = null;
  }

  reviewRecording() {
    // console.log(typeof(this.blob))
    if (this.blob instanceof Blob) {
      const blobUrl = URL.createObjectURL(this.blob);
      this._blob.next(blobUrl);
    } else {
      console.error('No recording available to review.');
      this._blob.next(null);
    }
  }

  redoRecording() {
    this.clearRecording();
    this.startRecording();
  }

  async confirmRecording(){
    try {
      const downloadUrl = await this.firebaseStorageService.uploadVideo(this.blob, 'videos/myvideo.webm');
      console.log("Confirmed, download URL:", downloadUrl);
      // console.log("Confitmed")
    } catch (error) {
      console.error('Error uploading recording:', error);
    }
  }
  
}
