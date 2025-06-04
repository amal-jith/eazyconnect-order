

document.addEventListener("DOMContentLoaded", function () {
  // Plan toggle buttons
  const monthlyBtn = document.getElementById("monthlyBtn");
  const yearlyBtn = document.getElementById("yearlyBtn");
  const onetimeBtn = document.getElementById("onetimeBtn");

  const monthlyPlans = document.getElementById("monthlyPlans");
  const yearlyPlans = document.getElementById("yearlyPlans");
  const onetimePlans = document.getElementById("onetimePlans");

  function setActiveButton(activeBtn) {
    [monthlyBtn, yearlyBtn, onetimeBtn].forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  function showPlans(planToShow) {
    [monthlyPlans, yearlyPlans, onetimePlans].forEach(plan => plan.style.display = "none");
    planToShow.style.display = "block";
  }

  monthlyBtn?.addEventListener("click", function () {
    setActiveButton(monthlyBtn);
    showPlans(monthlyPlans);
  });

  yearlyBtn?.addEventListener("click", function () {
    setActiveButton(yearlyBtn);
    showPlans(yearlyPlans);
  });

  onetimeBtn?.addEventListener("click", function () {
    setActiveButton(onetimeBtn);
    showPlans(onetimePlans);
  });

  const seePlansBtn = document.querySelector(".see-plans");
  const homePlans = document.getElementById("homePlans");

  if (seePlansBtn && homePlans) {
    seePlansBtn.addEventListener("click", function () {
      homePlans.style.display = "block";
      seePlansBtn.style.display = "none";
      homePlans.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ✅ Plan Selection Logic
  let selectedPlans = [];

  function updateConsoleLog() {
    console.clear();
    console.log("Selected Plans:");
    selectedPlans.forEach((plan, index) => {
      console.log(`Plan ${index + 1}:`);
      console.log("  Name:", plan.name);
      console.log("  ID:", plan.planId);
      console.log("  Category:", plan.category);
      console.log("  Price:", plan.price);
      console.log("  Action:", plan.action);
    });
  }

  function updateHiddenInput() {
    const hiddenField = document.getElementById("selectedPlansData");
    if (hiddenField) {
      hiddenField.value = JSON.stringify(selectedPlans);
    }
  }

  const priceRangeElements = document.querySelectorAll(".price-range");

    function updateEstimatedPrice() {
  let totalPrice = 0;

  const plan1Input = document.getElementById("selectPlan1Users");
  const plan2Input = document.getElementById("selectPlan2Users");

  selectedPlans.forEach((plan, index) => {
    const pricePerUser = parseFloat(plan.price?.replace(/[^0-9.]/g, '')) || 0;
    let users = 0;

    if (index === 0 && plan1Input) {
      users = parseInt(plan1Input.value) || 0;
    } else if (index === 1 && plan2Input) {
      users = parseInt(plan2Input.value) || 0;
    }

    totalPrice += users * pricePerUser;
  });

  const totalDevicePrice = getTotalDevicePrice();

  const combinedTotal = totalPrice + totalDevicePrice;

  priceRangeElements.forEach((el, i) => {
    el.innerText = `$${combinedTotal.toFixed(2)}`;
    console.log(`Updated .price-range[${i}] to $${combinedTotal.toFixed(2)}`);
  });
}



  function logUserAllocation() {
  //console.clear();//

  const totalUsersInput = document.getElementById("numberOfUsers");
  const plan1Input = document.getElementById("selectPlan1Users");
  const plan2Input = document.getElementById("selectPlan2Users");

  console.log("🧮 User Allocation Summary:");
  console.log("  ➤ Total Users:", totalUsersInput?.value || 0);

  if (selectedPlans.length >= 1) {
    console.log(`  📦 ${selectedPlans[0].name}: ${plan1Input?.value || 0} users`);
  }
  if (selectedPlans.length === 2) {
    console.log(`  📦 ${selectedPlans[1].name}: ${plan2Input?.value || 0} users`);
  }
}



function updateChooseSection() {
  const plan1Select = document.querySelector('[aria-label="selectPlan1"]');
  const plan2Row = document.querySelector('.section-5 .row.mb-4:nth-child(3)');
  const plan2Select = document.querySelector('[aria-label="selectPlan2"]');
  const plan1Input = document.getElementById("selectPlan1Users");
  const plan2Input = document.getElementById("selectPlan2Users");
  const totalUsersInput = document.getElementById("numberOfUsers");

  // Reset and populate dropdowns
  if (selectedPlans.length >= 1) {
    plan1Select.innerHTML = `<option selected>${selectedPlans[0].name}</option>`;

    // Auto-fill plan1 input with total users if only one plan selected
    if (selectedPlans.length === 1) {
      plan1Input.value = totalUsersInput.value || "";
    } else {
      plan1Input.value = "";
    }
  }

  if (selectedPlans.length === 2) {
    plan2Row.style.display = "flex";
    plan2Select.innerHTML = `<option selected>${selectedPlans[1].name}</option>`;
    plan2Input.value = "";
  } else {
    plan2Row.style.display = "none";
    plan2Input.value = "";
  }

  // Replace inputs to remove existing listeners
  const newPlan1Input = plan1Input.cloneNode(true);
  plan1Input.parentNode.replaceChild(newPlan1Input, plan1Input);

  const newTotalUsersInput = totalUsersInput.cloneNode(true);
  totalUsersInput.parentNode.replaceChild(newTotalUsersInput, totalUsersInput);

  const newPlan2Input = plan2Input.cloneNode(true);
  plan2Input.parentNode.replaceChild(newPlan2Input, plan2Input);

  // Event listener on plan1 input
  newPlan1Input.addEventListener("input", () => {
    const total = parseInt(newTotalUsersInput.value);
    let plan1Users = parseInt(newPlan1Input.value);

    if (!isNaN(total) && !isNaN(plan1Users)) {
      const remaining = total - plan1Users;

      if (selectedPlans.length === 2) {
        if (remaining <= 0) {
          // Alert in real time if invalid allocation
          alert("You must allocate at least 1 user to each plan.");

          // Adjust values to enforce at least 1 user per plan
          plan1Users = total - 1;
          newPlan1Input.value = plan1Users;
          newPlan2Input.value = 1;
        } else {
          newPlan2Input.value = remaining;
        }
        updateEstimatedPrice();
        logUserAllocation();
      } else {
        updateEstimatedPrice();
        logUserAllocation();
      }
    }
  });

  // Event listener on total users input
  newTotalUsersInput.addEventListener("input", () => {
    if (selectedPlans.length === 1) {
      // Auto-fill plan1 input with total users
      newPlan1Input.value = newTotalUsersInput.value || "";
      newPlan2Input.value = "";
    } else {
      newPlan1Input.value = "";
      newPlan2Input.value = "";
    }
    updateEstimatedPrice();
    logUserAllocation();
    updateDeviceLimitText();
  });

  // Event listener on plan2 input
  newPlan2Input.addEventListener("input", () => {
    updateEstimatedPrice();
    logUserAllocation();
  });
}
function storeUserAllocation(totalUsers, plan1Users, plan2Users) {
  sessionStorage.setItem("userAllocation", JSON.stringify({
    totalUsers,
    plan1Users,
    plan2Users
  }));
}




  function addOrRemovePlan(planId, name, price, category, action, card) {
    const index = selectedPlans.findIndex(p => p.planId === planId && p.action === action);

    if (index !== -1) {
      selectedPlans.splice(index, 1);
      card.classList.remove("selected");
    } else {
      if (selectedPlans.length >= 2) {
        alert("You can only select up to 2 plans.");
        return;
      }

      selectedPlans.push({
        planId: planId,
        name: name,
        price: price,
        category: category,
        action: action
      });

      card.classList.add("selected");
    }

    updateConsoleLog();
    updateHiddenInput();
    updateEstimatedPrice();
    updateChooseSection();
  }

function updateDeviceLimitText() {
  const totalUsersInput = document.getElementById("numberOfUsers");
  const deviceLimitText = document.getElementById("deviceLimitText");

  console.log('updateDeviceLimitText called');
  if (totalUsersInput && deviceLimitText) {
    const totalUsers = parseInt(totalUsersInput.value) || 0;
    console.log('Total users:', totalUsers);
    deviceLimitText.innerText = `You can choose ${totalUsers} device${totalUsers === 1 ? '' : 's'} from the list.`;
  } else {
    console.log('Element(s) missing:', totalUsersInput, deviceLimitText);
  }
}


    // 📦 Device Quantity Logic (For Phones)
    function getTotalSelectedDevices() {
      let total = 0;
      document.querySelectorAll(".phone-card .quantity").forEach(span => {
        total += parseInt(span.textContent);
      });
      return total;
    }

    function updateButtonsState() {
      const maxUsers = parseInt(document.getElementById("numberOfUsers")?.value) || 0;
      const selectedTotal = getTotalSelectedDevices();

      document.querySelectorAll(".phone-card").forEach(card => {
        const quantitySpan = card.querySelector(".quantity");
        const currentQty = parseInt(quantitySpan.textContent);
        const plusBtn = card.querySelector("button[onclick^='increaseQuantity']");
        const minusBtn = card.querySelector("button[onclick^='decreaseQuantity']");

        // Disable "+" if limit reached
        if (plusBtn) {
          plusBtn.disabled = selectedTotal >= maxUsers;
        }

        // Disable "-" if quantity is 0
        if (minusBtn) {
          minusBtn.disabled = currentQty <= 0;
        }
      });
    }


    // ✅ Attach these functions to global window scope
    window.increaseQuantity = function (button) {
      const card = button.closest(".phone-card");
      const quantitySpan = card?.querySelector(".quantity");
      const maxUsers = parseInt(document.getElementById("numberOfUsers")?.value) || 0;
      const currentTotal = getTotalSelectedDevices();

      if (quantitySpan && currentTotal < maxUsers) {
        let qty = parseInt(quantitySpan.textContent);
        quantitySpan.textContent = qty + 1;
      }

      updateButtonsState();
      updateDeviceLimitText(); // ✅ Add this
      getSelectedPhones();
      logTotalDevicePrice();
      updateEstimatedPrice();
    };

    window.decreaseQuantity = function (button) {
      const card = button.closest(".phone-card");
      const quantitySpan = card?.querySelector(".quantity");

      if (quantitySpan) {
        let qty = parseInt(quantitySpan.textContent);
        if (qty > 0) {
          quantitySpan.textContent = qty - 1;
        }
      }

      updateButtonsState();
      updateDeviceLimitText(); // ✅ Add this
      getSelectedPhones();
      logTotalDevicePrice();
      updateEstimatedPrice();
    };



    // When user count changes, reset device counts
    const numberOfUsersInput = document.getElementById("numberOfUsers");
    if (numberOfUsersInput) {
      numberOfUsersInput.addEventListener("input", () => {
        document.querySelectorAll(".phone-card .quantity").forEach(span => {
          span.textContent = "0";
        });
        updateButtonsState();
        updateDeviceLimitText(); // if you're updating the text below the devices
      });
    }


    function getSelectedPhones() {
      const selectedPhones = [];

      document.querySelectorAll(".phone-card").forEach(card => {
        const quantity = parseInt(card.querySelector(".quantity")?.textContent || "0");
        if (quantity > 0) {
          selectedPhones.push({
            phone_id: card.getAttribute("data-id"),
            name: card.querySelector(".phone-title")?.innerText || "Unnamed",
            quantity: quantity,
            price: card.getAttribute("data-price")
          });
        }
      });

      //console.clear();//
      console.log("📱 Selected Phones:");
      selectedPhones.forEach(phone => {
        console.log(`  ➤ ${phone.name} (ID: ${phone.phone_id}) - Qty: ${phone.quantity}`);
      });

      // Optional: Update hidden input if exists
      const phoneHiddenInput = document.getElementById("selectedPhonesData");
      if (phoneHiddenInput) {
        phoneHiddenInput.value = JSON.stringify(selectedPhones);
      }

      return selectedPhones;
    }

    function logTotalDevicePrice() {
      let total = 0;
      document.querySelectorAll(".phone-card").forEach(card => {
        const price = parseFloat(card.getAttribute("data-price")) || 0;
        const quantity = parseInt(card.querySelector(".quantity").textContent) || 0;
        total += price * quantity;
      });
      console.log(`💰 Total Device Price: $${total.toFixed(2)}`);
    }

    function getTotalDevicePrice() {
      let total = 0;
      document.querySelectorAll(".phone-card").forEach(card => {
        const price = parseFloat(card.getAttribute("data-price")) || 0;
        const quantity = parseInt(card.querySelector(".quantity").textContent) || 0;
        total += price * quantity;
      });
      return total;
    }




    // Initial state
    updateButtonsState();




  document.querySelectorAll(".plan-card").forEach(card => {
    const planId = card.getAttribute("data-id");
    const price = card.getAttribute("data-price");
    const category = card.getAttribute("data-type");
    const name = card.querySelector(".title-10")?.innerText?.trim() || "Unnamed";

    const buyNowBtn = card.querySelector(".buy-now");
    const tryFreeBtn = card.querySelector(".try-for-free");

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        addOrRemovePlan(planId, name, price, category, "Buy Now", card);
      });
    }

    if (tryFreeBtn) {
      tryFreeBtn.addEventListener("click", function () {
        addOrRemovePlan(planId, name, price, category, "Try for Free", card);
      });
    }
  });

  document.querySelectorAll(".phone-card .btn-increase").forEach(button => {
  button.addEventListener("click", function () {
    increaseQuantity(this);
  });
});

document.querySelectorAll(".phone-card .btn-decrease").forEach(button => {
  button.addEventListener("click", function () {
    decreaseQuantity(this);
  });
});

document.querySelector(".next-step2-btn")?.addEventListener("click", function() {

    const totalUsers = parseInt(document.getElementById("numberOfUsers")?.value) || 0;
          // Validate: At least one plan should be selected
        //  if (!selectedPlans || selectedPlans.length === 0) {
        //    alert("Please select at least one plan before proceeding.");
        //    return; // Stop here
        //  }
        //  // Prepare data to send
        //  const totalUsers = parseInt(document.getElementById("numberOfUsers")?.value) || 0;
        //
        //  // selectedPlans is already maintained as array of plan objects in your code
        //  // For devices, use your existing getSelectedPhones() function

    if (!selectedPlans || selectedPlans.length === 0) {
    alert("Please select at least one plan.");
    return;
  }

  if (totalUsers <= 0) {
    alert("Please enter a valid number of users.");
    return;
  }
  const selectedDevices = getSelectedPhones();

  // Send the POST request to your Django endpoint
  fetch("/save_step2/", {  // <-- replace with your actual URL endpoint
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add CSRF token header if needed (see below)
      "X-CSRFToken": getCookie("csrftoken")
    },
    body: JSON.stringify({
      selectedPlans: selectedPlans,
      selectedDevices: selectedDevices,
      totalUsers: totalUsers
    })
  })
  .then(response => response.json())
    .then(data => {
    if (data.status === "success") {
    console.log("Step 2 saved successfully, server response data:", data);

    // Save to localStorage
    localStorage.setItem("selectedPlans", JSON.stringify(data.selected_plans));
    localStorage.setItem("selectedDevices", JSON.stringify(data.selected_devices));
    if (data.order_id) {
      localStorage.setItem("orderId", data.order_id);
    }

    // Optionally proceed to next step or show success UI
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "block";
    document.getElementById("step3").scrollIntoView({ behavior: "smooth" });

    } else {
    console.error("Error saving step 2:", data.message);
    alert("Failed to save step 2: " + data.message);
    }
    })
  .catch(error => {
    console.error("Network or server error:", error);
    alert("An error occurred while saving data.");
  });
});

// Helper function to get CSRF token from cookie (required by Django)
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

//document.querySelector(".previous-step1-btn")?.addEventListener("click", function () {
//  // Go back from Step 2 to Step 1
//  document.getElementById("step2").style.display = "none";
//  document.getElementById("step1").style.display = "block";
//});



});

