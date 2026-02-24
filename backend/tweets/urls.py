from django.urls import path
from .views import (
    TweetListCreateView,
    MyTweetsView,
    LikeTweetView,
    CommentListCreateView,
)

urlpatterns = [
    path('', TweetListCreateView.as_view(), name='tweet-list-create'),
    path('me', MyTweetsView.as_view(), name='my-tweets'),
    path('<uuid:tweet_id>/like', LikeTweetView.as_view(), name='like-tweet'),
    path('<uuid:tweet_id>/comments', CommentListCreateView.as_view(), name='comments'),
]
