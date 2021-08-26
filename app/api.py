from flask import Flask, request
from flask import jsonify
from sqlalchemy import create_engine, desc, asc, func
from sqlalchemy.orm import sessionmaker
from app.tables import *
from app.onemails import *
from datetime import datetime, date
from datetime import timedelta
import requests
import lxml
import bcrypt
from bs4 import BeautifulSoup, SoupStrainer
from sqlalchemy import or_
from app.setting import SQLAlCHEMY_DATABASE_URI
from app import app
#app = Flask(__name__)

def currentdata(symbol):
    url = "https://www.marketwatch.com/investing/stock/"+ symbol.lower() +"?mod=quote_search"
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'lxml')
    content = soup.find("div", {"class": "container container--body"})
    content = content.find("div", {"class": "region region--intraday"})
    content = content.find("div", {"class": "column column--aside"})
    content = content.find("div", {"class": "element element--intraday"})
    status = content.small.div.text
    timestamp = content.find("div", {"class": "intraday__timestamp"})
    timestamp = timestamp.span.text
    # print('?????????????????????????????///')
    # print(status, timestamp)
    data = content.find("div", {"class": "intraday__data"})
    price = data.h2.text.replace('\n', '').replace('$', '')
    change = data.contents[3].find("span", {"class": "change--point--q"}).text
    percent = data.contents[3].find("span", {"class": "change--percent--q"}).text
    volume = content.find("div", {"class": "intraday__volume"})
    if (volume):
        volume = volume.find("span", {"class": "volume__value"}).text
    else:
        volume = ""
    return status, timestamp, price, change, percent, volume
    
def newsdata(symbol):
    url = "https://www.marketwatch.com/investing/stock/"+ symbol.lower() +"?mod=quote_search"
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'lxml')
    content = soup.find("div", {"class": "container container--body"})
    content = content.find("div", {"class": "region region--primary"})
    content = content.find("div", {"class": "column column--primary"})
    content = content.find("div", {"class": "element element--tabs"})
    content = content.contents[3]
    content = content.find("div", {"class": "element__body j-tabPanes"})
    content = content.find("div", {"class": "tab__pane is-active j-tabPane"})
    content = content.contents[1].div.div
    newsset = []
    i = 3
    while i < len(content.contents):
        news = {}
        which = content.contents[i]
        # print(which)
        news['headline'] = which.div.h3.text.replace('/n','').strip()
        news['href'] = ""
        if (which.div.h3.a):
            news['href'] = which.div.h3.a['href']
        news['timeline'] = which.div.div.span.text
        newsset.append(news)
        i += 2
    return newsset

@app.route('/')
def index():
    return app.send_static_file('index.html')
    # return "<h1 style='color:blue'>Hello There!</h1>"

@app.route('/api/topgainers/<days>/<num>', methods=['GET'])
def TopGainers(days,num):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    nowsdate = datetime.now()
    delta = timedelta(days=-int(days))
    datebefore = (nowsdate + delta).strftime('%Y-%m-%d')
    results = session.query(IPOBASIC).filter(IPOBASIC.OfferDate >= datebefore).order_by(desc((IPOBASIC.High_1day-IPOBASIC.OfferPrice)/IPOBASIC.OfferPrice)).limit(int(num)).all()
    gainers = []
    for row in results:
        gainers.append({'company': row.Company, 'symbol': row.Symbol, 'offerprice': row.OfferPrice, 'offerdate': row.OfferDate, 'high_1day': row.High_1day, 'offerreturn': row.Return,
                        'earn_1day': row.Earn_1day, 'high_2day': row.High_2day, 'earn_2day': row.Earn_2day, 'high_7day': row.High_7day, 'earn_7day': row.Earn_7day})
        gainers[-1]['high_1week'] = max(row.High_1day, row.High_2day, row.High_7day)
        gainers[-1]['earn_1week'] = max(row.Earn_1day, row.Earn_2day, row.Earn_7day)
        price = session.query(Quotes).filter(Quotes.Symbol == row.Symbol, Quotes.Date == row.OfferDate).one()
        gainers[-1]['startprice'] = price.Open
    return jsonify(gainers)

