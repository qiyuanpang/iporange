from sqlalchemy import Column, Integer, String, Float, Date, Unicode
from sqlalchemy import UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class IPOBASIC(Base):
    __tablename__ = 'ipobasic'
    id = Column(Integer, primary_key=True)
    Company = Column(String)
    Section = Column(String)
    Symbol = Column(String, unique=True)
    Shares = Column(Float)
    OfferPrice = Column(Float)
    OfferDate = Column(String)
    Url = Column(String)
    Return = Column(Float, default=0)
    Earn_1day = Column(Float, default=0)
    Loss_1day = Column(Float, default=0)
    Earn_2day = Column(Float, default=0)
    Loss_2day = Column(Float, default=0)
    Earn_7day = Column(Float, default=0)
    Loss_7day = Column(Float, default=0)
    Earn_14day = Column(Float, default=0)
    Loss_14day = Column(Float, default=0)
    Earn_30day = Column(Float, default=0)
    Loss_30day = Column(Float, default=0)
    High_1day = Column(Float, default=0)
    Low_1day = Column(Float, default=0)
    High_2day = Column(Float, default=0)
    Low_2day = Column(Float, default=0)
    High_7day = Column(Float, default=0)
    Low_7day = Column(Float, default=0)
    High_14day = Column(Float, default=0)
    Low_14day = Column(Float, default=0)
    High_30day = Column(Float, default=0)
    Low_30day = Column(Float, default=0)

class UpcomingIPOs(Base):
    __tablename__ = 'upcomingipos'
    id = Column(Integer, primary_key=True)
    Company = Column(String)
    Section = Column(String)
    Symbol = Column(String, unique=True)
    Shares = Column(Float)
    Url = Column(String)
    OfferPriceLow = Column(Float)
    OfferPriceHigh = Column(Float)
    OfferDate = Column(String)

class GeneralInfo(Base):
    __tablename__ = 'generalinfo'
    id = Column(Integer, primary_key=True)
    Symbol = Column(String, unique=True)
    Industry = Column(String)
    Employees = Column(String)
    Founded = Column(String)
    Business = Column(String)

class ContactInfo(Base):
    __tablename__ = 'contactinfo'
    id = Column(Integer, primary_key=True)
    Symbol = Column(String, unique=True)
    Address = Column(String)
    PhoneNumber = Column(String)
    Website = Column(String)

class FinancialInfo(Base):
    __tablename__ = 'financialinfo'
    id = Column(Integer, primary_key=True)
    Symbol = Column(String, unique=True)
    Prospectus = Column(String)
    MarketCap = Column(String)
    Revenues = Column(String)
    NetIncome = Column(String)

class Sectors(Base):
    __tablename__ = 'sectors'
    id = Column(Integer, primary_key=True)
    Sector = Column(String)
    Symbol = Column(String)
    Industry = Column(String)
    OfferDate = Column(String)
    __table_args__ = (UniqueConstraint('Sector', 'Symbol'),)

class Underwriters(Base):
    __tablename__ = 'underwriters'
    id = Column(Integer, primary_key=True)
    Underwriter = Column(String)
    Symbol = Column(String)
    OfferDate = Column(String)
    __table_args__ = (UniqueConstraint('Underwriter', 'Symbol'),)

class CoManagers(Base):
    __tablename__ = 'comanagers'
    id = Column(Integer, primary_key=True)
    CoManager = Column(String)
    Symbol = Column(String)
    OfferDate = Column(String)
    # __table_args__ = (UniqueConstraint('CoManager', 'Symbol'),)

class Quotes(Base):
    __tablename__ = 'quotes'
    id = Column(Integer, primary_key=True)
    Symbol = Column(String)
    Date = Column(String)
    Open = Column(Float)
    High = Column(Float)
    Low = Column(Float)
    Close = Column(Float)
    Volume = Column(Float)
    __table_args__ = (UniqueConstraint('Date', 'Symbol'),)

class UnderwritersPerf(Base):
    __tablename__ = 'underwritersperf'
    id = Column(Integer, primary_key=True)
    Underwriter = Column(String, unique=True)
    Url = Column(String)
    Return_3 = Column(Float, default=0)
    Return_6 = Column(Float, default=0)
    Return_12 = Column(Float, default=0)
    Return_h_3 = Column(Float, default=0)
    Return_h_6 = Column(Float, default=0)
    Return_h_12 = Column(Float, default=0)
    Num_3 = Column(Integer, default=0)
    Num_6 = Column(Integer, default=0)
    Num_12 = Column(Integer, default=0)

    
class SectorsPerf(Base):
    __tablename__ = 'sectorsperf'
    id = Column(Integer, primary_key=True)
    Sector = Column(String, unique=True)
    Url = Column(String)
    Return_3 = Column(Float, default=0)
    Return_6 = Column(Float, default=0)
    Return_12 = Column(Float, default=0)
    Return_h_3 = Column(Float, default=0)
    Return_h_6 = Column(Float, default=0)
    Return_h_12 = Column(Float, default=0)
    Num_3 = Column(Integer, default=0)
    Num_6 = Column(Integer, default=0)
    Num_12 = Column(Integer, default=0)
