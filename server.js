const express = require("express");
const { sendMailFun } = require("./sendMailFun");
const html_to_pdf = require("html-pdf-node");
const fs = require("fs");

const request = require("request");
const expressApp = express();

expressApp.use(express.static(__dirname + "/CertificateTheme"));
expressApp.use(express.static(__dirname + "/CertificateTheme/UserPdf"));
expressApp.use(express.json());

expressApp.get("/", (req, res) => {
  res.send("This page has been deployed 4th time !!");
});

expressApp.post("/sendCertificateResult", (req, res) => {
  // uid, username, email, score, date
  let msg = "";
  let name =
    req.body.username.replaceAll(" ", "_") +
    "_" +
    req.body.certificate_name.replaceAll(" ", "_");
  let path = __dirname + `/CertificateTheme/UserData/${name}.html`;
  let options = { height: "603px", width: "880px" };

  htmlRead = fs.readFileSync(
    __dirname + "/CertificateTheme/UserData/Certificate.html",
    "utf8"
  );

  let htmlReadWithUserName = htmlRead
    .toString()
    .replace("USER_NAME", req.body.username);

  htmlReadWithUserName = htmlReadWithUserName.replace(
    "CERTI_NAME",
    req.body.certi_name
  );

  htmlReadWithUserName = htmlReadWithUserName.replace("SCORE", "200");
  let d = new Date();

  date = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
  htmlReadWithUserName = htmlReadWithUserName.replace("DATE", date);

  fs.writeFileSync(path, htmlReadWithUserName);

  let file = { url: path };

  html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
    fs.writeFile(
      name + ".pdf",
      pdfBuffer,
      async () => {
        await sendMailFun(
          req.body.username,
          req.body.email,
          req.body.uid,
          req.body.result,
          __dirname + "/" + name + ".pdf",
          "Certificate"
        )
          .then((response) => {
            msg = response;
            console.log(response);
          })
          .catch((err) => {
            msg = err;
          });
      }
    );
    console.log("DONE");
  });

  res.send(msg);
});

expressApp.post("/sendVerificationMail", (req, res) => {
  let msg = "";
  sendMailFun(
    req.body.username,
    req.body.email,
    req.body.uid,
    "",
    "",
    "verification"
  )
    .then((response) => {
      msg = response;
      console.log(response);
    })
    .catch((err) => {
      msg = err;
    });

  res.send(msg);
});

expressApp.post("/runCode", (req, res) => {
  request(
    {
      url: "https://api.jdoodle.com/v1/execute",
      method: "POST",
      json: req.body,
    },
    (a, b, body) => {
      res.send(body);
    }
  );
});

const port = process.env.PORT || 5001;

expressApp.listen(port, () => {
  console.log("Server is running...");
});