@app.route('/api/toplosers/<days>/<num>', methods=['GET'])
def TopLosers(days,num):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    nowsdate = datetime.now()
    delta = timedelta(days=-int(days))
    datebefore = (nowsdate + delta).strftime('%Y-%m-%d')
    results = session.query(IPOBASIC).filter(IPOBASIC.OfferDate >= datebefore).order_by(asc((IPOBASIC.Low_1day-IPOBASIC.OfferPrice)/IPOBASIC.OfferPrice)).limit(int(num)).all()
    lossers = []
    for row in results:
        lossers.append({'company': row.Company, 'symbol': row.Symbol, 'offerprice': row.OfferPrice, 'offerdate': row.OfferDate, 'low_1day': row.Low_1day, 'offerreturn': row.Return,
                        'loss_1day': row.Loss_1day, 'low_2day': row.Low_2day, 'loss_2day': row.Loss_2day, 'low_7day': row.Low_7day, 'loss_7day': row.Loss_7day})
        lossers[-1]['low_1week'] = min(row.Low_1day, row.Low_2day, row.Low_7day)
        lossers[-1]['loss_1week'] = min(row.Loss_1day, row.Loss_2day, row.Loss_7day)
        price = session.query(Quotes).filter(Quotes.Symbol == row.Symbol, Quotes.Date == row.OfferDate).one()
        lossers[-1]['startprice'] = price.Open
    return jsonify(lossers)

@app.route('/api/ipos/<symbol>', methods=['GET'])
def OneIpo(symbol):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    if symbol == 'all':
        results = session.query(IPOBASIC).filter().order_by(desc(IPOBASIC.OfferDate)).all()
        gainers = []
        for row in results:
            gainers.append({'company': row.Company, 'symbol': row.Symbol, 'offerprice': row.OfferPrice, 'offerdate': row.OfferDate, 'high_1day': row.High_1day, 'offerreturn': row.Return,
                            'earn_1day': row.Earn_1day, 'high_2day': row.High_2day, 'earn_2day': row.Earn_2day, 'high_7day': row.High_7day, 'earn_7day': row.Earn_7day})
            gainers[-1]['high_1week'] = max(row.High_1day, row.High_2day, row.High_7day)
            gainers[-1]['earn_1week'] = max(row.Earn_1day, row.Earn_2day, row.Earn_7day)
            price = session.query(Quotes).filter(Quotes.Symbol == row.Symbol, Quotes.Date == row.OfferDate).all()
            if len(price) > 0:
                gainers[-1]['startprice'] = price[0].Open
        return jsonify(gainers)
    else:
        print('====================================================')
        print(symbol)
        status, timestamp, price, change, percent, volume = currentdata(symbol)
        
        ipobasic = session.query(IPOBASIC).filter(IPOBASIC.Symbol == symbol).one()
        s = {}
        s['symbol'] = symbol
        s['status'] = status
        s['timestamp'] = timestamp
        s['price'] = price
        s['change'] = change
        s['percent'] = percent
        s['volume'] = volume
        s['company'] = ipobasic.Company
        s['Earn_1day'] = round(ipobasic.Earn_1day,4)
        s['Loss_1day'] = round(ipobasic.Loss_1day,4)
        s['High_1day'] = ipobasic.High_1day
        s['Low_1day'] = ipobasic.Low_1day
        s['Earn_2day'] = round(ipobasic.Earn_2day,4)
        s['Loss_2day'] = round(ipobasic.Loss_2day,4)
        s['High_2day'] = ipobasic.High_2day
        s['Low_2day'] = ipobasic.Low_2day
        s['Earn_7day'] = round(ipobasic.Earn_7day,4)
        s['Loss_7day'] = round(ipobasic.Loss_7day,4)
        s['High_7day'] = ipobasic.High_7day
        s['Low_7day'] = ipobasic.Low_7day
        s['Earn_14day'] = round(ipobasic.Earn_14day,4)
        s['Loss_14day'] = round(ipobasic.Loss_14day,4)
        s['High_14day'] = ipobasic.High_14day
        s['Low_14day'] = ipobasic.Low_14day
        s['Earn_30day'] = round(ipobasic.Earn_30day,4)
        s['Loss_30day'] = round(ipobasic.Loss_30day,4)
        s['High_30day'] = ipobasic.High_30day
        s['Low_30day'] = ipobasic.Low_30day
        s['OfferPrice'] = ipobasic.OfferPrice
        quote = session.query(Quotes).filter(Quotes.Date==ipobasic.OfferDate, Quotes.Symbol==symbol).all()
        if len(quote) == 1:
            s['StartPrice'] = quote[0].Open
        
        s = {'basic': s}
        similaripos = session.query(IPOBASIC).filter(IPOBASIC.Section==ipobasic.Section).all()
        if len(similaripos) <= 5:
            s['similaripos'] = [row.Symbol for row in similaripos if row.Symbol != symbol]
        else:
            similaripos = [row.Symbol for row in similaripos if row.Symbol != symbol]
            symbols = session.query(IPOBASIC).filter(IPOBASIC.Symbol.in_(similaripos)).order_by(asc(func.abs(IPOBASIC.Shares-ipobasic.Shares))).all()
            similaripos = [row.Symbol for row in symbols if row.Symbol != symbol]
            underwriters = session.query(Underwriters).filter(Underwriters.Symbol==symbol).all()
            underwriters = [row.Underwriter for row in underwriters]
            similaripos2 = session.query(Underwriters).filter(Underwriters.Underwriter.in_(underwriters)).all()
            similaripos2 = [row.Symbol for row in similaripos2]
            similaripos1 = list(set(similaripos).intersection(set(similaripos2)))
            if len(similaripos1) > 0:
                s['similaripos'] = similaripos1[0:min(5,len(similaripos1))]
            else:
                s['similaripos'] = similaripos[0:min(5,len(similaripos))]

    return jsonify(s)

