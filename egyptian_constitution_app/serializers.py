from rest_framework import serializers

from egyptian_constitution_app.models import User


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        error_messages={'blank': 'Please enter your username.'},
        required=True,
    )
    password = serializers.CharField(
        error_messages={'blank': 'Please enter your password.'},
        required=True,
        write_only=True
    )

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('user_id', 'first_name', 'last_name', 'phone_number',
                  'created_at', 'updated_at', 'email', 'age', 'username', 'password')


    def create(self, validated_data):

        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user








