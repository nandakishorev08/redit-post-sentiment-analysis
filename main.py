from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import Features, EmotionOptions, SentimentOptions

# 🔑 Your IBM Cloud credentials here
api_key = 'yCCpIruecN1AD9xGetLA-OO0cZCTcWuVUwROr9GKhot0'
url = 'https://api.au-syd.natural-language-understanding.watson.cloud.ibm.com/instances/3d103d94-bb8c-4222-b646-56c19e72daf8'

# Auth and client setup
authenticator = IAMAuthenticator(api_key)
nlu = NaturalLanguageUnderstandingV1(
    version='2022-04-07',
    authenticator=authenticator
)
nlu.set_service_url(url)

# 🔍 Analyze emotion + sentiment
def analyze_text(text):
    print(text)
    response = nlu.analyze(
        text=text,
        features=Features(
            emotion=EmotionOptions(),
            sentiment=SentimentOptions()
        )
    ).get_result()
    
    emotion_scores = response['emotion']['document']['emotion']
    sentiment = response['sentiment']['document']['label']
    joy = emotion_scores.get('joy', 0)
    if sentiment == 'negative' and joy >= 0.9:
    # High joy but negative sentiment → joy is misleading
        joy = 0.0
    
    return emotion_scores, sentiment

# 🧪 Test
if __name__ == "__main__":
    user_input = input("Enter your post or story: ")
    emotions, sentiment = analyze_text(user_input)

    print("\nDetected Emotion Scores:")
    for emotion, score in emotions.items():
        print(f"{emotion.capitalize()}: {score:.2f}")
    
    print(f"\nOverall Sentiment: {sentiment.capitalize()}")
