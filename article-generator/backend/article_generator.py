import aiohttp
from bs4 import BeautifulSoup
import requests
import json
import time
import re
from typing import List, Optional
from config import settings
from typing import List, Optional
from config import settings


async def fetch_url_content(url: str) -> str:
    async with aiohttp.ClientSession() as session:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as response:
            if response.status == 200:
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                paragraphs = soup.find_all('p')
                return ' '.join([p.get_text() for p in paragraphs])
            return ""


async def search_web(query: str) -> List[str]:
    results = []
    try:
        from googlesearch import search
        urls = list(search(query, num_results=5))
        results.extend(urls)
    except Exception as e:
        print(f"Search error: {e}")
        if "429" in str(e):
            time.sleep(5)
    return results


async def get_search_context(query: str) -> str:
    urls = await search_web(query)
    context_parts = []
    
    for url in urls[:3]:
        try:
            content = await fetch_url_content(url)
            if content:
                context_parts.append(content[:2000])
        except Exception as e:
            print(f"Error fetching {url}: {e}")
    
    return "\n\n".join(context_parts)


async def generate_article(query: str, url: Optional[str] = None) -> dict:
    context = ""
    if url:
        try:
            context += await fetch_url_content(url)
            context += "\n\n"
        except Exception as e:
            print(f"Error fetching URL: {e}")
    
    try:
        search_context = await get_search_context(query)
        context += search_context
    except Exception as e:
        print(f"Search error (continuing without context): {e}")
    
    prompt = f"""Write a comprehensive article about: {query}

Additional context: {context[:4000]}

Generate a structured article with the following JSON format:
{{
    "title": "Article Title",
    "introduction": "2-3 paragraph introduction",
    "sections": [
        {{
            "heading": "Section Heading",
            "content": "Section content (2-3 paragraphs)"
        }}
    ],
    "conclusion": "Concluding paragraph",
    "references": ["URL1", "URL2"]
}}

Respond with ONLY the JSON, no additional text."""
    
    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        data=json.dumps({
            "model": "xiaomi/mimo-v2-flash:free",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7
        })
    )
    
    response.raise_for_status()
    response_data = response.json()
    
    if 'choices' not in response_data or len(response_data['choices']) == 0:
        raise ValueError(f"Invalid response from OpenRouter: {response_data}")
    
    content = response_data['choices'][0]['message']['content']
    
    if content is None:
        raise ValueError("No content received from OpenRouter API")
    
    json_match = re.search(r'\{[\s\S]*\}', content)
    if json_match:
        content = json_match.group(0)
    
    article_json = json.loads(content)
    
    return article_json


async def generate_seo_metadata(article: dict) -> dict:
    prompt = f"""Based on this article, generate SEO metadata:

Title: {article.get('title', '')}
Introduction: {article.get('introduction', '')[:500]}

Generate JSON with:
{{
    "title": "SEO optimized title (50-60 characters)",
    "description": "Meta description (150-160 characters)",
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "meta_tags": {{
        "og:title": "OG Title",
        "og:description": "OG Description"
    }}
}}

Respond with ONLY the JSON, no additional text."""
    
    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        data=json.dumps({
            "model": "xiaomi/mimo-v2-flash:free",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.5
        })
    )
    
    response.raise_for_status()
    response_data = response.json()
    
    if 'choices' not in response_data or len(response_data['choices']) == 0:
        raise ValueError(f"Invalid response from OpenRouter: {response_data}")
    
    content = response_data['choices'][0]['message']['content']
    
    if content is None:
        raise ValueError("No content received from OpenRouter API")
    
    json_match = re.search(r'\{[\s\S]*\}', content)
    if json_match:
        content = json_match.group(0)
    
    seo_json = json.loads(content)
    
    return seo_json


def generate_html(article: dict, seo: dict) -> str:
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{seo['title']}</title>
    <meta name="description" content="{seo['description']}">
    <meta name="keywords" content="{', '.join(seo['keywords'])}">
    <meta property="og:title" content="{seo['meta_tags'].get('og:title', seo['title'])}">
    <meta property="og:description" content="{seo['meta_tags'].get('og:description', seo['description'])}">
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }}
        h1 {{
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }}
        h2 {{
            color: #34495e;
            margin-top: 30px;
        }}
        .introduction {{
            font-size: 1.1em;
            color: #555;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }}
        .section {{
            margin: 20px 0;
        }}
        .conclusion {{
            background: #e8f4f8;
            padding: 15px;
            border-radius: 5px;
            margin-top: 30px;
        }}
        .references {{
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }}
        .references h3 {{
            color: #7f8c8d;
        }}
        .references ul {{
            list-style-type: none;
            padding: 0;
        }}
        .references li {{
            margin: 10px 0;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 3px;
        }}
        .references a {{
            color: #3498db;
            text-decoration: none;
        }}
        .references a:hover {{
            text-decoration: underline;
        }}
    </style>
</head>
<body>
    <article>
        <h1>{article['title']}</h1>
        
        <div class="introduction">
            {article['introduction'].replace(chr(10), '<br>')}
        </div>
        
        {''.join([f'''
        <div class="section">
            <h2>{section['heading']}</h2>
            <p>{section['content'].replace(chr(10), '<br>')}</p>
        </div>
        ''' for section in article['sections']])}
        
        <div class="conclusion">
            <h2>Conclusion</h2>
            <p>{article['conclusion'].replace(chr(10), '<br>')}</p>
        </div>
        
        <div class="references">
            <h3>References</h3>
            <ul>
                {''.join([f'<li><a href="{ref}" target="_blank">{ref}</a></li>' for ref in article.get('references', [])])}
            </ul>
        </div>
    </article>
</body>
</html>
    """
    
    return html
