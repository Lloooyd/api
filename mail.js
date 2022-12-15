const moment = require("moment");
const nodemailer = require('nodemailer');

const mail = (app) => {

    app.post('/api/mail/otp', (req, res) => {
        
        try {

            console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' POST /api/util/otp');
            console.log(req.body)

            req.checkBody("otp", "verification no. is required").notEmpty();
            req.checkBody("email", "email is required").notEmpty();

            var errors = req.validationErrors();
            if (errors) {
                console.log(errors);
                res.status(500).json(errors);
                return;
            }

            let otp = req.body.otp;
            let email = req.body.email;

            let otpTemplate = "";
            otpTemplate += '<!DOCTYPE html> '
            otpTemplate += '<html  style="font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> '
            otpTemplate += '<head> '
            otpTemplate += '<meta name="viewport" content="width=device-width" /> '
            otpTemplate += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> '
            otpTemplate += '</head> '
            otpTemplate += '<body> '
            otpTemplate += '<table> '
            otpTemplate += '<tr> '
            otpTemplate += '<td> '
            otpTemplate += '</td> '
            otpTemplate += '<td> '
            otpTemplate += '      <div> '
            otpTemplate += '        <table width="100%" cellpadding="0" cellspacing="0" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; Margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff"> '
            otpTemplate += '		<tr> <td style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 16px;  '
            otpTemplate += '		vertical-align: top; color: #fff; font-weight: 500; text-align: center; border-radius: 3px 3px 0 0; background-color: #0E9208; margin: 0;  '
            otpTemplate += '		padding: 20px;" align="center" bgcolor="#FF9F00" valign="top"> '
            otpTemplate += '              IREQUEST VERIFICATION CODE '
            otpTemplate += '            </td> '
            otpTemplate += '          </tr> '
            otpTemplate += '		  <tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"> '
            otpTemplate += '		  <td style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top"> '
            otpTemplate += '               '
            otpTemplate += '			  <table> '
            otpTemplate += '			  <tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top"> '
            otpTemplate += '                    Use this verification code : '
            otpTemplate += '                  </td> '
            otpTemplate += '                </tr> '
            otpTemplate += '				<tr> '
            otpTemplate += '				<td style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 20px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top"> '
            otpTemplate += '                    ' + otp + ''
            otpTemplate += '                  </td> '
            otpTemplate += '                </tr> '
            otpTemplate += '                </tr></table></td> '
            otpTemplate += '          </tr></table> '
            otpTemplate += '		   '
            otpTemplate += '			</div> '
            otpTemplate += '    </td> '
            otpTemplate += '    <td></td> '
            otpTemplate += '  </tr></table> '
            otpTemplate += '  </body> '
            otpTemplate += '</html> '


            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, 
                "auth": {
                    "user": 'groupfour.irequest@gmail.com',
                    "pass": 'ygqlgpadgkbxwcam'
                }
            });

            var mailOptions = {
                from: 'groupfour.irequest@gmail.com',
                to: email,
                subject: 'iRequest Verification Code',
                html: otpTemplate,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.status(500).json(error)
                    console.log(error)
                    return;
                }
                console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")  + ': message sent: email :' + email + ", otp:" + otp + " : " + info.response);
                res.status(200).json(info.response)
            });

        } catch (error) {
            console.log(error)
        }



    })

}


module.exports = mail;
