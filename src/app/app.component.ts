import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { RecordingService } from './recording.service';
import { Subscription } from 'rxjs';
import { StarsComponent } from './stars/stars.component';

enum RecordingState {
  NONE = 'NONE',
  RECORDING = 'RECORDING',
  STOPPED = 'STOPPED',
  CONFIRMED = 'CONFIRMED',
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StarsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;
  title = 'frontend';
  videoBlobUrl: any = null;
  video: any;
  state: RecordingState = RecordingState.NONE;
  private subscriptions = new Subscription();

  constructor(
    private RecordingService: RecordingService,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.subscriptions.add(this.RecordingService.getMediaStream().subscribe((data) => {
      this.video.srcObject = data;
      this.ref.detectChanges();
    }));
    this.subscriptions.add(this.RecordingService.getBlob().subscribe((data) => {
      this.videoBlobUrl = this.sanitizer.bypassSecurityTrustUrl(data);
      this.video.srcObject = null;
      this.ref.detectChanges();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.video = this.videoElement?.nativeElement;
  }

  startRecording() {
    this.RecordingService.startRecording();
    this.state = RecordingState.RECORDING;
  }

  stopRecording() {
    this.RecordingService.stopRecording();
    this.state = RecordingState.STOPPED;
  }

  downloadRecording() {
    this.RecordingService.downloadRecording();
  }

  clearRecording() {
    this.RecordingService.clearRecording();
    this.video.srcObject = null;
    this.videoBlobUrl = null;
    this.state = RecordingState.NONE;
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
    this.state = RecordingState.RECORDING;
  }

  confirmRecording(){
    this.RecordingService.confirmRecording();
    this.state = RecordingState.CONFIRMED;
  }
}