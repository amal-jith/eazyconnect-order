import email

from django.contrib.auth.models import User
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import MonthlyPlan, YearlyPlan, OneTimePlan, HomePlan, Product, Order, AccountInfo
import json
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.utils.crypto import get_random_string

# Create your views here.

def home(request):

    monthly_plans = MonthlyPlan.objects.filter(is_active=True)
    yearly_voice_plans = YearlyPlan.objects.filter(is_active=True, category="voice")
    yearly_safety_1yr = YearlyPlan.objects.filter(is_active=True, category="safety", duration=1)
    yearly_safety_2yr = YearlyPlan.objects.filter(is_active=True, category="safety", duration=2)
    onetime_plans = OneTimePlan.objects.filter(is_active=True)
    home_plans = HomePlan.objects.filter(is_active=True)
    products = Product.objects.filter(is_available=True)

    context = {
        "monthly_plans": monthly_plans,
        "yearly_voice_plans": yearly_voice_plans,
        "yearly_safety_1yr": yearly_safety_1yr,
        "yearly_safety_2yr": yearly_safety_2yr,
        "onetime_plans": onetime_plans,
        "home_plans": home_plans,
        "products": products,
    }

    return render(request, "home.html", context)


@csrf_exempt
def save_step1(request):
    if request.method == "POST":
        print("POST data:", request.POST)
        usage_type = request.POST.get("usage_type")
        city = request.POST.get("city")
        postal_code = request.POST.get("postal_code")

        request.session['step1'] = {
            "usage_type": usage_type,
            "city": city,
            "postal_code": postal_code
        }
        print("Session step1 data:", request.session['step1'])
        return JsonResponse({"status": "ok", "data": request.session['step1']})
    return JsonResponse({"error": "Invalid method"}, status=400)


def save_step2(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            selected_plans = data.get("selectedPlans", [])
            selected_devices = data.get("selectedDevices", [])
            total_users = data.get("totalUsers", 0)

            order_id = request.session.get("order_id")
            try:
                order = Order.objects.get(id=order_id)
            except (Order.DoesNotExist, TypeError):
                order = Order()

            order.selected_plans = selected_plans
            order.selected_devices = selected_devices
            order.total_users = total_users
            order.save()

            print("Received Step 2 data:")
            print("Selected Plans:", selected_plans)
            print("Selected Devices:", selected_devices)
            print("Total Users:", total_users)

            request.session["order_id"] = order.id

            return JsonResponse({
                "status": "success",
                "message": "Step 2 data saved successfully",
                "order_id": order.id,
                "selected_plans": selected_plans,
                "selected_devices": selected_devices,
                "total_users": total_users
            })

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)

