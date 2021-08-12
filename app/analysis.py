from datetime import datetime
from datetime import timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
#from app import utils, tables, setting
from app.utils import *
from app.tables import *
from app.setting import SQLAlCHEMY_DATABASE_URI

def basicanalysis():
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    conn = engine.connect()
    # results = session.query(IPOBASIC).filter(IPOBASIC.OfferDate == '04/29/2021')
    nowsdate = datetime.now().strftime('%Y-%m-%d')

    ## first day performance
    ipos = session.query(IPOBASIC).filter().all()
    for ipo in ipos:
        quotes = session.query(Quotes).filter(Quotes.Date >= ipo.OfferDate, Quotes.Symbol == ipo.Symbol).order_by(Quotes.Date.asc()).limit(20).all()
        # print(quotes)
        if len(quotes) > 0:        
            opens = quotes[0].Open
            Return = round((opens - ipo.OfferPrice)/ipo.OfferPrice, 4)

        highest = 0
        lowest = 1000000000000
        i = 0
        for i in range(0,min(1,len(quotes))):
            highest = max(highest, quotes[i].High)
            lowest = min(lowest, quotes[i].Low)
        if i < len(quotes):
            Earn_1day = round((highest - opens)/opens, 4)
            Loss_1day = round((lowest - opens)/opens, 4)
            High_1day = round(highest, 2)
            Low_1day = round(lowest, 2)
            session.query(IPOBASIC).filter(IPOBASIC.Symbol == ipo.Symbol).update({IPOBASIC.Return: Return, IPOBASIC.Earn_1day: Earn_1day, IPOBASIC.Loss_1day: Loss_1day, IPOBASIC.High_1day: High_1day, IPOBASIC.Low_1day: Low_1day})

        highest = 0
        lowest = 1000000000000
        i = 1
        for i in range(1, min(2,len(quotes))):
            highest = max(highest, quotes[i].High)
            lowest = min(lowest, quotes[i].Low)
        if i < len(quotes):
            Earn_2day = round((highest - opens)/opens, 4)
            Loss_2day = round((lowest - opens)/opens, 4)
            High_2day = round(highest, 2)
            Low_2day = round(lowest, 2)
            session.query(IPOBASIC).filter(IPOBASIC.Symbol == ipo.Symbol).update({IPOBASIC.Earn_2day: Earn_2day, IPOBASIC.Loss_2day: Loss_2day, IPOBASIC.High_2day: High_2day, IPOBASIC.Low_2day: Low_2day})

        highest = 0
        lowest = 1000000000000
        i = 2
        for i in range(2, min(5,len(quotes))):
            highest = max(highest, quotes[i].High)
            lowest = min(lowest, quotes[i].Low)
        if i < len(quotes):
            Earn_7day = round((highest - opens)/opens, 4)
            Loss_7day = round((lowest - opens)/opens, 4)
            High_7day = round(highest, 2)
            Low_7day = round(lowest, 2)
            session.query(IPOBASIC).filter(IPOBASIC.Symbol == ipo.Symbol).update({IPOBASIC.Earn_7day: Earn_7day, IPOBASIC.Loss_7day: Loss_7day, IPOBASIC.High_7day: High_7day, IPOBASIC.Low_7day: Low_7day})

        highest = 0
        lowest = 1000000000000
        i = 5
        for i in range(5, min(10,len(quotes))):
            highest = max(highest, quotes[i].High)
            lowest = min(lowest, quotes[i].Low)
        if i < len(quotes):
            Earn_14day = round((highest - opens)/opens, 4)
            Loss_14day = round((lowest - opens)/opens, 4)
            High_14day = round(highest, 2)
            Low_14day = round(lowest, 2)
            session.query(IPOBASIC).filter(IPOBASIC.Symbol == ipo.Symbol).update({IPOBASIC.Earn_14day: Earn_14day, IPOBASIC.Loss_14day: Loss_14day, IPOBASIC.High_14day: High_14day, IPOBASIC.Low_14day: Low_14day})

        highest = 0
        lowest = 1000000000000
        i = 10
        for i in range(10, min(20,len(quotes))):
            highest = max(highest, quotes[i].High)
            lowest = min(lowest, quotes[i].Low)
        if i < len(quotes):
            Earn_30day = round((highest - opens)/opens, 4)
            Loss_30day = round((lowest - opens)/opens, 4)
            High_30day = round(highest, 2)
            Low_30day = round(lowest, 2)
            session.query(IPOBASIC).filter(IPOBASIC.Symbol == ipo.Symbol).update({IPOBASIC.Earn_30day: Earn_30day, IPOBASIC.Loss_30day: Loss_30day, IPOBASIC.High_30day: High_30day, IPOBASIC.Low_30day: Low_30day})
        session.commit()

    

