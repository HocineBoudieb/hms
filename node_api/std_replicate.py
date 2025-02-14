from sqlalchemy import create_engine, Column, Integer, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Configuration de la base de données
DATABASE_URL = "sqlite:///prisma/hermes.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Définition des modèles
class Workshop(Base):
    __tablename__ = 'workshops'
    id = Column(Integer, primary_key=True, index=True)

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True, index=True)

class StdTime(Base):
    __tablename__ = 'stdtime'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    value = Column(Integer)
    workshopId = Column(Integer, ForeignKey('workshops.id'))
    productId = Column(Integer, ForeignKey('products.id'))

    workshop = relationship("Workshop")
    product = relationship("Product")

# Fonction pour dupliquer les entrées
def duplicate_stdtime_entries():
    db = SessionLocal()

    # Mapping des productId source vers les productId cible
    product_mapping = {1: 4, 2: 5, 3: 6, 4: 7, 5: 8}

    # Pour chaque productId source, copier les entrées vers le productId cible
    for src_product_id, dest_product_id in product_mapping.items():
        # Récupérer les entrées pour le productId source
        stdtimes_src_product = db.query(StdTime).filter(StdTime.productId == src_product_id).all()

        # Dupliquer pour le productId cible
        for stdtime in stdtimes_src_product:
            new_stdtime = StdTime(
                value=stdtime.value,
                workshopId=stdtime.workshopId,
                productId=dest_product_id
            )
            db.add(new_stdtime)

    db.commit()
    db.close()

# Exécuter la duplication
duplicate_stdtime_entries()
