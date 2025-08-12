from fastapi import FastAPI, Path
from reddit_module import analyse_sentiments
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://redit-post-sentiment-analysis-1.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def index():
    return {"message": "hello"}

@app.get("/post-emotion")
def post_analysis(user_id: str):
    return analyse_sentiments(user_id)
# while(True):
#     try:
#         user_id = input("enter user_id: ")
#         if(user_id == "quit"):
#             print("byeee..")
#             break
#         print(analyse_sentiments(user_id))
#     except:
#         print("some error occured.. bye bye")
#         break
