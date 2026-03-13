from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI

router = APIRouter()

class RecommendationRequest(BaseModel):
    occasion: str = Field(..., description="The occasion for the outfit")
    weather_context: str = Field(..., description="Weather conditions to consider")
    style_preference: str = Field(..., description="Style preference for the outfit")

class OutfitItem(BaseModel):
    category: str
    item: str
    reason: str

class RecommendationResponse(BaseModel):
    occasion: str
    weather_context: str
    style_preference: str
    outfit_items: List[OutfitItem]
    summary: str

@router.post("/recommendations", response_model=RecommendationResponse)
async def generate_recommendation(request: RecommendationRequest):
    """
    Generate an outfit recommendation based on context using Mistral API.
    
    Args:
        request: Contains occasion, weather context, and style preference
        
    Returns:
        A complete outfit recommendation with items and reasoning
    """
    
    # Validate inputs
    valid_occasions = ["Class or campus day", "Office or workday", "Dinner or social outing", "Weekend casual"]
    valid_styles = ["Relaxed", "Polished", "Minimal", "Statement"]
    
    if request.occasion not in valid_occasions:
        raise HTTPException(status_code=400, detail="Invalid occasion")
    
    if request.style_preference not in valid_styles:
        raise HTTPException(status_code=400, detail="Invalid style preference")
    
    if not request.weather_context.strip():
        raise HTTPException(status_code=400, detail="Weather context is required")
    
    try:
        # Try to use Mistral API for sophisticated recommendations
        recommendation = await generate_mistral_recommendation(
            request.occasion,
            request.weather_context,
            request.style_preference
        )
        
        if recommendation:
            return recommendation
    except Exception as e:
        print(f"Mistral API failed, falling back to static generation: {e}")
    
    # Fallback to static generation if Mistral API is not available
    outfit_items = generate_outfit_items(
        request.occasion, 
        request.weather_context, 
        request.style_preference
    )
    
    summary = generate_summary(
        request.occasion,
        request.weather_context,
        request.style_preference,
        outfit_items
    )
    
    return RecommendationResponse(
        occasion=request.occasion,
        weather_context=request.weather_context,
        style_preference=request.style_preference,
        outfit_items=outfit_items,
        summary=summary
    )

def generate_outfit_items(occasion: str, weather_context: str, style: str) -> List[OutfitItem]:
    """Generate outfit items based on context"""
    
    # Base items that work for most occasions
    base_items = [
        OutfitItem(
            category="Top",
            item="Cotton crew neck t-shirt",
            reason="Comfortable base layer suitable for most occasions"
        )
    ]
    
    # Add occasion-specific items
    if occasion == "Class or campus day":
        base_items.extend([
            OutfitItem(
                category="Bottom",
                item="Dark wash jeans",
                reason="Versatile and appropriate for campus environment"
            ),
            OutfitItem(
                category="Shoes",
                item="White sneakers",
                reason="Comfortable for walking around campus"
            )
        ])
    elif occasion == "Office or workday":
        base_items.extend([
            OutfitItem(
                category="Bottom",
                item="Chinos or dress pants",
                reason="Professional appearance suitable for office"
            ),
            OutfitItem(
                category="Shoes",
                item="Loafers or dress shoes",
                reason="Formal footwear for professional setting"
            )
        ])
    elif occasion == "Dinner or social outing":
        base_items.extend([
            OutfitItem(
                category="Bottom",
                item="Dark jeans or dress pants",
                reason="Smart casual appropriate for dining"
            ),
            OutfitItem(
                category="Shoes",
                item="Clean sneakers or casual shoes",
                reason="Balances style and comfort for social settings"
            )
        ])
    elif occasion == "Weekend casual":
        base_items.extend([
            OutfitItem(
                category="Bottom",
                item="Comfortable jeans or joggers",
                reason="Relaxed fit perfect for weekend activities"
            ),
            OutfitItem(
                category="Shoes",
                item="Casual sneakers",
                reason="Comfortable for weekend errands and activities"
            )
        ])
    
    # Add weather-specific items
    weather_lower = weather_context.lower()
    if any(word in weather_lower for word in ["rain", "wet", "drizzle"]):
        base_items.append(
            OutfitItem(
                category="Outerwear",
                item="Waterproof jacket or trench coat",
                reason="Keeps you dry in wet conditions"
            )
        )
    elif any(word in weather_lower for word in ["cold", "chilly", "cool"]):
        base_items.append(
            OutfitItem(
                category="Outerwear",
                item="Light jacket or sweater",
                reason="Provides warmth for cooler temperatures"
            )
        )
    elif any(word in weather_lower for word in ["warm", "hot", "sunny"]):
        base_items.append(
            OutfitItem(
                category="Accessories",
                item="Sunglasses and hat",
                reason="Protects from sun and adds style"
            )
        )
    
    # Add style-specific items
    if style == "Polished":
        base_items.append(
            OutfitItem(
                category="Accessories",
                item="Leather belt and watch",
                reason="Adds refined details to elevate the look"
            )
        )
    elif style == "Minimal":
        base_items.append(
            OutfitItem(
                category="Accessories",
                item="Simple chain or minimal jewelry",
                reason="Subtle accents that don't overpower the look"
            )
        )
    elif style == "Statement":
        base_items.append(
            OutfitItem(
                category="Accessories",
                item="Bold watch or statement jewelry",
                reason="Makes a strong fashion statement"
            )
        )
    
    return base_items

