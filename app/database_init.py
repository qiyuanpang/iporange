# import requests
import requests
import lxml
import cchardet
from datetime import datetime
from datetime import timedelta
from bs4 import BeautifulSoup, SoupStrainer
import pandas as pd
import os
#from app import utils, tables, analysis
from app.utils import *
from app.tables import *
from app.analysis import *
import re
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.setting import SQLAlCHEMY_DATABASE_URI

def basicinfo(url):
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'lxml')
    content = soup.find("div", {"id": "wrapper"})
    content = content.find("div", {"id": "main-content"})
    content = content.contents[11]
    content = content.find_all("div", {"class": "row container"})
    content = content[0].find_all("div", {"class": "large-12 columns"})
    table = content[0].find_all("table", {"class": "ipo-table"})
    trs = table[0].find_all("tr")
    data = {}
    # print(trs[1].contents[3].text)
    data[trs[0].td.text] = {"Industry": re.sub("([\(\[]).*?([\)\]])", "", trs[2].contents[3].text),
    "Employees": trs[3].contents[3].text.replace(',', '') if len(trs[3].contents[3].text)>0 else '0',
    "Founded": trs[4].contents[3].text if len(trs[4].contents[3].text) > 0 else '-1',
    "Business": trs[1].contents[3].text
    }
    data[trs[5].td.text] = {
        "Address": trs[6].contents[3].text,
        "Phone Number": trs[7].contents[3].text,
        "Website": trs[8].contents[3].a['href']
    }
    data[trs[10].td.text] = {
        "Prospectus": trs[9].contents[3].a['href'],
        "Market Cap": trs[11].contents[3].text,
        "Revenues": trs[12].contents[3].text.replace(" (last 12 months)", ''),
        "Net Income": trs[13].contents[3].text.replace(" (last 12 months)", '')
    }
    Underwriters1 = [re.sub("([\(\[]).*?([\)\]])", "", ele).replace('formerly Kingswood','').replace('a division of Benchmark Investments', '').replace('division of Benchmark Investments', '').replace('(', '').replace(')','').replace('\u200b', '').replace('Inc.', '').strip() for ele in trs[20].contents[3].text.replace('/', ',').split(',')]
    CoManagers1 = [re.sub("([\(\[]).*?([\)\]])", "", ele).replace('formerly Kingswood','').replace('a division of Benchmark Investments', '').replace('division of Benchmark Investments', '').replace('(', '').replace(')','').replace('\u200b', '').replace('Inc.', '').strip() for ele in trs[21].contents[3].text.replace('/', ',').split(',')]
    data['Underwriters'] = [re.sub("\s\s+", " ", ele).upper() for ele in Underwriters1 if ele != '' and ele != '.']
    data['Co-Managers'] = [re.sub("\s\s+", " ", ele).upper() for ele in CoManagers1 if ele != '' and ele != '.']
    for i in range(len(data['Underwriters'])):
        if data['Underwriters'][i] == 'ITAÚ BBA':
            data['Underwriters'][i] = 'ITAU BBA'
        if data['Underwriters'][i] == 'J.P.MORGAN' or data['Underwriters'][i] == 'JPMORGAN' or data['Underwriters'][i] == 'J.P. MORGAN SECURITIES':
            data['Underwriters'][i] = 'J.P. MORGAN'
    for i in range(len(data['Co-Managers'])):
        if data['Co-Managers'][i] == 'ITAÚ BBA':
            data['Co-Managers'][i] = 'ITAU BBA'
        if data['Co-Managers'][i] == 'J.P.MORGAN' or data['Co-Managers'][i] == 'JPMORGAN' or data['Co-Managers'][i] == 'J.P. MORGAN SECURITIES':
            data['Co-Managers'][i] = 'J.P. MORGAN'
    # print('===============================================')
    # print( trs[20].contents[3].text.replace('/', ',').split(','))
    # print('-----------------------------------------------')
    # print(data['Underwriters'])
    return data

def tocategories(categories, key, data, symbol):
    underwriters_here = data
    for underwriter in underwriters_here:
        if categories[key].get(underwriter):
            categories[key][underwriter].append(symbol)
        else:
            categories[key][underwriter] = [symbol]