@app.route('/api/upcoming/<symbol>', methods=['GET'])
def Upcoming(symbol):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    # status, timestamp, price, change, percent, volume = currentdata(symbol)
    ipobasic = session.query(UpcomingIPOs).filter(UpcomingIPOs.Symbol == symbol).one()
    s = {}
    s['company'] = ipobasic.Company
    s['OfferPriceLow'] = ipobasic.OfferPriceLow
    s['OfferPriceHigh'] = ipobasic.OfferPriceHigh
    
    s = {'basic': s}
    similaripos = session.query(IPOBASIC).filter(IPOBASIC.Section==ipobasic.Section).all()
    if len(similaripos) <= 5:
        s['similaripos'] = [row.Symbol for row in similaripos if row.Symbol != symbol]
    else:
        similaripos = [row.Symbol for row in similaripos if row.Symbol != symbol]
        symbols = session.query(IPOBASIC).filter(IPOBASIC.Symbol.in_(similaripos)).order_by(asc(func.abs(IPOBASIC.Shares-ipobasic.Shares))).all()
        similaripos = [row.Symbol for row in symbols if row.Symbol != symbol]
        underwriters = session.query(Underwriters).filter(Underwriters.Symbol==symbol).all()
        underwriters = [row.Underwriter for row in underwriters]
        similaripos2 = session.query(Underwriters).filter(Underwriters.Underwriter.in_(underwriters)).all()
        similaripos2 = [row.Symbol for row in similaripos2]
        similaripos1 = list(set(similaripos).intersection(set(similaripos2)))
        if len(similaripos1) > 0:
            s['similaripos'] = similaripos1[0:min(5,len(similaripos1))]
        else:
            s['similaripos'] = similaripos[0:min(5,len(similaripos))]

    return jsonify(s)


@app.route('/api/init', methods=['GET'])
def INIT():
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    allipos = session.query(IPOBASIC).all()
    symbols = []
    subpages = ["", "comments", "news", "historicalquotes", "profile"]
    for row in allipos:
        # symbols.append({'symbol': row.Symbol})
        for subpage in subpages:
            symbols.append({'symbol': row.Symbol, 'subpage': subpage})
    sectors = []
    sectorsperf = session.query(SectorsPerf).filter().all()
    sectors = [{'sector': ele.Sector, 'url': ele.Sector.replace('&','').replace(' ','').lower()} for ele in sectorsperf]
    underwriters = []
    underwritersperf = session.query(UnderwritersPerf).filter().all()
    underwriters = [{'underwriter': ele.Underwriter, 'url': ele.Underwriter.replace('-','').replace(' ','').replace('.', '').replace('&','').lower()} for ele in underwritersperf]
    s = {'symbols': symbols, 'sectors': sectors, 'underwriters': underwriters}
    return jsonify(s)