def byunderwriters():
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    nowsdate = datetime.now()
    underwriters = session.query(Underwriters).with_entities(Underwriters.Underwriter).filter().distinct().all()
    for underwriter in underwriters:
        session.add(UnderwritersPerf(Underwriter=underwriter.Underwriter, Url=underwriter.Underwriter.replace('-','').replace(' ','').replace('.', '').replace('&','').lower()))
    session.commit()      
    # first 3 months
    delta = timedelta(days=-92)
    datebefore = (nowsdate + delta).strftime('%Y-%m-%d')
    for underwriter in underwriters:
        underwriter = underwriter.Underwriter
        symbols = session.query(Underwriters).with_entities(Underwriters.Symbol).filter(Underwriters.Underwriter == underwriter, Underwriters.OfferDate >= datebefore).all()
        if len(symbols) > 0:
            Return = 0
            Return_h = 0
            count = 0
            symbols = [symbol.Symbol for symbol in symbols]
            if 'HFEN' in symbols: symbols.remove('HFEN')
            if 'VACC' in symbols: symbols.remove('VACC')
            if 'ARYA' in symbols: symbols.remove('ARYA')
            if 'PAND' in symbols: symbols.remove('PAND')
            if 'FSDC' in symbols: symbols.remove('FSDC')
            if 'TXAC' in symbols: symbols.remove('TXAC')
            for symbol in symbols:
                print(symbol)
                quote = session.query(IPOBASIC).filter(IPOBASIC.Symbol==symbol).one()
                if quote.Return is not None:               
                    Return += quote.Return
                    if quote.Earn_2day >= 0.1:
                        Return_h += quote.Earn_2day
                    elif quote.Loss_2day <= -0.1:
                        Return_h += quote.Loss_2day
                    else:
                        if abs(quote.Loss_2day) < quote.Earn_2day:
                            Return_h += quote.Earn_2day
                        else:
                            Return_h += quote.Loss_2day
                    count += 1
                
            Return = Return/max(count, 1)
            Return_h = Return_h/max(count, 1)
            exist = session.query(UnderwritersPerf).filter(UnderwritersPerf.Underwriter==underwriter).all()
            if len(exist) > 0:
                session.query(UnderwritersPerf).filter(UnderwritersPerf.Underwriter==underwriter).update({UnderwritersPerf.Return_3: round(Return, 4), UnderwritersPerf.Return_h_3: round(Return_h, 4), UnderwritersPerf.Num_3: count, UnderwritersPerf.Url: underwriter.replace('-','').replace(' ','').replace('.', '').replace('&','').lower()})
            else:
                session.add(UnderwritersPerf(Underwriter=underwriter, Return_3=round(Return,4), Return_h_3=round(Return_h,4), Num_3=count, Url=underwriter.replace('-','').replace(' ','').replace('.', '').replace('&','').lower()))
            session.commit()

    # first 6 months
    delta = timedelta(days=-183)
    datebefore = (nowsdate + delta).strftime('%Y-%m-%d')
    for underwriter in underwriters:
        underwriter = underwriter.Underwriter
        symbols = session.query(Underwriters).with_entities(Underwriters.Symbol).filter(Underwriters.Underwriter == underwriter, Underwriters.OfferDate >= datebefore).all()
        if len(symbols) > 0:
            Return = 0
            Return_h = 0
            count = 0
            symbols = [symbol.Symbol for symbol in symbols]
            if 'HFEN' in symbols: symbols.remove('HFEN')
            if 'VACC' in symbols: symbols.remove('VACC')
            if 'ARYA' in symbols: symbols.remove('ARYA')
            if 'PAND' in symbols: symbols.remove('PAND')
            if 'FSDC' in symbols: symbols.remove('FSDC')
            if 'TXAC' in symbols: symbols.remove('TXAC')
            for symbol in symbols:
                quote = session.query(IPOBASIC).with_entities(IPOBASIC.Return, IPOBASIC.Earn_2day, IPOBASIC.Loss_2day).filter(IPOBASIC.Symbol==symbol).one()
                if quote.Return is not None:
                    Return += quote.Return
                    if quote.Earn_2day >= 0.1:
                        Return_h += quote.Earn_2day
                    elif quote.Loss_2day <= -0.1:
                        Return_h += quote.Loss_2day
                    else:
                        if abs(quote.Loss_2day) < quote.Earn_2day:
                            Return_h += quote.Earn_2day
                        else:
                            Return_h += quote.Loss_2day
                    count += 1
            Return = Return/max(count, 1)
            Return_h = Return_h/max(count, 1)
            exist = session.query(UnderwritersPerf).filter(UnderwritersPerf.Underwriter==underwriter).all()
            if len(exist) > 0:
                session.query(UnderwritersPerf).filter(UnderwritersPerf.Underwriter==underwriter).update({UnderwritersPerf.Return_6: round(Return, 4), UnderwritersPerf.Return_h_6: round(Return_h, 4), UnderwritersPerf.Num_6: count})
            else:
                session.add(UnderwritersPerf(Underwriter=underwriter, Return_6=round(Return,4), Return_h_6=round(Return_h,4), Num_6=count))
            session.commit()

    # first 12 months
    delta = timedelta(days=-365)
    datebefore = (nowsdate + delta).strftime('%Y-%m-%d')
    for underwriter in underwriters:
        underwriter = underwriter.Underwriter
        symbols = session.query(Underwriters).with_entities(Underwriters.Symbol).filter(Underwriters.Underwriter == underwriter, Underwriters.OfferDate >= datebefore).all()
        if len(symbols) > 0:
            Return = 0
            Return_h = 0
            count = 0
            symbols = [symbol.Symbol for symbol in symbols]
            if 'HFEN' in symbols: symbols.remove('HFEN')
            if 'VACC' in symbols: symbols.remove('VACC')
            if 'ARYA' in symbols: symbols.remove('ARYA')
            if 'PAND' in symbols: symbols.remove('PAND')
            if 'FSDC' in symbols: symbols.remove('FSDC')
            if 'TXAC' in symbols: symbols.remove('TXAC')
            for symbol in symbols:
                quote = session.query(IPOBASIC).with_entities(IPOBASIC.Return, IPOBASIC.Earn_2day, IPOBASIC.Loss_2day).filter(IPOBASIC.Symbol==symbol).one()
                if quote.Return is not None:
                    Return += quote.Return
                    if quote.Earn_2day >= 0.1:
                        Return_h += quote.Earn_2day
                    elif quote.Loss_2day <= -0.1:
                        Return_h += quote.Loss_2day
                    else:
                        if abs(quote.Loss_2day) < quote.Earn_2day:
                            Return_h += quote.Earn_2day
                        else:
                            Return_h += quote.Loss_2day
                    count += 1
            Return = Return/max(count, 1)
            Return_h = Return_h/max(count, 1)
            exist = session.query(UnderwritersPerf).filter(UnderwritersPerf.Underwriter==underwriter).all()
            if len(exist) > 0:
                session.query(UnderwritersPerf).filter(UnderwritersPerf.Underwriter==underwriter).update({UnderwritersPerf.Return_12: round(Return, 4), UnderwritersPerf.Return_h_12: round(Return_h, 4), UnderwritersPerf.Num_12: count})
            else:
                session.add(UnderwritersPerf(Underwriter=underwriter, Return_12=round(Return,4), Return_h_12=round(Return_h,4), Num_12=count))
            session.commit()


