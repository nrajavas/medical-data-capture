const SENDGRID_API_KEY = "";
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors());

var AWS = require("aws-sdk");
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

var bucketName = '';

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.post('/send-mail', function (req, res) {
  console.log(req.body.email);
  sendMail(req.body.email, req.body.attachment, req.body.image);
  console.log("EMAIL SUCCESSFULLY SENT")
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.send('SEND MAIL');  
})

app.listen(3000, function () {
  console.log('LISTENING on port 3000');
})

function uploadImage(userImage) {
  buf = Buffer.from(userImage.replace(/^data:image\/\w+;base64,/, ""),'base64');
  var params = {
    Body: buf, 
    Bucket: bucketName, 
    Key: "user_upload.jpg",
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
   };
   s3.putObject(params, function(err, data) {
     if (err) console.log(err, err.stack);
     else     console.log(data);
   });
}

function retrieveAttachment() {
  var params = {
    Bucket: bucketName, 
    Key: "user_upload.jpg"
   };
   s3.getObject(params, function(err, data) {
     if (err) console.log(err, err.stack);
     else     console.log(data);
   });
}


function sendMail(emailInput, pathToAttachment, imagePath) { 

  var msg = {
    to: `${emailInput}`,
    from: '',
    subject: 'Hello! Just testing out Sendgrid!',
    text: 'Just testing out Sendgrid!',
    html: 'There is no attachment!',
  };

  if (pathToAttachment !== "") {
    msg = {
      to: `${emailInput}`,
      from: '',
      subject: 'Hello! Just testing out Sendgrid!',
      text: 'Just testing out Sendgrid!',
      html: '<img src="cid:myimagecid"/>',
      attachments: [
        {
          content: pathToAttachment.replace(/^data:image\/\w+;base64,/, ""),
          filename: "attachment.png",
          type: "image/png",
          disposition: "attachment"
        }
      ]
    };
  } else if (imagePath !== "") {
    userImage = imagePath.replace(/^data:image\/\w+;base64,/, "");
    msg = {
      to: `${emailInput}`,
      from: '',
      subject: 'Hello! Just testing out Sendgrid!',
      text: 'Just testing out Sendgrid!',
      html: '<img src="cid:myimagecid"/>',
      attachments: [
        {
          content: userImage,
          filename: "imageattachment.png",
          content_id: "myimagecid",
        }
      ]
    };
  }
  
  sgMail
    .send(msg)
    .then(() => {}, error => {
  
      if (error.response.status !== 200) {
        console.error(error.response.body);
      }
      else {
        console.log(emailInput);
        console.log(pathToAttachment);
      }
    });
    
}