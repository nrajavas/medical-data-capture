const SENDGRID_API_KEY = "";
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors());

const fs = require("fs");

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.post('/send-mail', function (req, res) {
  console.log(req.body.email);
  console.log(req.body.attachment);
  //console.log(req.body.image);
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


function sendMail(emailInput, pathToAttachment, imagePath) { 
  hardcodePath = ""
  attachment = fs.readFileSync(hardcodePath).toString("base64");

  const msg = {
    to: `${emailInput}`,
    from: '',
    subject: 'Hello! Just testing out Sendgrid!',
    text: 'Just testing out Sendgrid!',
    html: `There should be some text from ${imagePath} here.`,
    attachments: [
      {
        content: attachment,
        filename: "attachment.pdf",
        type: "application/pdf",
        disposition: "attachment"
      }
    ]
  };
  
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