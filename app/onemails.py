from email.mime.text import MIMEText
import smtplib

def welcome(email, username):
    from_email = 'qpang413@gmail.com'
    from_password = 'pqy413684@god'
    to_email = email

    subject = 'Welcomee to IPO Secretary'
    message = 'Dear {name}, Welcome to IPOSecretary.com! From here, you will get useful statistic data for priced IPOs and upcoming IPOs.Good Luck!'.format(name=username)

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
    from_email = 'qpang413@gmail.com'
    from_password = 'pqy413684@god'
    to_email = email

    href = 'http://localhost:3000/resetpassword/' + usercode
    subject = 'Reset password at IPO Secretary'
    message = 'Dear {name}, Please use this link <a href={href}>{link}</a> to reset your password!'.format(name=username, href=href, link=href)

    msg = MIMEText(message, 'html')
    msg['Subject'] = subject
    msg['To'] = to_email
    msg['From'] = from_email

    gmail=smtplib.SMTP('smtp.gmail.com', 587)
    gmail.ehlo()
    gmail.starttls()
    gmail.login(from_email, from_password)
    gmail.send_message(msg)