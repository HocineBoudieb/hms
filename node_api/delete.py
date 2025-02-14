from sqlalchemy import create_engine, Column, Integer, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Configuration de la base de données
DATABASE_URL = "sqlite:///prisma/hermes.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Définition des modèles
class Order(Base):
    __tablename__ = 'orders'
    id = Column(Integer, primary_key=True, index=True)

class EnCours(Base):
    __tablename__ = 'en_cours'
    id = Column(Integer, primary_key=True, index=True)

class Workshop(Base):
    __tablename__ = 'workshops'
    id = Column(Integer, primary_key=True, index=True)

class Time(Base):
    __tablename__ = 'time'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    orderId = Column(Integer, ForeignKey('orders.id'))
    duration = Column(Integer)
    enCoursId = Column(Integer, ForeignKey('en_cours.id'), nullable=True)
    workshopId = Column(Integer, ForeignKey('workshops.id'), nullable=True)

    order = relationship("Order")
    en_cours = relationship("EnCours")
    workshop = relationship("Workshop")

# Fonction pour supprimer les entrées dupliquées
def delete_duplicated_entries():
    db = SessionLocal()

    # Supprimer les entrées pour orderId de 9 à 27
    db.query(Time).filter(Time.orderId.in_(range(9, 28))).delete(synchronize_session=False)

    db.commit()
    db.close()

# Exécuter la suppression
delete_duplicated_entries()
