import uuid
from django.db import transaction, IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework import status

from .models import Tweet, Like, Comment
from .serializers import TweetSerializer, TweetCreateSerializer, CommentSerializer


class TweetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'limit'
    max_page_size = 50


class TweetListCreateView(APIView):
    """
    GET  /api/tweets/  — paginated home feed
    POST /api/tweets/  — create tweet
    """
    permission_classes = [IsAuthenticated]
    pagination_class = TweetPagination

    def get(self, request):
        tweets_qs = Tweet.objects.all().order_by('-created_at')

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(tweets_qs, request)

        # Efficiently check which tweets the current user has liked
        tweet_ids = [str(t.id) for t in page]
        liked_ids = set(
            str(like.tweet_id)
            for like in Like.objects.filter(
                user_id=request.user.user_id,
                tweet_id__in=tweet_ids
            )
        )

        serializer = TweetSerializer(
            page,
            many=True,
            context={'request': request, 'liked_ids': liked_ids}
        )
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = TweetCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tweet = serializer.save(
            id=uuid.uuid4(),
            user_id=request.user.user_id
        )
        return Response(TweetSerializer(tweet, context={'request': request}).data, status=status.HTTP_201_CREATED)


class MyTweetsView(APIView):
    """GET /api/tweets/me — current user's tweets"""
    permission_classes = [IsAuthenticated]
    pagination_class = TweetPagination

    def get(self, request):
        tweets_qs = Tweet.objects.filter(user_id=request.user.user_id).order_by('-created_at')
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(tweets_qs, request)

        tweet_ids = [str(t.id) for t in page]
        liked_ids = set(
            str(like.tweet_id)
            for like in Like.objects.filter(
                user_id=request.user.user_id,
                tweet_id__in=tweet_ids
            )
        )

        serializer = TweetSerializer(
            page,
            many=True,
            context={'request': request, 'liked_ids': liked_ids}
        )
        return paginator.get_paginated_response(serializer.data)


class LikeTweetView(APIView):
    """POST /api/tweets/{id}/like — toggle like"""
    permission_classes = [IsAuthenticated]

    def post(self, request, tweet_id):
        tweet = get_object_or_404(Tweet, id=tweet_id)
        user_id = request.user.user_id

        with transaction.atomic():
            like = Like.objects.filter(user_id=user_id, tweet=tweet).first()
            if like:
                # Unlike
                like.delete()
                Tweet.objects.filter(id=tweet.id).update(
                    like_count=max(tweet.like_count - 1, 0)
                )
                tweet.refresh_from_db()
                return Response({'liked': False, 'like_count': tweet.like_count})
            else:
                # Like
                try:
                    Like.objects.create(id=uuid.uuid4(), user_id=user_id, tweet=tweet)
                    Tweet.objects.filter(id=tweet.id).update(like_count=tweet.like_count + 1)
                    tweet.refresh_from_db()
                    return Response({'liked': True, 'like_count': tweet.like_count})
                except IntegrityError:
                    # Race condition: already liked
                    tweet.refresh_from_db()
                    return Response({'liked': True, 'like_count': tweet.like_count})


class CommentListCreateView(APIView):
    """
    GET  /api/tweets/{id}/comments — paginated comments
    POST /api/tweets/{id}/comments — add comment
    """
    permission_classes = [IsAuthenticated]
    pagination_class = TweetPagination

    def get(self, request, tweet_id):
        tweet = get_object_or_404(Tweet, id=tweet_id)
        comments_qs = Comment.objects.filter(tweet=tweet).order_by('-created_at')

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(comments_qs, request)
        serializer = CommentSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, tweet_id):
        tweet = get_object_or_404(Tweet, id=tweet_id)
        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            comment = serializer.save(
                id=uuid.uuid4(),
                tweet=tweet,
                user_id=request.user.user_id
            )
            Tweet.objects.filter(id=tweet.id).update(comment_count=tweet.comment_count + 1)

        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)
