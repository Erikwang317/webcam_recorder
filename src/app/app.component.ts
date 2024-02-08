import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { RecordingService } from './recording.service';

type RecordingState = 'NONE' | 'RECORDING' | 'STOPPED' | 'CONFIRMED';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('videoElement') videoElement: any;
  title = 'frontend';
  videoBlobUrl: any = null;
  video: any;
  state: RecordingState = 'NONE';

  constructor(
    private RecordingService: RecordingService,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.RecordingService.getMediaStream().subscribe((data) => {
      this.video.srcObject = data;
      this.ref.detectChanges();
    });
    this.RecordingService.getBlob().subscribe((data) => {
      this.videoBlobUrl = this.sanitizer.bypassSecurityTrustUrl(data);
      this.video.srcObject = null;
      this.ref.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.video = this.videoElement.nativeElement;
  }

  startRecording() {
    this.RecordingService.startRecording();
    this.state = 'RECORDING';
  }

  stopRecording() {
    this.RecordingService.stopRecording();
    this.state = 'STOPPED';
  }

  downloadRecording() {
    this.RecordingService.downloadRecording();
  }

  clearRecording() {
    this.RecordingService.clearRecording();
    this.video.srcObject = null;
    this.videoBlobUrl = null;
    this.state = 'NONE';
  }

  reviewRecording() {
    if (this.state === 'STOPPED') {
      this.RecordingService.reviewRecording();
    } else {
      console.error('Recording not ready for review.');
    }
  }

  redoRecording() {
    this.RecordingService.redoRecording();
    this.state = 'RECORDING';
  }

  confirmRecording(){
    this.RecordingService.confirmRecording();
    this.state = 'CONFIRMED';
  }
}