from django.contrib import admin
from .models import MyUser, Post, Comment, Notification
from django.utils.html import format_html

# Register your models here.

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'description_preview', 'has_image_display', 'created_at']
    list_filter = ['created_at', 'user']
    search_fields = ['description', 'user__username']
    
    def description_preview(self, obj):
        return obj.description[:50] + '...' if len(obj.description) > 50 else obj.description
    description_preview.short_description = 'Description'
    
    def has_image_display(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 5px;" />', obj.image.url)
        return "No Image"
    has_image_display.short_description = 'Image'

admin.site.register(MyUser)
admin.site.register(Comment)
admin.site.register(Notification)