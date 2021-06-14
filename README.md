# Take Photo in Angular11

In this project i used MediaDevices.getUserMedia() to take photo by device camera in an Angular project.
The MediaDevices.getUserMedia() method prompts the user for permission to use a media input which produces a MediaStream with tracks containing the requested types of media. 

## HTML Template
```
<div class="record-video-btn">
  <button *ngIf="!isCapturingImage" type="button" (click)="onStartImageCamera()">{{ cameraButtonTitle }}</button>
  <button *ngIf="isCapturingImage" type="button"  (click)="capturePhoto()" >Take Photo</button>
</div>

<div class="record-video-container">
  <video #photo class="photo-camera" autoplay [hidden]="!isCapturingImage"></video>
  <canvas #canvas class="photo-camera" [hidden]="isCapturingImage"></canvas>
</div>
```

The first button will start the camera at the first time.it will ask user to allow device camera to record.
If the user allow then the camera will start.
By clicking on "Take Photo" the photo will be saved.you can also click on "Take photo Again" if you like.

## Ts file
```
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  @ViewChild('canvas') public canvas!: ElementRef;
  @ViewChild('photo') public photoElement!: ElementRef;
  public isCapturingImage: boolean = false;
  public imageWidth = 0;
  public imageHeight = 0;
  public image: any;
  public imageFile: any;
  public photoStream: any;
  public isPhotoTaken: boolean = false;
  public cameraButtonTitle: string = "Start the Camera";
  public photoContraints: any = {
    video: {
      facingMode: "user",
    }
  }
  constructor(
    private renderer: Renderer2,
  ) { 
     
  }

  capturePhoto(): void {
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.imageWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.imageHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.photoElement.nativeElement, 0, 0);
    this.image = this.canvas.nativeElement.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    // convert base64 string to file
    this.imageFile = this.dataURLtoFile(this.image, "user-image.jpg");
    
    if (this.photoStream != null) {
      this.isPhotoTaken = true;
      this.photoStream.getTracks().forEach(function(track: any) {
        track.stop();
      });
      this.cameraButtonTitle = "Take photo Again"

    }
    this.isCapturingImage = false;

  }

  dataURLtoFile(dataurl: any, filename: string): any {

    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: "image/png" });
  }

  onStartImageCamera(): void {
    this.isCapturingImage = true;
    this.startTakingImage();
  }

  startTakingImage(): void {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.photoContraints).then(this.attachPhoto.bind(this)).catch(this.handlePhotoError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  attachPhoto(stream: any): void {
    this.renderer.setProperty(this.photoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.photoElement.nativeElement, 'play', (event) => {
      this.imageHeight = this.photoElement.nativeElement.videoHeight;
      this.imageWidth = this.photoElement.nativeElement.videoWidth;
    });
    this.photoStream = stream
  }

  handlePhotoError(error: any): void {
    console.log('Error: ', error);
  }
}


```

## Display the photo
After taking photo we will draw the image in canvas 
```
  <canvas #canvas class="photo-camera" [hidden]="isCapturingImage"></canvas>
```
Ts file:
```
    this.canvas.nativeElement.getContext('2d').drawImage(this.photoElement.nativeElement, 0, 0);
```
## Convert it to a file 
```
    this.image = this.canvas.nativeElement.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
    
    // convert base64 string to file
    this.imageFile = this.dataURLtoFile(this.image, "user-image.jpg");```

