import uuid
from django.db import models

# Create your models here.
class MonthlyPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    monthly_price = models.DecimalField(max_digits=6, decimal_places=2)
    yearly_price = models.DecimalField(max_digits=8, decimal_places=2)
    feature_1 = models.CharField(max_length=255)
    feature_2 = models.CharField(max_length=255)
    feature_3 = models.CharField(max_length=255)
    feature_4 = models.CharField(max_length=255)
    feature_5 = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class YearlyPlan(models.Model):
    PLAN_CATEGORIES = [
        ('voice', 'Business Voice'),
        ('safety', 'Business Safety'),
    ]

    DURATION_CHOICES = [
        (1, '1 Year'),
        (2, '2 Years'),
    ]

    yearly_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    yearly_price = models.DecimalField(max_digits=8, decimal_places=2)
    monthly_equivalent_price = models.DecimalField(max_digits=8, decimal_places=2)

    feature_1 = models.CharField(max_length=255)
    feature_2 = models.CharField(max_length=255)
    feature_3 = models.CharField(max_length=255)
    feature_4 = models.CharField(max_length=255)
    feature_5 = models.CharField(max_length=255)

    category = models.CharField(max_length=10, choices=PLAN_CATEGORIES)  # voice or safety
    duration = models.IntegerField(choices=DURATION_CHOICES, default=1)  # 1 or 2 years
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

class OneTimePlan(models.Model):

    onetime_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    yearly_price = models.DecimalField(max_digits=8, decimal_places=2)

    feature_1 = models.CharField(max_length=255)
    feature_2 = models.CharField(max_length=255)
    feature_3 = models.CharField(max_length=255)
    feature_4 = models.CharField(max_length=255)
    feature_5 = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)


    def __str__(self):
        return f"{self.name} (One-Time Plan)"

class HomePlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    monthly_price = models.DecimalField(max_digits=6, decimal_places=2)
    yearly_price = models.DecimalField(max_digits=8, decimal_places=2)
    feature_1 = models.CharField(max_length=255)
    feature_2 = models.CharField(max_length=255)
    feature_3 = models.CharField(max_length=255)
    feature_4 = models.CharField(max_length=255)
    feature_5 = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    phone_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    is_available = models.BooleanField(default=True)  # Only availability status

    def __str__(self):
        return self.name



class Order(models.Model):
    usage_type = models.CharField(max_length=50, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    selected_plans = models.JSONField(null=True, blank=True)

    total_users = models.IntegerField(default=0)

    selected_devices = models.JSONField(null=True, blank=True)

    estimated_total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # New fields added here
    porting_enabled = models.BooleanField(default=False)
    port_numbers = models.TextField(blank=True, null=True)  # comma separated phone numbers

    need_phone_numbers = models.BooleanField(default=False)
    need_toll_free_numbers = models.BooleanField(default=False)

    area_code = models.CharField(max_length=20, blank=True, null=True)

    # Example extra fields you mentioned
    installation_type = models.CharField(max_length=100, blank=True, null=True)
    terms_accepted = models.BooleanField(default=False)

    # ✅ Add missing fields
    user_allocation = models.JSONField(null=True, blank=True)
    account_info = models.JSONField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)



    def __str__(self):
        return f"Order #{self.id}  - {self.city}"


class AccountInfo(models.Model):
    email = models.EmailField(unique=True)
    street = models.CharField(max_length=255, blank=True)
    unit = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=20)
    province = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    contact_person = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email