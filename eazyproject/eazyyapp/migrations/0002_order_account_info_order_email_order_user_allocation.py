# Generated by Django 4.2 on 2025-06-03 13:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eazyyapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='account_info',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='user_allocation',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
