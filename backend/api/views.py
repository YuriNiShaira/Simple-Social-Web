from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
# Create your views here.
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from .models import MyUser, Post, Comment, Notification
from .serializer import MyUserProfileSerializer, UserRegisterSerializer, PostSerializer, UserSerializer, CommentSerializer, NotificationSerializer

def create_notification(user, from_user, notification_type, post=None, comment=None):
    """
    Helper function to create notifications
    Called from other views (like, comment, follow)
    """
    Notification.objects.create(
        user=user,
        from_user=from_user,
        notification_type=notification_type,
        post=post,
        comment=comment
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def authenticated(request):
    return Response('Authenticated✅')

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data


            access_token = tokens['access']
            refresh_token = tokens['refresh']
            username = request.data['username']

            try:
                user = MyUser.objects.get(username=username)
            except MyUser.DoesNotExist:
                return Response({'error': "User does not exist"})


            res = Response()
            res.data = {"success": True,
                        "user":{
                            "username":user.username,
                            "bio":user.bio,
                            "email":user.email,
                            "first_name":user.first_name,
                            "last_name":user.last_name
                            }
                        }


            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )


            res.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )


            return res
        except:
            return Response({'success': False})
        
class CustomTokenRefreshView(TokenRefreshView):
    def post(user, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']

            res=Response()

            res.data = {'success': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
            )

            return res

        except:
            return Response({'success': False})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile_data(request, pk):
    try:
        try:
            user = MyUser.objects.get(username = pk)
        except MyUser.DoesNotExist:
            return Response({'error' : 'user does not exist'})
        
        
        serializer = MyUserProfileSerializer(user, many = False)
        #check if the current login is our profile if the user is our profile change the editbutton to following 
        following = False

        if request.user in user.followers.all():
            following = True

        return Response({**serializer.data, 'is_our_profile': request.user.username == user.username, 'following':following})
    except:
        return Response({'error':'error getting user data'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggleFollow(request):
    try:
        try:
            my_user = MyUser.objects.get(username=request.user.username)
            user_to_follow = MyUser.objects.get(username=request.data['username'])
        except MyUser.DoesNotExist:
            return Response({'error':'users does not exist'})
        
        if my_user in user_to_follow.followers.all():
            user_to_follow.followers.remove(my_user)
            return Response({'now_following':False})
        else:
            user_to_follow.followers.add(my_user)
            
            # ✅ CREATE NOTIFICATION FOR FOLLOW
            create_notification(
                user=user_to_follow,     # Person being followed
                from_user=my_user,       # Person who followed
                notification_type='follow'
                # No post/comment for follow notifications
            )
            
            return Response({'now_following':True})
    except:
        return Response({'error':'error following user'})
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_posts(request, pk):
    try:
        user = MyUser.objects.get(username = request.user.username)
    except MyUser.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
    posts = user.posts.all().order_by('-created_at')

    serializer = PostSerializer(posts, many = True, context = {'request': request})

    data = []
    for post in serializer.data:
        new_post = {}
            
        if user.username in post['likes']:
            new_post = {**post, 'liked':True}
        else:
            new_post = {**post, 'liked': False}
        data.append(new_post)
        
    return Response(data)
                                 


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggleLike(request):
    try:
        try:
            post = Post.objects.get(id = request.data['id'])
        except Post.DoesNotExist:
            return Response({'error':'post does not exist'})
        
        try:
            user = MyUser.objects.get(username = request.user.username)
        except MyUser.DoesNotExist:
            return Response({'error': 'User does not exist'})
        
        if user in post.likes.all():
            post.likes.remove(user)
            return Response({'now_liked': False})
        else:
            post.likes.add(user)
            
            # ✅ CREATE NOTIFICATION FOR LIKE
            if post.user != user:  # Don't notify yourself
                create_notification(
                    user=post.user,          # Post owner gets notified
                    from_user=user,          # Person who liked
                    notification_type='like',
                    post=post
                )
            
            return Response({'now_liked': True})
    except:
        return Response({'error':'failed to like post'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    try:
        try:
            user = MyUser.objects.get(username=request.user.username)
        except MyUser.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        description = request.data.get('description', '')
        image = request.FILES.get('image')

        if not description.strip():
            return Response({'error': 'Description is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        post = Post.objects.create(user = user, description=description.strip())

        if image:
            if image.size > 5 * 1024 * 1024:  # 5MB in bytes
                return Response({'error': 'Image size should be less than 5MB'}, status=status.HTTP_400_BAD_REQUEST)
            
            allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
            file_extention = image.name.split('.')[-1].lower()

            if file_extention not in allowed_extensions:
                return Response({'error': f'File type not allowed. Allowed: {", ".join(allowed_extensions)}'}, status=status.HTTP_400_BAD_REQUEST)
            
            post.image = image
            post.save()

        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Error creating post:{str(e)}")
        return Response({'error': 'Failed to create post'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_post(request):
    try:
        my_user = MyUser.objects.get(username=request.user.username)
    except MyUser.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    posts = Post.objects.all().order_by('-created_at')
    serializer = PostSerializer(posts, many = True, context={'request':request})

    data = []
    for post in serializer.data:
        new_post = {}

        if my_user.username in post['likes']:
            new_post = {**post, 'liked': True}
        else:
            new_post = {**post, 'liked': False}
        data.append(new_post)

    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_user(request):
    query = request.query_params.get('query', '')
    users = MyUser.objects.filter(username__icontains = query)
    serializer = UserSerializer(users, many= True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_details(request):

    data = request.data
    try:
        user = MyUser.objects.get(username = request.user.username)
    except MyUser.DoesNotExist:
        return Response({'error':'User does not exist'})
    
    serializer = UserSerializer(user, data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({**serializer.data, "success":True})
    
    return Response({**serializer.errors, "success": False})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        res = Response()
        res.data = {"success": True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    except:
        return Response({"success":False})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request):
    try:
        try:
            post = Post.objects.get(id=request.data['post_id'])
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=404)
        
        comment = Comment.objects.create(
            post=post,
            user=request.user,
            text=request.data['text']
        )
        
        # ✅ CREATE NOTIFICATION FOR COMMENT
        if post.user != request.user:  # Don't notify yourself
            create_notification(
                user=post.user,          # Post owner gets notified
                from_user=request.user,  # Person who commented
                notification_type='comment',
                post=post,
                comment=comment
            )
        
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=201)
        
    except:
        return Response({'error': 'Failed to create comment'}, status=400)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_comments(request, post_id):
    try:
        comments = Comment.objects.filter(post_id=post_id).order_by('-created_at')

        serializer = CommentSerializer(comments, many=True)

        return Response(serializer.data)
    except:
        return Response({'error':'Failed to get comment'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    try:
        # Get notifications for logged in user, newest first
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
        
    except:
        return Response({'error': 'Failed to get notifications'}, status=400)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        
        notification.is_read = True
        notification.save()
        
        return Response({'success': True})
        
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=404)
    except:
        return Response({'error': 'Failed to mark as read'}, status=400)