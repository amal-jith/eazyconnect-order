document.addEventListener("DOMContentLoaded", () => {
  const btnHome = document.getElementById("btn-home");
  const btnBusiness = document.getElementById("btn-business");
  const usageTypeInput = document.getElementById("usageTypeInput");

  const nextBtn = document.querySelector(".next-btn");

  // Toggle active button and update hidden input
  function toggleButtons(selectedBtn, otherBtn, selectedValue) {
    selectedBtn.classList.add("active");
    otherBtn.classList.remove("active");
    usageTypeInput.value = selectedValue;
  }

  // Button click handlers
  btnHome.addEventListener("click", () => toggleButtons(btnHome, btnBusiness, "For my Home"));
  btnBusiness.addEventListener("click", () => toggleButtons(btnBusiness, btnHome, "For my Business"));

  // Set default state
  toggleButtons(btnHome, btnBusiness, "For my Home");

  // Handle next button
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const city = document.getElementById("cityInput").value.trim();
    const postal = document.getElementById("postalInput").value.trim();
    const usageType = usageTypeInput.value;

    if (!city || !postal) {
      alert("Please fill out all fields");
      return;
    }

     // Save to localStorage ✅
  localStorage.setItem("usageType", usageType);
  localStorage.setItem("city", city);
  localStorage.setItem("postalCode", postal);

    const data = {
      usage_type: usageType,
      city: city,
      postal_code: postal,
    };

    // POST to Django view
    fetch("/save_step1/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: new URLSearchParams(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "ok") {
          console.log("Step 1 saved:", res.data);
          // Proceed to next step
          document.getElementById("step1").style.display = "none";
          document.getElementById("step2").style.display = "block";

          // Optional: update stepper
          if (typeof setActiveStepper === "function") {
            setActiveStepper(2);
          }
        } else {
          alert("Error saving step 1");
        }
      })
      .catch(() => alert("Network error"));
  });

  // CSRF helper
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }




});
















//document.addEventListener("DOMContentLoaded", () => {
//  const btnHome = document.getElementById("btn-home");
//  const btnBusiness = document.getElementById("btn-business");
//  const usageTypeInput = document.getElementById("usageTypeInput");
//
//  // Helper to toggle active class and disable buttons
//  function toggleButtons(selectedBtn, otherBtn, selectedValue) {
//    selectedBtn.classList.add("active");
//    otherBtn.classList.remove("active");
//    usageTypeInput.value = selectedValue;
//
//    // If you want to disable the unselected button, uncomment next line:
//    // otherBtn.disabled = true;
//    // selectedBtn.disabled = false;
//
//    // Or if you just want toggle visually, don't disable buttons programmatically
//  }
//
//  btnHome.addEventListener("click", () => {
//    toggleButtons(btnHome, btnBusiness, "For my Home");
//  });
//
//  btnBusiness.addEventListener("click", () => {
//    toggleButtons(btnBusiness, btnHome, "For my Business");
//  });
//
//  // Initialize default state
//  toggleButtons(btnHome, btnBusiness, "For my Home");
//
//  // Form submission or next button click can be handled here
//  const nextBtn = document.querySelector(".next-btn");
//  nextBtn.addEventListener("click", (e) => {
//    e.preventDefault();
//
//    const city = document.getElementById("cityInput").value.trim();
//    const postal = document.getElementById("postalInput").value.trim();
//
//    if (!city || !postal) {
//      alert("Please fill out all fields");
//      return;
//    }
//
//    const data = {
//      usage_type: usageTypeInput.value,
//      city: city,
//      postal_code: postal,
//    };
//
//    console.log("Step 1 data:", data);
//
//    // Example POST request
//    fetch("/save_step1/", {
//      method: "POST",
//      headers: {
//        "Content-Type": "application/x-www-form-urlencoded",
//        "X-CSRFToken": getCookie("csrftoken"), // helper function to get csrf token
//      },
//      body: new URLSearchParams(data),
//    })
//      .then((res) => res.json())
//      .then((res) => {
//        if (res.status === "ok") {
//          console.log("Step 1 saved:", res.data);
//          // TODO: go to next step (show next step div, hide current)
//          document.getElementById("step1").style.display = "none";
//          // Show step2 etc.
//        } else {
//          alert("Error saving step 1");
//        }
//      })
//      .catch(() => alert("Network error"));
//
//  });
//
//  // CSRF helper function to get csrf token from cookie (needed for POST)
//  function getCookie(name) {
//    let cookieValue = null;
//    if (document.cookie && document.cookie !== "") {
//      const cookies = document.cookie.split(";");
//      for (let i = 0; i < cookies.length; i++) {
//        const cookie = cookies[i].trim();
//        if (cookie.substring(0, name.length + 1) === name + "=") {
//          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//          break;
//        }
//      }
//    }
//    return cookieValue;
//  }
//});
