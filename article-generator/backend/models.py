from pydantic import BaseModel, Field
from typing import Optional, List


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


class ArticleRequest(BaseModel):
    query: str = Field(..., description="Content query for article generation")
    url: Optional[str] = Field(None, description="Optional URL for context")


class ArticleSection(BaseModel):
    heading: str
    content: str


class ArticleData(BaseModel):
    title: str
    introduction: str
    sections: List[ArticleSection]
    conclusion: str
    references: List[str]


class SEOMetadata(BaseModel):
    title: str
    description: str
    keywords: List[str]
    meta_tags: dict


class ArticleResponse(BaseModel):
    article: ArticleData
    seo: SEOMetadata