def bysectors():
    engine = create_engine(SQLAlCHEMY_DATABASE_URI, echo=True)
    session = sessionmaker(bind = engine)()
    nowsdate = datetime.now()
    sectors = session.query(IPOBASIC).with_entities(IPOBASIC.Section).filter().distinct().all()
    for sector in sectors:
        session.add(SectorsPerf(Sector=sector.Section, Url=sector.Section.replace('&','').replace(' ','').lower()))
    session.commit()
    delta = timedelta(days=-92)
    datebefore = (nowsdate + delta).strftime('%Y-%m-%d')
    for sector in sectors:
        sector = sector.Section
        symbols = session.query(IPOBASIC).with_entities(IPOBASIC.Symbol).filter(IPOBASIC.Section == sector, IPOBASIC.OfferDate >= datebefore).all()
        if len(symbols) > 0:
            Return = 0
            Return_h = 0
            count = 0
            symbols = [symbol.Symbol for symbol in symbols]
            if 'HFEN' in symbols: symbols.remove('HFEN')
            if 'VACC' in symbols: symbols.remove('VACC')
            if 'ARYA' in symbols: symbols.remove('ARYA')
            if 'PAND' in symbols: symbols.remove('PAND')
            if 'FSDC' in symbols: symbols.remove('FSDC')
            if 'TXAC' in symbols: symbols.remove('TXAC')
            for symbol in symbols:
                quote = session.query(IPOBASIC).filter(IPOBASIC.Symbol==symbol).one()
                if quote.Return is not None:               
                    Return += quote.Return
                    if quote.Earn_2day >= 0.1:
                        Return_h += quote.Earn_2day
                    elif quote.Loss_2day <= -0.1:
                        Return_h += quote.Loss_2day
                    else:
                        if abs(quote.Loss_2day) < quote.Earn_2day:
                            Return_h += quote.Earn_2day
                        else:
                            Return_h += quote.Loss_2day
                    count += 1
                
            Return = Return/max(count, 1)
            Return_h = Return_h/max(count, 1)
            exist = session.query(SectorsPerf).filter(SectorsPerf.Sector==sector).all()
            if len(exist) > 0:
                session.query(SectorsPerf).filter(SectorsPerf.Sector==sector).update({SectorsPerf.Return_3: round(Return, 4), SectorsPerf.Return_h_3: round(Return_h, 4), SectorsPerf.Num_3: count})
            else:
                session.add(SectorsPerf(Sector=sector, Return_3=round(Return,4), Return_h_3=round(Return_h,4), Num_3=count))
            session.commit()

    delta = timedelta(days=-183)
    datebefore = (nowsdate + delta).strftime('%Y-%m-%d')
    for sector in sectors:
        sector = sector.Section
        symbols = session.query(IPOBASIC).with_entities(IPOBASIC.Symbol).filter(IPOBASIC.Section == sector, IPOBASIC.OfferDate >= datebefore).all()
        if len(symbols) > 0:
            Return = 0
            Return_h = 0
            count = 0
            symbols = [symbol.Symbol for symbol in symbols]
            if 'HFEN' in symbols: symbols.remove('HFEN')
            if 'VACC' in symbols: symbols.remove('VACC')
            if 'ARYA' in symbols: symbols.remove('ARYA')
            if 'PAND' in symbols: symbols.remove('PAND')
            if 'FSDC' in symbols: symbols.remove('FSDC')
            if 'TXAC' in symbols: symbols.remove('TXAC')
            for symbol in symbols:
                quote = session.query(IPOBASIC).filter(IPOBASIC.Symbol==symbol).one()
                if quote.Return is not None:               
                    Return += quote.Return
                    if quote.Earn_2day >= 0.1:
                        Return_h += quote.Earn_2day
                    elif quote.Loss_2day <= -0.1:
                        Return_h += quote.Loss_2day
                    else:
                        if abs(quote.Loss_2day) < quote.Earn_2day:
                            Return_h += quote.Earn_2day
                        else:
                            Return_h += quote.Loss_2day
                    count += 1
                
            Return = Return/max(count, 1)
            Return_h = Return_h/max(count, 1)
            exist = session.query(SectorsPerf).filter(SectorsPerf.Sector==sector).all()
            if len(exist) > 0:
                session.query(SectorsPerf).filter(SectorsPerf.Sector==sector).update({SectorsPerf.Return_6: round(Return, 4), SectorsPerf.Return_h_6: round(Return_h, 4), SectorsPerf.Num_6: count})
            else:
                session.add(SectorsPerf(Sector=sector, Return_6=round(Return,4), Return_h_6=round(Return_h,4), Num_6=count))
            session.commit()

    delta = timedelta(days=-365)
    datebefore = (nowsdate + delta).strftime('%Y-%m-%d')
    for sector in sectors:
        sector = sector.Section
        symbols = session.query(IPOBASIC).with_entities(IPOBASIC.Symbol).filter(IPOBASIC.Section == sector, IPOBASIC.OfferDate >= datebefore).all()
        if len(symbols) > 0:
            Return = 0
            Return_h = 0
            count = 0
            symbols = [symbol.Symbol for symbol in symbols]
            if 'HFEN' in symbols: symbols.remove('HFEN')
            if 'VACC' in symbols: symbols.remove('VACC')
            if 'ARYA' in symbols: symbols.remove('ARYA')
            if 'PAND' in symbols: symbols.remove('PAND')
            if 'FSDC' in symbols: symbols.remove('FSDC')
            if 'TXAC' in symbols: symbols.remove('TXAC')
            for symbol in symbols:
                quote = session.query(IPOBASIC).filter(IPOBASIC.Symbol==symbol).one()
                if quote.Return is not None:               
                    Return += quote.Return
                    if quote.Earn_2day >= 0.1:
                        Return_h += quote.Earn_2day
                    elif quote.Loss_2day <= -0.1:
                        Return_h += quote.Loss_2day
                    else:
                        if abs(quote.Loss_2day) < quote.Earn_2day:
                            Return_h += quote.Earn_2day
                        else:
                            Return_h += quote.Loss_2day
                    count += 1
                
            Return = Return/max(count, 1)
            Return_h = Return_h/max(count, 1)
            exist = session.query(SectorsPerf).filter(SectorsPerf.Sector==sector).all()
            if len(exist) > 0:
                session.query(SectorsPerf).filter(SectorsPerf.Sector==sector).update({SectorsPerf.Return_12: round(Return, 4), SectorsPerf.Return_h_12: round(Return_h, 4), SectorsPerf.Num_12: count})
            else:
                session.add(SectorsPerf(Sector=sector, Return_12=round(Return,4), Return_h_12=round(Return_h,4), Num_12=count))
            session.commit()



if __name__ == '__main__':
    basicanalysis()
    byunderwriters()
    bysectors()
