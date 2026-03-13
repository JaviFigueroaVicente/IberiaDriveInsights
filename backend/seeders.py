import pandas as pd
from database import engine, Base, SessionLocal
from models import Car, User
from werkzeug.security import generate_password_hash

def generar_seeders():
    Base.metadata.drop_all(bind=engine) 
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        users = [
            User(id=1, name='Admin', surname='IberiaDrive', email='admin@demo.com', password=generate_password_hash('admin') , role=1),
            User(id=2, name='Comercial', surname='User', email='user@demo.com', password=generate_password_hash('12345678'), role=2)
        ]

        db.bulk_save_objects(users)
        db.commit()

        df = pd.read_csv('datasets/data_clean.csv')

        df.to_sql('cars', con=engine, if_exists='append', index=False)

        print("Datos insertados correctamente")
            
    except Exception as e:
        print(f"ERROR: {e}")
        db.rollback()

    finally:
        db.close()

if __name__ == "__main__":
    generar_seeders()