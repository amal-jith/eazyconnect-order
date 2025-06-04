from django.contrib import admin
from .models import MonthlyPlan, YearlyPlan, OneTimePlan, HomePlan, Product, Order, AccountInfo

# Register your models here.


@admin.register(MonthlyPlan)
class MonthlyPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'monthly_price', 'yearly_price', 'is_active', 'id')
    search_fields = ('name',)


@admin.register(YearlyPlan)
class YearlyPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'category',  'monthly_equivalent_price','yearly_price', 'is_active', 'yearly_id')
    list_filter = ('category', 'is_active')
    search_fields = ('name',)
    ordering = ('category', 'name')

@admin.register(OneTimePlan)
class OneTimePlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'yearly_price', 'is_active', 'onetime_id')
    search_fields = ('name',)

@admin.register(HomePlan)
class HomePlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'monthly_price', 'yearly_price', 'is_active', 'id')
    search_fields = ('name',)

admin.site.register(Product)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'usage_type', 'city', 'postal_code', 'created_at', 'total_users', 'selected_plans', 'selected_devices')  # customize columns you want to show
    search_fields = ('usage_type', 'city', 'postal_code')  # optional, add search box
    list_filter = ('created_at',)  # optional, add filter sidebar for date



@admin.register(AccountInfo)
class AccountInfoAdmin(admin.ModelAdmin):
    list_display = (
        "email",
        "contact_person",
        "contact_phone",
        "city",
        "province",
        "country",
        "created_at"
    )
    search_fields = ("email", "contact_person", "city", "province", "zipcode")