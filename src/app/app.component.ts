import * as sendGrid from '@sendgrid/mail';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { ApiService } from './api.service';
import { catchError } from 'rxjs/operators';

const SENDGRID_API_KEY = "";
sendGrid.setApiKey(SENDGRID_API_KEY);

let attachmentToSend: string;


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

  constructor(private httpClient: HttpClient) {

    this.captures = [];

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
  }

  sendEmail(email: string) {

    console.log("Email Sent");
    console.log("Email: ", email);
    console.log("Attachment Sent With Email: ", attachmentToSend);
    console.log("Image sent", this.captures[0]);
    
    return this.httpClient.post('http://localhost:3000/send-mail', {"email": email, "attachment": attachmentToSend, "image": this.captures[0]}, {headers:{'Content-Type': 'application/json', 'Accept': 'application/json'}, responseType: 'text'}).subscribe();
    
  }

  sendAttachment(attachment: string) {
    
    attachmentToSend = attachment;
    console.log("Attachment Button Clicked");
    console.log("Attachment: ", attachment);
    console.log("Attachment To Send: ", attachmentToSend);

  }

}
