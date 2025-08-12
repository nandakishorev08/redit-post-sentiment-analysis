import praw
import json
from main import analyze_text  # 👈 Import your Watson function
#from langdetect import detect
#from deep_translator import GoogleTranslator

# Set Reddit credentials
reddit = praw.Reddit(
    client_id="vqyOCygPzkuAyDBvSJeRhA",
    client_secret="22lgxkYQzBP-cOGDmX2iPtgXODhC0A",
    user_agent="mental-health-app by u/Amazing-Border206"
)

# Ask for username input
def analyse_sentiments(username):
    #username = input("Enter Reddit username: ")
    output = {
        "username": username,
        "posts": []
    }

# Fetch and analyze the latest 2 posts
    try:
        user = reddit.redditor(username)
        print(f"\nLatest 2 posts by u/{username}:")

        for post in user.submissions.new(limit=2):
        # Combine title and content for analysis
            text_to_analyze = f"{post.title}\n{post.selftext}" if post.selftext else post.title
            #text_to_analyze_new = preprocess_text(text_to_analyze)
        # Analyze text using Watson NLU
            emotion_scores, sentiment = analyze_text(text_to_analyze)

        # Store result
            output["posts"].append({
                "title": post.title,
                "content": post.selftext if post.selftext else "[No text content]",
                "url": f"https://www.reddit.com{post.permalink}",
                "sentiment": sentiment,
                "emotions": emotion_scores
            })

    # Print full output
        reply = {
            "title": output["posts"][0],
        }
        #print(output)
        return {"status": "success",
                "message": reply}
        #print(json.dumps(output, indent=4))

    except Exception as e:
        return {"message":"error occured",
                "error":e}
        #print(f"Error: {e}")

def preprocess_text(text):
    try:
        # Detect the language
        lang = detect(text)

        # If Malayalam, translate to English
        if lang == 'ml':
            translated_text = GoogleTranslator(source='auto', target='en').translate(text)
            return translated_text

        # If not Malayalam, return the original text
        return text

    except Exception as e:
        print(f"Error during preprocessing: {e}")
        return text  # Fallback to original if any error occurs
