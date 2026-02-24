from rest_framework import serializers
from .models import Tweet, Comment


class TweetSerializer(serializers.ModelSerializer):
    user_liked = serializers.SerializerMethodField()

    class Meta:
        model = Tweet
        fields = ['id', 'user_id', 'content', 'like_count', 'comment_count', 'created_at', 'user_liked']
        read_only_fields = ['id', 'user_id', 'like_count', 'comment_count', 'created_at', 'user_liked']

    def get_user_liked(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        # liked_ids is pre-fetched set passed via context for efficiency
        liked_ids = self.context.get('liked_ids', set())
        return str(obj.id) in liked_ids


class TweetCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = ['content']

    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError('Content cannot be empty.')
        return value


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'tweet_id', 'user_id', 'content', 'created_at']
        read_only_fields = ['id', 'tweet_id', 'user_id', 'created_at']

    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError('Comment cannot be empty.')
        return value