@app.route('/api/init_upcoming', methods=['GET'])
def INITUPCOMING():
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    upcomingipos = session.query(UpcomingIPOs).all()
    symbols = []
    subpages = ["", "comments", "news", "historicalquotes", "profile"]
    for row in upcomingipos:
        # symbols.append({'symbol': row.Symbol})
        for subpage in subpages:
            symbols.append({'symbol': row.Symbol, 'subpage': subpage})
    sectors = []
    sectorsperf = session.query(SectorsPerf).filter().all()
    sectors = [{'sector': ele.Sector, 'url': ele.Sector.replace('&','').replace(' ','').lower()} for ele in sectorsperf]
    underwriters = []
    underwritersperf = session.query(UnderwritersPerf).filter().all()
    underwriters = [{'underwriter': ele.Underwriter, 'url': ele.Underwriter.replace('-','').replace(' ','').replace('.', '').replace('&','').lower()} for ele in underwritersperf]
    s = {'symbols': symbols, 'sectors': sectors, 'underwriters': underwriters}
    return jsonify(s)

# @app.route('/api/signup/<email>/<username>/<password>', methods=['GET'])
# def SignUp(email, username, password):
#     engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
#     session = sessionmaker(bind = engine)()
#     emailexist = session.query(Userdata).filter(Userdata.Email == email).all()
#     usernameexist = session.query(Userdata).filter(Userdata.Username == username).all()
#     if len(emailexist) > 0 or len(usernameexist) > 0:
#         existornot = [{'EXIST': 1}]      
#     else:
#         salt = bcrypt.gensalt(10)
#         pwdhashed = bcrypt.hashpw(password.encode('utf-8'), salt)
#         usnhashed = bcrypt.hashpw(username.encode('utf-8'), salt)
#         print('==============================================')
#         print('signup', type(pwdhashed), pwdhashed)
#         usncode = usnhashed.decode('utf-8').replace('/','A').replace('$','B').replace('.','C').replace('&','D')
#         pwdhashed = pwdhashed.decode('utf-8')
#         session.add_all([Userdata(Email=email, Username=username, Password=pwdhashed, Usernamecode=usncode)])
#         session.commit() 
#         welcome(email, username) 
#         existornot = [{'EXIST': 0, 'Username': usncode}]
#     return jsonify(existornot)

@app.route('/api/signup', methods=['POST'])
def SignUp():
    if request.method == "POST":
        # print(request.json)
        email = request.json['email']
        username = request.json['username']
        password = request.json['password']
        engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
        session = sessionmaker(bind = engine)()
        emailexist = session.query(Userdata).filter(Userdata.Email == email).all()
        usernameexist = session.query(Userdata).filter(Userdata.Username == username).all()
        if len(emailexist) > 0 or len(usernameexist) > 0:
            existornot = [{'EXIST': 1}]      
        else:
            salt = bcrypt.gensalt(10)
            pwdhashed = bcrypt.hashpw(password.encode('utf-8'), salt)
            usnhashed = bcrypt.hashpw(username.encode('utf-8'), salt)
            # print('signup', type(pwdhashed), pwdhashed)
            usncode = usnhashed.decode('utf-8').replace('/','A').replace('$','B').replace('.','C').replace('&','D')
            pwdhashed = pwdhashed.decode('utf-8')
            session.add_all([Userdata(Email=email, Username=username, Password=pwdhashed, Usernamecode=usncode)])
            session.commit() 
            welcome(email, username) 
            existornot = [{'EXIST': 0, 'Username': usncode}]
    return jsonify(existornot)

# @app.route('/api/login/<email>/<password>', methods=['GET'])
# def Login(email, password):
#     engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
#     session = sessionmaker(bind = engine)()
#     user = session.query(Userdata).filter(Userdata.Email == email).all()
#     if len(user) == 0:
#         existornot = [{'EXIST': 0}]
#     elif bcrypt.checkpw(password.encode('utf8'), user[0].Password.encode('utf8')):
#         existornot = [{'EXIST': 1, 'Username': user[0].Usernamecode}]
#         # console.log(existornot)
#     else:
#         existornot = [{'EXIST': 0}]
#     return jsonify(existornot)

@app.route('/api/login', methods=['POST'])
def Login():
    print('!!!!!!!!!!!!!!!!!!!!!!!!!!')
    if request.method == 'POST':
        email = request.json['email']
        password = request.json['password']
        engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
        session = sessionmaker(bind = engine)()
        user = session.query(Userdata).filter(Userdata.Email == email).all()
        if len(user) == 0:
            existornot = [{'EXIST': 0}]
        elif bcrypt.checkpw(password.encode('utf8'), user[0].Password.encode('utf8')):
            existornot = [{'EXIST': 1, 'Username': user[0].Usernamecode}]
            # console.log(existornot)
        else:
            existornot = [{'EXIST': 0}]
        # existornot['fuck'] = "wtf"
    return jsonify(existornot)