@csrf_exempt
def save_step3(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
        print("Received step 3 data:", data)

        required_keys = [
            "port_numbers_enabled",
            "port_numbers",
            "need_phone_numbers",
            "need_toll_free_numbers",
            "city",
            "area_code",
        ]

        # Log each key to catch silent errors
        for key in required_keys:
            if key not in data:
                print(f"[Missing Key]: {key}")
                return JsonResponse({"error": f"Missing key: {key}"}, status=400)
            elif data[key] in [None, ""]:
                print(f"[Empty Value]: {key} = {data[key]}")
                return JsonResponse({"error": f"Empty value for key: {key}"}, status=400)
            else:
                print(f"[OK] {key}: {data[key]}")

        request.session['step3'] = data
        print("Session step3 data:", request.session['step3'])

        return JsonResponse({"status": "ok", "data": request.session['step3']})

    except json.JSONDecodeError:
        print("Invalid JSON")
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        print("Unexpected error:", e)
        return JsonResponse({"error": str(e)}, status=500)


# @csrf_exempt
# def save_step3(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             print("Received step 3 data:", data)
#             request.session['step3'] = data
#             print("Session step3 data:", request.session['step3'])
#             return JsonResponse({"status": "ok", "data": request.session['step3']})
#         except Exception as e:
#             print("Error:", e)
#             return JsonResponse({"error": "Invalid data"}, status=400)
#     return JsonResponse({"error": "Invalid method"}, status=400)

@csrf_exempt
def save_step4(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        installation_type = request.POST.get("installation_type", "").strip()
        if not installation_type:
            return JsonResponse({"error": "No installation type provided"}, status=400)

        # Save to session
        request.session['step4'] = {"installation_type": installation_type}
        print("Session step4 data:", request.session['step4'])

        return JsonResponse({"status": "ok"})
    except Exception as e:
        print("Unexpected error:", e)
        return JsonResponse({"error": str(e)}, status=500)

# @csrf_exempt
# def save_step4(request):
#     if request.method == "POST":
#         installation_type = request.POST.get("installation_type")
#
#         request.session['step4'] = {
#             "installation_type": installation_type
#         }
#
#         print("Step 4 Saved:", request.session['step4'])
#
#         return JsonResponse({"status": "ok", "data": request.session['step4']})
#     return JsonResponse({"error": "Invalid method"}, status=400)


@csrf_exempt
def save_step5(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")  # will be used later
        street = request.POST.get("street")
        unit = request.POST.get("unit")
        city = request.POST.get("city")
        zipcode = request.POST.get("zipcode")
        province = request.POST.get("province")
        country = request.POST.get("country")
        contact_person = request.POST.get("contactPerson")
        contact_phone = request.POST.get("contactPhone")

        otp = get_random_string(length=4, allowed_chars='0123456789')

        # Save only password + OTP in session
        request.session['signup_data'] = {
            "email": email,
            "password": password,
            "otp": otp
        }
        request.session.save()

        # Save other account details directly to DB
        try:
            AccountInfo.objects.update_or_create(
                email=email,
                defaults={
                    "street": street,
                    "unit": unit,
                    "city": city,
                    "zipcode": zipcode,
                    "province": province,
                    "country": country,
                    "contact_person": contact_person,
                    "contact_phone": contact_phone,
                }
            )
        except Exception as e:
            return JsonResponse({"status": "error", "message": f"Failed to save data: {str(e)}"})

        # Send OTP to email
        try:
            send_mail(
                subject='Your OTP Code',
                message=f'Your OTP is {otp}',
                from_email='no-reply@eazyconnect.com',
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            return JsonResponse({"status": "error", "message": f"Failed to send OTP: {str(e)}"})

        return JsonResponse({"status": "otp_sent"})

    return JsonResponse({"error": "Invalid method"}, status=400)


@csrf_exempt
def save_step52(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            entered_otp = data.get("otp")

            signup_data = request.session.get("signup_data")

            if not signup_data:
                return JsonResponse({
                    "status": "error",
                    "message": "Session expired. Please sign up again."
                })

            # Check OTP
            session_otp = signup_data.get("otp")
            if entered_otp != session_otp:
                return JsonResponse({
                    "status": "error",
                    "message": "Invalid OTP"
                })

            email = signup_data.get("email")
            password = signup_data.get("password")

            # Check if user already exists
            if User.objects.filter(username=email).exists():
                return JsonResponse({
                    "status": "error",
                    "message": "User already exists. Please login."
                })

            # Create new user
            user = User.objects.create_user(username=email, email=email, password=password)

            # ✅ Save account info to step5 for order submission (excluding OTP)
            step5_data = {k: v for k, v in signup_data.items() if k != "otp"}
            request.session["step5"] = step5_data
            request.session.modified = True
            print("✅ Saved step5 data to session:", step5_data)

            request.session["logged_in_email"] = email

            request.session.modified = True



            return JsonResponse({
                "status": "success",
                "message": "Account created successfully. Redirecting to login...",
                "redirect_url": "/login/"  # or your intended redirect
            })

        except Exception as e:
            print("Error in save_step52:", e)
            return JsonResponse({
                "status": "error",
                "message": "Internal server error."
            })

    return JsonResponse({"error": "Invalid method"}, status=400)




@csrf_exempt
def save_step51(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Invalid email or password."})

        user = authenticate(request, username=user.username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"status": "success"})
        else:
            return JsonResponse({"status": "error", "message": "Invalid email or password."})

    return JsonResponse({"status": "error", "message": "Invalid request method."})



@csrf_exempt
def submit_order(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("Received data:", data)  # Debug: Log posted data

            # Step 1 data
            usage_type = data.get("usageType")
            city = data.get("city")
            postal_code = data.get("postalCode")
            promo_code = data.get("promoCode")

            # Step 2
            selected_plans = data.get("selectedPlans", [])
            user_allocation = data.get("userAllocation", {})

            # Step 3: get from session, not from posted data
            step3_data = request.session.get("step3", {})
            print("Step 3 data from session:", step3_data)

            porting_enabled = step3_data.get("port_numbers_enabled", False)
            port_numbers = step3_data.get("port_numbers", [])
            need_phone_numbers = step3_data.get("need_phone_numbers", False)
            need_toll_free_numbers = step3_data.get("need_toll_free_numbers", False)
            city_step3 = step3_data.get("city")
            area_code = step3_data.get("area_code")

            # Step 4
            step4_data = request.session.get("step4") or {}
            installation_type = step4_data.get("installation_type")

            # Step 5 (from session)
            account_info = request.session.get("signup_data") or {}  # <-- change here
            print("Account info from session:", account_info)
            print("Session key on submit_order:", request.session.session_key)
            print("Account info from session:", request.session.get("signup_data"))

            # Step 6
            selected_devices = data.get("selectedDevices", [])
            estimated_total = data.get("estimatedTotal")

            # Optional email from account_info if present
            email = request.session.get("logged_in_email") or account_info.get("email")

            # Create Order
            order = Order.objects.create(
                usage_type=usage_type,
                city=city,  # prefer city from step3
                postal_code=postal_code,
                selected_plans=selected_plans,
                user_allocation=user_allocation,
                porting_enabled=porting_enabled,
                port_numbers=port_numbers,
                need_phone_numbers=need_phone_numbers,
                need_toll_free_numbers=need_toll_free_numbers,
                area_code=area_code,
                installation_type=installation_type,
                account_info=account_info,
                selected_devices=selected_devices,
                estimated_total=estimated_total,
                email=email,
            )

            return JsonResponse({"status": "success", "order_id": order.id})

        except Exception as e:
            print("Submit order error:", e)
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid method"}, status=405)




# @csrf_exempt
# def submit_order(request):
#     if request.method == "POST":
#         step1 = request.session.get('step1')
#         step2 = request.session.get('step2')
#
#         if not step1 or not step2:
#             return JsonResponse({"status": "error", "message": "Incomplete session data"})
#
#         order = Order.objects.create(
#             usage_type=step1['usage_type'],
#             city=step1['city'],
#             postal_code=step1['postal_code'],
#             selected_plans=step2  # 💾 Store entire list of plans directly
#         )
#
#         # Clear session data
#         request.session.pop('step1', None)
#         request.session.pop('step2', None)
#
#         return JsonResponse({"status": "success", "order_id": order.id})
#
#     return JsonResponse({"error": "Invalid method"}, status=400)
