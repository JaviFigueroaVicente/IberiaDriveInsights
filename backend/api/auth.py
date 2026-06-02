from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Annotated, List
import jwt
from jwt.exceptions import InvalidTokenError
from datetime import datetime
from security import verify_password, get_password_hash
import models, security, schemas
from schemas import UserCreate, UserResponseWithCars, UserUpdate, ProfileUpdate, UserResponse, PasswordUpdate
from database import SessionLocal

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], 
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar el token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

async def get_admin_user(
    current_user: Annotated[models.User, Depends(get_current_user)]
):
    if current_user.role != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="No tienes permisos de administrador para esta acción"
        )
    return current_user

@router.post("/token", response_model=schemas.Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not security.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=schemas.User)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = security.get_password_hash(user.password)
    
    db_user = models.User(
        email=user.email,
        password=hashed_password,
        name=user.name,
        surname=user.surname
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user: Annotated[models.User, Depends(get_current_user)]
):
    return current_user

@router.put("/me", response_model=schemas.User)
async def update_user_me(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        # 1. Modificar únicamente los campos permitidos en el objeto del usuario actual
        current_user.name = profile_data.name
        current_user.surname = profile_data.surname
        
        # 2. Persistir los cambios en la base de datos
        db.add(current_user)
        db.commit()
        db.refresh(current_user)  # Recarga las relaciones y datos frescos (como cars, role, etc.)
        
        return current_user

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno al actualizar el perfil: {str(e)}"
        )

@router.put("/me/change-password")
async def change_password(
    password_data: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    
    if not verify_password(password_data.current_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="La contraseña actual provista es incorrecta. Protocolo denegado."
        )
    
    if verify_password(password_data.new_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La nueva contraseña no puede ser igual a la contraseña actual."
        )

    # 2. Modificar la propiedad real del modelo persistido
    current_user.password = get_password_hash(password_data.new_password)
    
    try:
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al persistir los cambios en la base de datos: {str(e)}"
        )

    return {"status": "success", "message": "Contraseña cambiada con éxito"}

@router.post("/logout")
async def logout():
    return {"message": "Logout successful"}

@router.get("/users", response_model=List[UserResponseWithCars])
async def get_users(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_admin_user)
):
    users_data = db.query(models.User).all()
    return users_data


@router.put("/users/{user_id}", response_model=UserResponseWithCars)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado en el sistema")
    
    update_data = user_update.model_dump(exclude_unset=True)
    
    if "password" in update_data:
        password_value = update_data.pop("password")
        if password_value is not None and str(password_value).strip() != "":
            db_user.password = security.get_password_hash(password_value)
    
    for key, value in update_data.items():
        if hasattr(db_user, key):
            setattr(db_user, key, value)
        
    db_user.updated_at = datetime.now()
    
    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/users/{user_id}", status_code=200)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Protocolo denegado: No puedes auto-eliminar tu propia identidad raíz")

    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Identidad no encontrada")
    
    db.delete(db_user)
    db.commit()
    
    return {"detail": f"Identidad USR-{user_id} revocada y eliminada correctamente"}