@app.route('/api/checkusername/<username>', methods=['GET'])
def CheckUsername(username):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    user = session.query(Userdata).filter(Userdata.Usernamecode == username).all()
    if len(user) == 0:
        existornot = [{'EXIST': 0}]
    else:
        existornot = [{'EXIST': 1, 'Username': user[0].Username}]
    return jsonify(existornot)

@app.route('/api/forgotpsw/<email>', methods=['GET'])
def FORGOTPSW(email):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    user = session.query(Userdata).filter(Userdata.Email == email).all()
    if len(user) == 0:
        existornot = [{'EXIST': 0}]
    else:
        existornot = [{'EXIST': 1, 'Username': user[0].Username}]
        forgotemail(email, user[0].Username, user[0].Usernamecode)
    return jsonify(existornot)

@app.route('/api/resetpsw/<username>/<password>', methods=['GET'])
def RESETPSW(username, password):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    user = session.query(Userdata).filter(Userdata.Usernamecode == username).all()
    if len(user) == 0:
        existornot = [{'EXIST': 0}]
    else:
        existornot = [{'EXIST': 1, 'Username': user[0].Username}]
        salt = bcrypt.gensalt(10)
        pwdhashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        pwdhashed = pwdhashed.decode('utf-8')
        session.query(Userdata).filter(Userdata.Usernamecode == username).update({Userdata.Password: pwdhashed})
        session.commit()
    return jsonify(existornot)

@app.route('/api/overview/<symbol>', methods=['GET'])
def Overview(symbol):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    ipobasic = session.query(IPOBASIC).filter(IPOBASIC.Symbol == symbol).one()
    generalinfo = session.query(GeneralInfo).filter(GeneralInfo.Symbol == symbol).one()
    underwriters = session.query(Underwriters).with_entities(Underwriters.Underwriter).filter(Underwriters.Symbol==symbol).distinct().all()
    underwriters = [underwriter.Underwriter for underwriter in underwriters]
    sector = session.query(IPOBASIC).with_entities(IPOBASIC.Section).filter(IPOBASIC.Symbol==symbol).distinct().one().Section
    sectorsperf = session.query(SectorsPerf).filter(SectorsPerf.Sector == sector).one()
    quote = session.query(Quotes).filter(Quotes.Symbol == symbol, Quotes.Date == ipobasic.OfferDate).one()
    s = {'company': ipobasic.Company, 'symbol': ipobasic.Symbol, 'offerprice': ipobasic.OfferPrice, 'offerdate': ipobasic.OfferDate, 'shares': ipobasic.Shares,
        'generalinfo': {'industry': generalinfo.Industry, 'employees': generalinfo.Employees, 'founded': generalinfo.Founded, 'business': generalinfo.Business}}
    s['sector'] = {'sector': ipobasic.Section, 'Return_3': sectorsperf.Return_3, 'Return_h_3': sectorsperf.Return_h_3,
        'Return_6': sectorsperf.Return_6, 'Return_h_6': sectorsperf.Return_h_6, 'Return_12': sectorsperf.Return_12, 'Return_h_12': sectorsperf.Return_h_12, 'url': sectorsperf.Url}
    s['underwriters'] = []
    for underwriter in underwriters:
        underwriterperf = session.query(UnderwritersPerf).filter(UnderwritersPerf.Underwriter == underwriter).one()
        s['underwriters'].append({'underwriter': underwriter, 'Return_3': underwriterperf.Return_3, 'Return_h_3': underwriterperf.Return_h_3,
            'Return_6': underwriterperf.Return_6, 'Return_h_6': underwriterperf.Return_h_6, 'Return_12': underwriterperf.Return_12, 'Return_h_12': underwriterperf.Return_h_12, 'url': underwriterperf.Url})
    s['startprice'] = quote.Open
    return jsonify(s)

