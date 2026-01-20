from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from datetime import timedelta
from typing import Optional

from auth import (
    authenticate_user,
    create_access_token,
    get_current_active_user,
    get_current_user
)
from config import settings
from models import (
    Token,
    UserLogin,
    ArticleRequest,
    ArticleResponse,
    ArticleData,
    SEOMetadata
)
from article_generator import (
    generate_article,
    generate_seo_metadata,
    generate_html
)

app = FastAPI(title="Article Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if not authenticate_user(form_data.username, form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/api/login")
async def api_login(user: UserLogin):
    if not authenticate_user(user.username, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/me")
async def get_me(current_user: str = Depends(get_current_active_user)):
    return {"username": current_user}


@app.post("/api/generate-article")
async def generate_article_endpoint(
    request: ArticleRequest,
    current_user: str = Depends(get_current_active_user)
):
    article_data = await generate_article(request.query, request.url)
    return {"article": article_data}


@app.post("/api/generate-seo")
async def generate_seo_endpoint(
    article: ArticleData,
    current_user: str = Depends(get_current_active_user)
):
    seo_data = await generate_seo_metadata(article.dict())
    return {"seo": seo_data}


@app.post("/api/generate-full-article")
async def generate_full_article_endpoint(
    request: ArticleRequest,
    current_user: str = Depends(get_current_active_user)
):
    article_data = await generate_article(request.query, request.url)
    seo_data = await generate_seo_metadata(article_data)
    html_content = generate_html(article_data, seo_data)
    
    return {
        "article": article_data,
        "seo": seo_data,
        "html": html_content
    }


@app.post("/api/generate-html")
async def generate_html_endpoint(
    article: ArticleData,
    seo: SEOMetadata,
    current_user: str = Depends(get_current_active_user)
):
    html_content = generate_html(article.dict(), seo.dict())
    return {"html": html_content}


@app.get("/")
async def root():
    return {"message": "Article Generator API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
