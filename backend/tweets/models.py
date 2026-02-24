import uuid
from django.db import models


class Tweet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField(db_index=True)
    content = models.TextField(max_length=280)
    like_count = models.PositiveIntegerField(default=0)
    comment_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'tweets'
        ordering = ['-created_at']

    def __str__(self):
        return f'Tweet({self.id}) by {self.user_id}'


class Like(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField(db_index=True)
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, related_name='likes', db_index=True)

    class Meta:
        db_table = 'likes'
        unique_together = [('user_id', 'tweet')]

    def __str__(self):
        return f'Like by {self.user_id} on {self.tweet_id}'


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, related_name='comments', db_index=True)
    user_id = models.UUIDField(db_index=True)
    content = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'comments'
        ordering = ['-created_at']

    def __str__(self):
        return f'Comment({self.id}) by {self.user_id}'