@app.route('/api/upcoming-overview/<symbol>', methods=['GET'])
def UpcomingOverview(symbol):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    ipobasic = session.query(UpcomingIPOs).filter(UpcomingIPOs.Symbol == symbol).one()
    generalinfo = session.query(GeneralInfo).filter(GeneralInfo.Symbol == symbol).one()
    underwriters = session.query(Underwriters).with_entities(Underwriters.Underwriter).filter(Underwriters.Symbol==symbol).distinct().all()
    underwriters = [underwriter.Underwriter for underwriter in underwriters]
    sector = session.query(UpcomingIPOs).with_entities(UpcomingIPOs.Section).filter(UpcomingIPOs.Symbol==symbol).distinct().one().Section
    sectorsperf = session.query(SectorsPerf).filter(SectorsPerf.Sector == sector).one()
    # quote = session.query(Quotes).filter(Quotes.Symbol == symbol, Quotes.Date == ipobasic.OfferDate).one()
    s = {'company': ipobasic.Company, 'symbol': ipobasic.Symbol, 'offerdate': ipobasic.OfferDate, 'shares': ipobasic.Shares,
        'generalinfo': {'industry': generalinfo.Industry, 'employees': generalinfo.Employees, 'founded': generalinfo.Founded, 'business': generalinfo.Business}}
    if abs(ipobasic.OfferPriceLow - ipobasic.OfferPriceHigh) < 0.0001:
        s['offerprice'] = round(ipobasic.OfferPriceLow,2)
    else:
        s['offerprice'] = str(round(ipobasic.OfferPriceLow,2)) + ' - ' + str(round(ipobasic.OfferPriceHigh,2))
    s['sector'] = {'sector': ipobasic.Section, 'Return_3': sectorsperf.Return_3, 'Return_h_3': sectorsperf.Return_h_3,
        'Return_6': sectorsperf.Return_6, 'Return_h_6': sectorsperf.Return_h_6, 'Return_12': sectorsperf.Return_12, 'Return_h_12': sectorsperf.Return_h_12, 'url': sectorsperf.Url}
    s['underwriters'] = []
    for underwriter in underwriters:
        underwriterperf = session.query(UnderwritersPerf).filter(UnderwritersPerf.Underwriter == underwriter).all()
        if len(underwriterperf) > 0:
            underwriterperf = underwriterperf[0]
            s['underwriters'].append({'underwriter': underwriter, 'Return_3': underwriterperf.Return_3, 'Return_h_3': underwriterperf.Return_h_3,
              'Return_6': underwriterperf.Return_6, 'Return_h_6': underwriterperf.Return_h_6, 'Return_12': underwriterperf.Return_12, 'Return_h_12': underwriterperf.Return_h_12, 'url': underwriterperf.Url})
        else:
            s['underwriters'].append({'underwriter': underwriter, 'Return_3': 0, 'Return_h_3': 0,
              'Return_6': 0, 'Return_h_6': 0, 'Return_12': 0, 'Return_h_12': 0, 'url': underwriter.replace('-','').replace(' ','').replace('.', '').replace('&','').lower()})
    # s['startprice'] = quote.Open
    return jsonify(s)

@app.route('/api/news/<symbol>', methods=['GET'])
def News(symbol):
    news = newsdata(symbol)
    s = {'news': news}
    return jsonify(s)

@app.route('/api/profile/<symbol>', methods=['GET'])
def Profiles(symbol):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    ipobasic = session.query(IPOBASIC).filter(IPOBASIC.Symbol == symbol).one()
    generalinfo = session.query(GeneralInfo).filter(GeneralInfo.Symbol == symbol).one()
    contactinfo = session.query(ContactInfo).filter(ContactInfo.Symbol == symbol).one()
    financialinfo = session.query(FinancialInfo).filter(FinancialInfo.Symbol == symbol).one()
    s = {'generalinfo': {'company': ipobasic.Company, 'industry': generalinfo.Industry, 'employees': generalinfo.Employees, 'founded': generalinfo.Founded, 'business': generalinfo.Business},
        'contactinfo': {'address': contactinfo.Address, 'phonenumber': contactinfo.PhoneNumber, 'website': contactinfo.Website},
        'financialinfo': {'prospectus': financialinfo.Prospectus, 'marketcap': financialinfo.MarketCap, 'revenues': financialinfo.Revenues,
        'netincome': financialinfo.NetIncome}}
    return jsonify(s)

