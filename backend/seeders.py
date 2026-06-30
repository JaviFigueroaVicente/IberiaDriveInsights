import pandas as pd
from database import engine, Base, SessionLocal
from models import User
from security import get_password_hash
from sqlalchemy import text

def generar_seeders():
    # drop_all y create_all ya eliminan y recrean las tablas limpias con sus secuencias en 1
    print("Recreando la estructura de la base de datos...")
    Base.metadata.drop_all(bind=engine) 
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Insertar usuarios administradores
        users = [
            User(id=1, name='Admin', surname='IberiaDrive', email='admin@demo.com', password=get_password_hash('admin') , role=1),
            User(id=2, name='Comercial', surname='User', email='user@demo.com', password=get_password_hash('12345678'), role=2)
        ]

        db.bulk_save_objects(users)
        db.commit()

        # Cargar y procesar dataset de coches
        df_cars = pd.read_csv('datasets/coches_clean.csv')
        df_cars['registration'] = pd.to_datetime(df_cars['registration'], format='%m/%Y').dt.strftime('%Y-%m-01')
        
        df_cars.to_sql('cars', con=engine, if_exists='append', index=False)

        # Cargar el resto de datasets maestros
        df_cars_kaffle = pd.read_csv('datasets/data_clean.csv')
        df_cars_kaffle.to_sql('cars_kaffle', con=engine, if_exists='append', index=False)

        df_makes = pd.read_csv('datasets/seed_marcas_bbdd.csv')
        df_makes.to_sql('makes', con=engine, if_exists='append', index=False)

        df_models = pd.read_csv('datasets/seed_modelos_bbdd.csv')
        df_models.to_sql('models', con=engine, if_exists='append', index=False)
        
        df_versions = pd.read_csv('datasets/seed_versiones_bbdd.csv')
        df_versions.to_sql('versions', con=engine, if_exists='append', index=False)

        df_gear_types = pd.read_csv('datasets/seed_gear_types.csv')
        df_gear_types.to_sql('gear_types', con=engine, if_exists='append', index=False)

        df_fuel_types = pd.read_csv('datasets/seed_fuel_types.csv')
        df_fuel_types.to_sql('fuel_types', con=engine, if_exists='append', index=False)

        print("Datos insertados correctamente")
            
    except Exception as e:
        print(f"ERROR: {e}")
        db.rollback()

    finally:
        db.close()

if __name__ == "__main__":
    generar_seeders()