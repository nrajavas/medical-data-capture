import * as sendGrid from '@sendgrid/mail';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';

const SENDGRID_API_KEY = "";
sendGrid.setApiKey(SENDGRID_API_KEY);

var attachmentToSend = "";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'medical-data-capture';

  @ViewChild("video")
    public video: ElementRef;

  @ViewChild("canvas")
  public canvas: ElementRef;

  public captures: Array<any>;
  public numOfPics: number;

  constructor(private httpClient: HttpClient) {

    this.captures = [];
    this.numOfPics = 0;

  }

  public ngOnInit() { }

  public ngAfterViewInit() {
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
              this.video.nativeElement.srcObject = stream;
              this.video.nativeElement.play();
          });
      }
  }

  public capture() {
      var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
      this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
      this.numOfPics += 1;
  }

  sendEmail(email: string) {

    console.log("Email Sent");
    console.log("Email: ", email);

    if (this.captures[0]) {
      return this.httpClient.post('http://localhost:3000/send-mail', {"email": email, "attachment": attachmentToSend, "image": this.captures[this.numOfPics - 1]}, {headers:{'Content-Type': 'application/json', 'Accept': 'application/json'}, responseType: 'text'}).subscribe();
    } else {
      return this.httpClient.post('http://localhost:3000/send-mail', {"email": email, "attachment": attachmentToSend, "image": ""}, {headers:{'Content-Type': 'application/json', 'Accept': 'application/json'}, responseType: 'text'}).subscribe();
    }
    
  }

  sendAttachment(event: any) {
    
    const preview = document.querySelector('img');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      // convert image file to base64 string
      preview.src = reader.result.toString();
      attachmentToSend = reader.result.toString();
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }

  }

}