@app.route('/api/upcoming-profile/<symbol>', methods=['GET'])
def UpcomingProfiles(symbol):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    ipobasic = session.query(UpcomingIPOs).filter(UpcomingIPOs.Symbol == symbol).one()
    generalinfo = session.query(GeneralInfo).filter(GeneralInfo.Symbol == symbol).one()
    contactinfo = session.query(ContactInfo).filter(ContactInfo.Symbol == symbol).one()
    financialinfo = session.query(FinancialInfo).filter(FinancialInfo.Symbol == symbol).one()
    s = {'generalinfo': {'company': ipobasic.Company, 'industry': generalinfo.Industry, 'employees': generalinfo.Employees, 'founded': generalinfo.Founded, 'business': generalinfo.Business},
        'contactinfo': {'address': contactinfo.Address, 'phonenumber': contactinfo.PhoneNumber, 'website': contactinfo.Website},
        'financialinfo': {'prospectus': financialinfo.Prospectus, 'marketcap': financialinfo.MarketCap, 'revenues': financialinfo.Revenues,
        'netincome': financialinfo.NetIncome}}
    return jsonify(s)

@app.route('/api/quotes/<symbol>', methods=['GET'])
def HistoricalQuotes(symbol):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    quotes = session.query(Quotes).filter(Quotes.Symbol == symbol).order_by(asc(Quotes.Date))
    s = {'quotes':[]}
    for row in quotes:
        s['quotes'].append({'date': row.Date, 'open': row.Open, 'high': row.High, 'low': row.Low, 'close': row.Close, 'volume': row.Volume})
    return jsonify(s)

@app.route('/api/sectors/<url>', methods=['GET'])
def SectorData(url):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    sectorsdata = session.query(SectorsPerf).filter(SectorsPerf.Url == url).one()
    name = sectorsdata.Sector
    ipos = session.query(IPOBASIC).filter(IPOBASIC.Section == name).order_by(desc(IPOBASIC.OfferDate)).all()
    s = {}
    # sectorsdata.Sector.replace('&','').replace(' ','').lower()
    s['basic'] = {'name':name, 'return_3': sectorsdata.Return_3, 'return_6': sectorsdata.Return_6, 'return_12': sectorsdata.Return_12, 'return_h_3': sectorsdata.Return_h_3,
         'return_h_6': sectorsdata.Return_h_6, 'return_h_12': sectorsdata.Return_h_12, 'num_3': sectorsdata.Num_3, 'num_6': sectorsdata.Num_6, 'num_12': sectorsdata.Num_12, 'url': url}
    s['ipos'] = []
    for row in ipos:
        s['ipos'].append({'company': row.Company, 'symbol': row.Symbol, 'offerprice': row.OfferPrice, 'offerdate': row.OfferDate, 'high_1day': row.High_1day, 'offerreturn': row.Return,
                        'earn_1day': row.Earn_1day, 'high_2day': row.High_2day, 'earn_2day': row.Earn_2day, 'high_7day': row.High_7day, 'earn_7day': row.Earn_7day})
        s['ipos'][-1]['high_1week'] = max(row.High_1day, row.High_2day, row.High_7day)
        s['ipos'][-1]['earn_1week'] = max(row.Earn_1day, row.Earn_2day, row.Earn_7day)
        price = session.query(Quotes).filter(Quotes.Symbol == row.Symbol, Quotes.Date == row.OfferDate).all()
        if len(price) > 0:
            s['ipos'][-1]['startprice'] = price[0].Open
    return jsonify(s)

@app.route('/api/underwriters/<url>', methods=['GET'])
def UnderwriterData(url):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    underwriterdata = session.query(UnderwritersPerf).filter(UnderwritersPerf.Url == url).one()
    name = underwriterdata.Underwriter
    nowsdate = datetime.now().strftime('%Y-%m-%d')
    symbols = session.query(Underwriters).filter(Underwriters.Underwriter == name, Underwriters.OfferDate < nowsdate).all()
    symbols = [ele.Symbol for ele in symbols]
    s = {}
    s['basic'] = {'name': name, 'return_3': underwriterdata.Return_3, 'return_6': underwriterdata.Return_6, 'return_12': underwriterdata.Return_12, 'return_h_3': underwriterdata.Return_h_3,
         'return_h_6': underwriterdata.Return_h_6, 'return_h_12': underwriterdata.Return_h_12, 'num_3': underwriterdata.Num_3, 'num_6': underwriterdata.Num_6, 'num_12': underwriterdata.Num_12, 'url': underwriterdata.Url}
    s['ipos'] = []
    for symbol in symbols:
        row = session.query(IPOBASIC).filter(IPOBASIC.Symbol == symbol).all()
        if len(row) > 0:
            row = row[0]
            s['ipos'].append({'company': row.Company, 'symbol': row.Symbol, 'offerprice': row.OfferPrice, 'offerdate': row.OfferDate, 'high_1day': row.High_1day, 'offerreturn': row.Return,
                            'earn_1day': row.Earn_1day, 'high_2day': row.High_2day, 'earn_2day': row.Earn_2day, 'high_7day': row.High_7day, 'earn_7day': row.Earn_7day})
            s['ipos'][-1]['high_1week'] = max(row.High_1day, row.High_2day, row.High_7day)
            s['ipos'][-1]['earn_1week'] = max(row.Earn_1day, row.Earn_2day, row.Earn_7day)
            price = session.query(Quotes).filter(Quotes.Symbol == row.Symbol, Quotes.Date == row.OfferDate).all()
            if len(price) > 0:
                s['ipos'][-1]['startprice'] = price[0].Open
    return jsonify(s)

