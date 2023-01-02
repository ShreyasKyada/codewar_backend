const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID =
  "316485911822-tstt57a8gnaa38jpdknns5rk0joa05cp.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//042XD4Hj8abd2CgYIARAAGAQSNwF-L9IrKoeSS_lA7PqfczJurtXP3FF6UZQRFj9H2M7w2picIDqzURxV2QgeWeLr56Qrr-FBbko";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMailFun = async (
  _username,
  _mail,
  _uid,
  _result,
  _pdfPath,
  _mode
) => {
  try {
    const accesssToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "oAuth2",
        user: "codewarproject2022@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accesssToken,
      },
    });
    let emailOptions = null;
    if (_mode === "verification") {
      emailOptions = {
        from: "codewarproject2022@gmail.com",
        to: _mail,
        subject: "CodeWar certification result",
        text: "This is verification mail.",
        html: `<div style="max-width: 800px; border: 2px solid rgb(88, 88, 88); padding: 40px; ">
        <div style="max-width: 370px; margin: 0 auto;">
            <img src="https://firebasestorage.googleapis.com/v0/b/codewar-project-2022.appspot.com/o/Logo%20(1).png?alt=media&token=e6bd88f4-a5ad-4f36-a598-14323d79305b"
                height="50px" width="200px"></img>
            <p><strong><span style="font-size: 14pt;">Hello ${_username},</span></strong></p>
            <p>Thanks for your interest in CodeWar! To complete your registration, we need to verify your email address.
            </p>
            <a href="http://localhost:3000/verification?mode=verification&uid=${_uid}"><button
                    style="line-height: 35px; width: 50%; border-radius: 10px; border: none; background-color: blue; color: white; cursor: pointer; margin: 10px 0">Verifiy
                    email</button></a>
            <p>Best wishes,<br />CodeWar team</p>
        </div>
    </div>`,
      };
    } else {
      if (_result === "pass") {
        emailOptions = {
          from: "codewarproject2022@gmail.com",
          to: _mail,
          subject: "CodeWar certification result",
          text: "",
          html: `<div style="max-width: 800px; border: 2px solid rgb(88, 88, 88); padding: 40px; ">
          <div style="max-width: 370px; margin: 0 auto;">
              <img src="https://firebasestorage.googleapis.com/v0/b/codewar-project-2022.appspot.com/o/Logo%20(1).png?alt=media&token=e6bd88f4-a5ad-4f36-a598-14323d79305b"
                  height="50px" width="200px"></img>
              <p><strong><span style="font-size: 14pt;">Hello ${_username},</span></strong></p>
              <p>Thank you for taking the time to attempt the CodeWar Skill Verification Test</p>
              <p><b>Congratulations </b>, You are pass in c++(basic) Skill Verification Test.</p>
              <p>Here is your certificate.</p>
              
              <p>Best wishes,<br />CodeWar team</p>
          </div>
      </div>`,
          attachments: [
            {
              path: _pdfPath,
              contentType: "application/pdf",
            },
          ],
        };
      } else {
        emailOptions = {
          from: "codewarproject2022@gmail.com",
          to: _mail,
          subject: "Verify your email address",
          text: "",
          html: `<div style="max-width: 800px; border: 2px solid rgb(88, 88, 88); padding: 40px; ">
          <div style="max-width: 370px; margin: 0 auto;">
              <img src="https://firebasestorage.googleapis.com/v0/b/codewar-project-2022.appspot.com/o/Logo%20(1).png?alt=media&token=e6bd88f4-a5ad-4f36-a598-14323d79305b"
                  height="50px" width="200px"></img>
              <p><strong><span style="font-size: 14pt;">Hello ${_username},</span></strong></p>
              <p>Thank you for taking the time to attempt the CodeWar Skill Verification Test</p>
              <p>Ohh..No!! You are failed to getting certificate.</p>
              <p>Try again to getting certificate. All The Best.</p>
              <p>Best wishes,<br />CodeWar team</p>
          </div>
      </div>`,
        };
      }
    }

    const res = await transport.sendMail(emailOptions);

    return res;
  } catch (error) {
    return error;
  }
};

module.exports = { sendMailFun };
