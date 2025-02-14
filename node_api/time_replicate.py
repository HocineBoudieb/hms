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

# Fonction pour dupliquer les entrées
def duplicate_entries():
    db = SessionLocal()

    # Récupérer les entrées pour orderId de 1 à 8
    times_order_1_to_8 = db.query(Time).filter(Time.orderId.in_(range(1, 9))).all()

    # Dupliquer pour orderId de 9 à 18
    for order_id in range(9, 19):
        # Vérifier si des entrées existent déjà pour cet orderId
        existing_entries = db.query(Time).filter(Time.orderId == order_id).all()
        if not existing_entries:
            for time in times_order_1_to_8:
                new_time = Time(
                    orderId=order_id,
                    duration=time.duration,
                    enCoursId=time.enCoursId,
                    workshopId=time.workshopId
                )
                db.add(new_time)

    db.commit()
    db.close()

# Exécuter la duplication
duplicate_entries()