@app.route('/api/allsectors', methods=['GET'])
def AllSectors():
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    sectors = session.query(SectorsPerf).filter().order_by(desc(SectorsPerf.Num_12), desc(SectorsPerf.Num_6), desc(SectorsPerf.Num_3)).all()
    s = []
    for row in sectors:
        s.append({'return_3': row.Return_3, 'return_6': row.Return_6, 'return_12': row.Return_12, 'return_h_3': row.Return_h_3,
         'return_h_6': row.Return_h_6, 'return_h_12': row.Return_h_12, 'num_3': row.Num_3, 'num_6': row.Num_6, 'num_12': row.Num_12,
         'name': row.Sector, 'url': row.Sector.replace('&','').replace(' ','').lower()})
    return jsonify(s)

@app.route('/api/allunderwriters', methods=['GET'])
def AllUnderwriters():
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    underwriters = session.query(UnderwritersPerf).filter().order_by(desc(UnderwritersPerf.Num_12), desc(UnderwritersPerf.Num_6), desc(UnderwritersPerf.Num_3)).all()
    s = []
    for row in underwriters:
        s.append({'return_3': row.Return_3, 'return_6': row.Return_6, 'return_12': row.Return_12, 'return_h_3': row.Return_h_3,
         'return_h_6': row.Return_h_6, 'return_h_12': row.Return_h_12, 'num_3': row.Num_3, 'num_6': row.Num_6, 'num_12': row.Num_12,
         'name': row.Underwriter, 'url': row.Underwriter.replace('-','').replace(' ','').replace('.', '').replace('&','').lower()})
    return jsonify(s)

@app.route('/api/search/<input>', methods=['GET'])
def SearchData(input):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    input = input.lower()
    ipos = session.query(IPOBASIC).filter(or_(IPOBASIC.Symbol.ilike('%'+input+'%'), IPOBASIC.Company.ilike('%'+input+'%'))).all()
    underwriters = session.query(UnderwritersPerf).filter(UnderwritersPerf.Underwriter.ilike('%'+input+'%')).all()
    sectors = session.query(SectorsPerf).filter(SectorsPerf.Sector.ilike('%'+input+'%')).all()
    results = {'input': input, 'results': []}
    for item in ipos:
        results['results'].append({'text': item.Symbol+' : '+item.Company, 'url': '/ipos/'+item.Symbol+'/overview', 'section': 'Stock'})
    for item in underwriters:
        results['results'].append({'text': item.Underwriter, 'url': '/underwriters/'+item.Url, 'section': 'Underwriter'})
    for item in sectors:
        results['results'].append({'text': item.Sector, 'url': '/sectors/'+item.Url, 'section': 'Sector'})
    if len(results['results']) == 0:
        results['results'].append({'text': 'Woo! No results match your input! Please try gain!', 'url': '/search', 'section': 'Searching Error'})
    return jsonify(results)

@app.route('/api/upcomingipos', methods=['GET'])
def UpcomingIPOsData():
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    upcomingipos = session.query(UpcomingIPOs).filter().all()
    results = []
    for ipo in upcomingipos:
        results.append({'company': ipo.Company, 'symbol': ipo.Symbol, 'pricelow': ipo.OfferPriceLow, 'pricehigh': ipo.OfferPriceHigh, 'shares': ipo.Shares, 'offerdate': ipo.OfferDate})
        underwriters = session.query(Underwriters).filter(Underwriters.Symbol==ipo.Symbol).all()
        underwriters = [row.Underwriter for row in underwriters]
        unders = underwriters[0]
        for i in range(1,len(underwriters)):
            unders = unders + ' /' + underwriters[i]
        results[-1]['underwriters'] = unders
    return jsonify(results)