def todatabase(ipodatabase, categories):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    Base.metadata.create_all(engine)
    ipobasic = []
    generalinfo = []
    contactinfo = []
    financialinfo = []
    underwriters = []
    comanagers = []
    sectors = []
    quotes = []
    nowsdate = datetime.now().strftime('%Y-%m-%d')
    for symbol in ipodatabase:
        ipo = ipodatabase[symbol]
        if datetime.strptime(ipo['Offer Date'], "%m/%d/%Y").strftime("%Y-%m-%d") < nowsdate:
            ipobasic.append(IPOBASIC(Company=ipo['Company'], Section=ipo['Section'], Symbol=symbol, 
                            Shares=ipo['Shares'], OfferPrice=ipo['Offer Price'], OfferDate=datetime.strptime(ipo['Offer Date'], "%m/%d/%Y").strftime("%Y-%m-%d")))
            generalinfo.append(GeneralInfo(Symbol=symbol, Industry=ipo['General Information']['Industry'], 
                            Employees=ipo['General Information']['Employees'], Founded=ipo['General Information']['Founded'], Business=ipo['General Information']['Business']))
            contactinfo.append(ContactInfo(Symbol=symbol, Address=ipo['Contact Information']['Address'], 
                            PhoneNumber=ipo['Contact Information']['Phone Number'], Website=ipo['Contact Information']['Website']))
            financialinfo.append(FinancialInfo(Symbol=symbol, Prospectus=ipo['Financial Information']['Prospectus'], 
                            MarketCap=ipo['Financial Information']['Market Cap'], Revenues=ipo['Financial Information']['Revenues'], 
                            NetIncome=ipo['Financial Information']['Net Income']))
            sectors.append(Sectors(Symbol=symbol, Sector=ipo['Section'], Industry=ipo['General Information']['Industry'], OfferDate=datetime.strptime(ipo['Offer Date'], "%m/%d/%Y").strftime("%Y-%m-%d")))
            for underwriter in ipo['Underwriters']:
                underwriters.append(Underwriters(Symbol=symbol, Underwriter=underwriter, OfferDate=datetime.strptime(ipo['Offer Date'], "%m/%d/%Y").strftime("%Y-%m-%d")))
            for comanager in ipo['Co-Managers']:
                if comanager != '-':
                    comanagers.append(CoManagers(Symbol=symbol, CoManager=comanager, OfferDate=datetime.strptime(ipo['Offer Date'], "%m/%d/%Y").strftime("%Y-%m-%d")))
            
            for date in ipo['Quotes']:
                quote = ipo['Quotes'][date]
                quotes.append(Quotes(Symbol=symbol, Date=datetime.strptime(date, "%m/%d/%Y").strftime("%Y-%m-%d"), Open=quote['Open'], High=quote['High'],
                            Low=quote['Low'], Close=quote['Close'], Volume=quote['Volume']))
    
    
    session = sessionmaker(bind=engine)()
    session.add_all(ipobasic)
    session.add_all(generalinfo)
    session.add_all(contactinfo)
    session.add_all(financialinfo)
    session.add_all(underwriters)
    session.add_all(comanagers)
    session.add_all(quotes)
    session.add_all(sectors)
    session.commit()
    
