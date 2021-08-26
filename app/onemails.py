from email.mime.text import MIMEText
import smtplib

def welcome(email, username):
    from_email = 'iporangeweb@gmail.com'
    from_password = 'IPORange413'
    to_email = email

    subject = 'Welcome to IPO Range'
    message = """ 
    Dear {name},
      \r\n Welcome to IPORange.com! From here, you will be able to receive useful and free data for priced IPOs and upcoming IPOs in the USA stock market. We hope our product could help you discover potential gainers and avoid highly possible losers in the IPO market. Good luck hunting! 
    Best regards,
    IPO Range team.""".format(name=username)

    msg = MIMEText(message, 'html')
    msg['Subject'] = subject
    msg['To'] = to_email
    msg['From'] = from_email

    gmail=smtplib.SMTP('smtp.gmail.com', 587)
    gmail.ehlo()
    gmail.starttls()
    gmail.login(from_email, from_password)
    gmail.send_message(msg)

def forgotemail(email, username, usercode):
    from_email = 'iporangeweb@gmail.com'
    from_password = 'IPORange413'
    to_email = email

    href = 'https://www.iporange.com/#/resetpassword/' + usercode
    subject = 'Reset password at IPO Range'
    message = 'Dear {name},\n  You just requested to reset your password at IPORange.com, please use the link below to reset your password:\n <a href={href}>{link}</a>\n  If you were not asking for such a request, your password might be exposed to someone else and your account is in danger. Please reset your password ASAP to secure your account.\nBest regards,\nIPO Range team.'.format(name=username, href=href, link=href)

    msg = MIMEText(message, 'html')
    msg['Subject'] = subject
    msg['To'] = to_email
    msg['From'] = from_email

    gmail=smtplib.SMTP('smtp.gmail.com', 587)
    gmail.ehlo()
    gmail.starttls()
    gmail.login(from_email, from_password)
    gmail.send_message(msg)