async def generate_mistral_recommendation(occasion: str, weather_context: str, style: str) -> Optional[RecommendationResponse]:
    """Generate outfit recommendation using LangChain with Mistral API"""
    
    print(f"generate_mistral_recommendation called with: occasion={occasion}, weather={weather_context}, style={style}")
    
    # Get Mistral API key from environment variable
    mistral_api_key = os.getenv("MISTRAL_API_KEY")
    
    print(f"Mistral API key found: {mistral_api_key is not None}")
    
    if not mistral_api_key:
        print("No Mistral API key found, returning None")
        return None
    
    try:
        print(f"Attempting to call Mistral API with key: {mistral_api_key[:10]}...")
        
        # Initialize LangChain Mistral AI model
        llm = ChatMistralAI(
            api_key=mistral_api_key,
            model="mistral-large-latest",
            temperature=0.7,
            max_tokens=1000
        )
        
        # Create prompt template
        prompt_template = ChatPromptTemplate.from_template(
            """Generate a personalized outfit recommendation based on the following context:

Occasion: {occasion}
Weather: {weather_context}
Style preference: {style}

Please provide a detailed outfit recommendation in the following JSON format ONLY:

{{
  "outfit_items": [
    {{"category": "Top", "item": "...", "reason": "..."}},
    {{"category": "Bottom", "item": "...", "reason": "..."}},
    {{"category": "Shoes", "item": "...", "reason": "..."}},
    {{"category": "Outerwear", "item": "...", "reason": "..."}},
    {{"category": "Accessories", "item": "...", "reason": "..."}}
  ],
  "summary": "..."
}}

IMPORTANT: Return ONLY the JSON object, no markdown formatting, no explanations, no additional text. Just the pure JSON response.
Make sure the outfit is practical, stylish, and appropriate for the given context. Consider weather conditions, occasion appropriateness, and style preferences."""
        )
        
        # Create chain (no JSON parser - we'll extract JSON manually)
        chain = prompt_template | llm
        
        print(f"Calling LangChain with occasion: {occasion}, weather: {weather_context}, style: {style}")
        
        # Invoke the chain
        response = await chain.ainvoke({
            "occasion": occasion,
            "weather_context": weather_context,
            "style": style
        })
        
        print(f"Raw LangChain response: {response}")
        
        # Extract JSON from the response manually since the model is returning markdown
        import re
        response_text = response.content
        
        # Try to find JSON in the response
        json_match = re.search(r'\{[\s\S]*"outfit_items":[\s\S]*\}', response_text)
        
        if json_match:
            json_str = json_match.group(0)
            print(f"Extracted JSON: {json_str}")
            
            # Parse the JSON
            import json as json_module
            result = json_module.loads(json_str)
            print(f"Parsed result: {result}")
        else:
            print("No JSON found in response, falling back to static generation")
            return None
        
        # Convert to our response format
        outfit_items = [
            OutfitItem(
                category=item["category"],
                item=item["item"],
                reason=item["reason"]
            )
            for item in result["outfit_items"]
        ]
        
        print(f"Generated {len(outfit_items)} items from Mistral API")
        
        return RecommendationResponse(
            occasion=occasion,
            weather_context=weather_context,
            style_preference=style,
            outfit_items=outfit_items,
            summary=result["summary"]
        )
        
    except Exception as e:
        print(f"Error calling Mistral API via LangChain: {e}")
        import traceback
        traceback.print_exc()
        return None


def generate_summary(occasion: str, weather_context: str, style: str, items: List[OutfitItem]) -> str:
    """Generate a summary of the recommendation"""
    
    item_names = [item.item for item in items]
    return f"Your {style.lower()} outfit for {occasion.lower()} in {weather_context.lower()} includes: {', '.join(item_names)}. This combination balances comfort, style, and practicality for your specific needs."
