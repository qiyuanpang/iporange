from sqlalchemy import Column, Integer, String, Float, Date, Unicode
from sqlalchemy import UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Userdata(Base):
    __tablename__ = 'userdata'
    id = Column(Integer, primary_key=True)
    Email = Column(String)
    Username = Column(String)
    Usernamecode = Column(String)
    Password = Column(String)