def todatabase2(ipodatabase, categories):
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    Base.metadata.create_all(engine)
    ipobasic = []
    generalinfo = []
    contactinfo = []
    financialinfo = []
    underwriters = []
    comanagers = []
    nowsdate = datetime.now().strftime('%Y-%m-%d')
    session = sessionmaker(bind=engine)()
    pastipos = session.query(IPOBASIC).filter().order_by(IPOBASIC.OfferDate.desc()).limit(40).all()
    pastsymbols = [row.Symbol for row in pastipos]
    for symbol in ipodatabase:
        ipo = ipodatabase[symbol]
        # print(symbol, datetime.strptime(ipo['Offer Date'], "%m/%d/%Y").strftime("%Y-%m-%d"), nowsdate)
        if datetime.strptime(ipo['Offer Date'], "%m/%d/%Y").strftime("%Y-%m-%d") > nowsdate and symbol not in pastsymbols:
            ipobasic.append(UpcomingIPOs(Company=ipo['Company'], Section=ipo['Section'], Symbol=symbol, 
                            Shares=ipo['Shares'], OfferPriceLow=ipo['Offer Price Low'], OfferPriceHigh=ipo['Offer Price High'], OfferDate=datetime.strptime(ipo['Offer Date'], "%m/%d/%Y").strftime("%Y-%m-%d")))
            generalinfo.append(GeneralInfo(Symbol=symbol, Industry=ipo['General Information']['Industry'], 
                            Employees=ipo['General Information']['Employees'], Founded=ipo['General Information']['Founded'], Business=ipo['General Information']['Business']))
            contactinfo.append(ContactInfo(Symbol=symbol, Address=ipo['Contact Information']['Address'], 
                            PhoneNumber=ipo['Contact Information']['Phone Number'], Website=ipo['Contact Information']['Website']))
            financialinfo.append(FinancialInfo(Symbol=symbol, Prospectus=ipo['Financial Information']['Prospectus'], 
                            MarketCap=ipo['Financial Information']['Market Cap'], Revenues=ipo['Financial Information']['Revenues'], 
                            NetIncome=ipo['Financial Information']['Net Income']))
            for underwriter in ipo['Underwriters']:
                underwriters.append(Underwriters(Symbol=symbol, Underwriter=underwriter, OfferDate=datetime.strptime(ipo['Offer Date'], "%m/%d/%Y").strftime("%Y-%m-%d")))
            for comanager in ipo['Co-Managers']:
                if comanager != '-':
                    comanagers.append(CoManagers(Symbol=symbol, CoManager=comanager, OfferDate=datetime.strptime(ipo['Offer Date'], "%m/%d/%Y").strftime("%Y-%m-%d")))
        
    
    session.add_all(ipobasic)
    session.add_all(generalinfo)
    session.add_all(contactinfo)
    session.add_all(financialinfo)
    session.add_all(underwriters)
    session.add_all(comanagers)
    session.commit()
    

def initialize():
    page = requests.get("https://www.iposcoop.com/last-12-months/")

    soup = BeautifulSoup(page.text, 'lxml')

    all = soup.find_all("div", {"class": "twelve columns"})


    table = all[0].div.contents[3]

    ipodatabase = {}
    categories = {'underwriters': {}, 'comanagers': {}, 'sections': {}, 'dates': {}}


    ## add basic information
    for item in table.tbody:
        if len(item) > 1:
            tds = item.find_all('td')
            if tds[1].text.find('.') == -1:
                url = tds[0].a['href']
                print(tds[1].text, url)
                data = basicinfo(url)                
                ipodatabase[tds[1].text] = {
                    'Company': re.sub("([\(\[]).*?([\)\]])", "",tds[0].text),
                    'Section': tds[2].text,
                    'Shares': round(float(tds[4].text), 2),
                    'Offer Price': round(float(tds[5].text.replace('$', '')), 2),
                    'Offer Date': tds[3].text.replace('\r', '').replace('\n', '').replace('\t', '')
                }
                for key in data: ipodatabase[tds[1].text][key] = data[key]
                tocategories(categories, 'underwriters', data['Underwriters'], tds[1].text)
                tocategories(categories, 'comanagers', data['Co-Managers'], tds[1].text)
                tocategories(categories, 'sections', [tds[2].text], tds[1].text)
                tocategories(categories, 'dates', [ipodatabase[tds[1].text]['Offer Date']], tds[1].text)

    
    ## add historical quotes
    url_download_part1 = "https://www.marketwatch.com/investing/stock/"
    url_download_part2 = "/downloaddatapartial?startdate="
    url_download_part3 = "%2000:00:00&enddate="
    url_download_part4 = "%2000:00:00&daterange=d30&frequency=p1d&csvdownload=true&downloadpartial=false&newdates=false"

    for symbol in ipodatabase.keys():
        startdate = ipodatabase[symbol]['Offer Date']
        startdate = datetime.strptime(startdate, "%m/%d/%Y")
        enddate = datetime.now()
        enddate = enddate.strftime("%m/%d/%Y")
        startdate = startdate.strftime("%m/%d/%Y")
        url_download = url_download_part1 + symbol.lower() + url_download_part2 + startdate + url_download_part3 + enddate + url_download_part4
        csv = requests.get(url_download, allow_redirects=True)
        # if csv.status_code == 200:
        open('./data/'+symbol+'.csv', 'wb').write(csv.content)
        if os.stat('./data/'+symbol+'.csv').st_size > 0:
            quotes = pd.read_csv('./data/'+symbol+'.csv')
            quotes = df_to_dict(quotes.to_dict())
            ipodatabase[symbol]['Quotes'] = quotes
        else:
            ipodatabase[symbol]['Quotes'] = {}
    
    # print(ipodatabase['IFBD'])
    todatabase(ipodatabase, categories)
    # return ipodatabase, categories

