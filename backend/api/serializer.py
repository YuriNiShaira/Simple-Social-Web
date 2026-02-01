from rest_framework import serializers
from .models import MyUser, Post, Comment, Notification

class UserRegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only = True)

    class Meta:
        model = MyUser
        fields = ['username', 'email', 'first_name' , 'last_name', 'password']

    def create(self, validated_data):
        user = MyUser(
            username = validated_data['username'],
            email = validated_data['email'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

        

class MyUserProfileSerializer(serializers.ModelSerializer):

    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = MyUser
        fields = ['username', 'bio', 'email', 'profile_image','first_name', 'last_name', 'followers_count', 'following_count']

    def get_followers_count(self, obj):
        return obj.followers.count()
    
    def get_following_count(self, obj):
        return obj.following.count()

class PostSerializer(serializers.ModelSerializer):

    username = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    formatted_date = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    has_image = serializers.SerializerMethodField()


    class Meta:
        model = Post
        fields = [ 'id', 'username', 'description', 'formatted_date', 'likes', 'like_count', 'image_url', 'has_image',]

    def get_username(self, obj):
        return obj.user.username
    
    def get_like_count(self, obj):
        return obj.likes.count()
    
    def get_formatted_date(self, obj):
        return obj.created_at.strftime('%d %b %y')
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                # Get base URL without /api/ duplication
                base_url = request.build_absolute_uri('/')
                # Remove trailing slash if exists
                base_url = base_url.rstrip('/')
                # Build correct URL
                return f"{base_url}{obj.image.url}"
            return obj.image.url
        return None
    
    def get_has_image(self, obj):
        return bool(obj.image)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username', 'bio', 'email', 'profile_image', 'first_name', 'last_name'] 

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_profile_image = serializers.CharField(source='user.profile_image', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'username', 'user_profile_image', 'text', 'created_at']
        read_only_fields = ['user', 'created_at']

class NotificationSerializer(serializers.ModelSerializer):
    from_username = serializers.CharField(source='from_user.username', read_only=True)
    from_user_profile = serializers.CharField(source='from_user.profile_image', read_only=True)
    post_id = serializers.IntegerField(source='post.id', read_only=True, allow_null=True)

    class Meta:
        model = Notification
        fields = ['id', 'from_username', 'from_user_profile', 'notification_type','post_id', 'is_read', 'created_at']
        read_only_fields = ['is_read', 'created_at']