def upcomingipos():
    page = requests.get("https://www.iposcoop.com/ipo-calendar/")

    soup = BeautifulSoup(page.text, 'lxml')

    all = soup.find_all("div", {"class": "twelve columns"})

    table = all[0].div.contents[1]
    ipodatabase = {}
    categories = {'underwriters': {}, 'comanagers': {}, 'sections': {}, 'dates': {}}

    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind=engine)()
    ## add basic information
    for item in table.tbody:
        if len(item) > 1:
            tds = item.find_all('td')
            if tds[1].text.find('.') == -1:
                url = tds[0].a['href']
                print(tds[1].text, url)
                data = basicinfo(url)                
                ipodatabase[tds[1].text] = {
                    'Company': re.sub("([\(\[]).*?([\)\]])", "", tds[0].text),
                    'Section': 'unknown',
                    'Shares': round(float(tds[3].text), 2),
                    'Offer Price Low': round(float(tds[4].text.replace('$', '')), 2),
                    'Offer Price High': round(float(tds[5].text.replace('$', '')), 2),
                    'Offer Date': tds[7].text.replace('\r', '').replace('\n', '').replace('\t', '').split(' ')[0]
                }
                for key in data: ipodatabase[tds[1].text][key] = data[key]
                sector = session.query(Sectors).with_entities(Sectors.Sector).filter(Sectors.Industry==ipodatabase[tds[1].text]['General Information']['Industry']).distinct().all()
                if len(sector) > 0:
                    ipodatabase[tds[1].text]['Section'] = sector[0].Sector
                else:
                    ipodatabase[tds[1].text]['Section'] = 'unknown'
                tocategories(categories, 'underwriters', data['Underwriters'], tds[1].text)
                tocategories(categories, 'comanagers', data['Co-Managers'], tds[1].text)
                tocategories(categories, 'sections', [tds[2].text], tds[1].text)
                tocategories(categories, 'dates', [ipodatabase[tds[1].text]['Offer Date']], tds[1].text)

    
    
    # print(ipodatabase['BLND'])
    todatabase2(ipodatabase, categories)
    # return ipodatabase, categories

def additionalupdate():
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind=engine)()
    session.query(UpcomingIPOs).filter(UpcomingIPOs.Symbol == 'BLND').update({UpcomingIPOs.Section: 'Technology'})
    session.query(UpcomingIPOs).filter(UpcomingIPOs.Symbol == 'GAMB').update({UpcomingIPOs.Section: 'Consumer Services'})
    session.query(UpcomingIPOs).filter(UpcomingIPOs.Symbol == 'ABSI').update({UpcomingIPOs.Section: 'Consumer Services'})
    session.query(UpcomingIPOs).filter(UpcomingIPOs.Symbol == 'RYAN').update({UpcomingIPOs.Section: 'Financials'})
    session.query(UpcomingIPOs).filter(UpcomingIPOs.Symbol == 'ZVIA').update({UpcomingIPOs.Section: 'Consumer Goods'})
    session.query(UpcomingIPOs).filter(UpcomingIPOs.Symbol == 'STVN').update({UpcomingIPOs.Section: 'Consumer Goods'})
    session.commit()
    





if __name__ == '__main__':
    initialize()
    basicanalysis()
    byunderwriters()
    bysectors()
    upcomingipos()
    additionalupdate()
