document.addEventListener("DOMContentLoaded", function () {
  const portToggle = document.getElementById("portToggle");
  const portInputContainer = document.getElementById("portInputContainer");
  const portNote = document.querySelector(".port-note");

  const needPhoneToggle = document.getElementById("needPhoneToggle");
  const needTollFreeToggle = document.getElementById("needTollFreeToggle");

  const citySelect = document.querySelector("#citySelect");
  const areaCodeSelect = document.querySelector("#areaCodeSelect");

  const nextBtn = document.querySelector(".choose-number-nxt-btn");

  // Debug log to check toggles existence and initial states
  console.log("needPhoneToggle element:", needPhoneToggle);
  console.log("needPhoneToggle.checked:", needPhoneToggle ? needPhoneToggle.checked : "Element not found");
  console.log("needTollFreeToggle element:", needTollFreeToggle);
  console.log("needTollFreeToggle.checked:", needTollFreeToggle ? needTollFreeToggle.checked : "Element not found");

  // Create port input field
  const portInput = document.createElement("input");
  portInput.type = "text";
  portInput.placeholder = "Enter phone numbers separated by commas";
  portInput.classList.add("form-control", "step-1-form");
  portInput.id = "portPhoneNumbers";

  // Handle port toggle to show/hide input and note
  function handlePortToggle() {
    if (portToggle.checked) {
      if (!document.getElementById("portPhoneNumbers")) {
        portInputContainer.appendChild(portInput);
      }
      if (portNote) portNote.style.display = "block";
    } else {
      portInputContainer.innerHTML = "";
      if (portNote) portNote.style.display = "none";
    }
  }

  // Validate at least one toggle on
  function validateToggles() {
    if (
      !portToggle.checked &&
      !(needPhoneToggle && needPhoneToggle.checked) &&
      !(needTollFreeToggle && needTollFreeToggle.checked)
    ) {
      alert("Please enable at least one option before proceeding.");
      return false;
    }
    return true;
  }

  // AJAX save function for step 3
  async function saveStep3Data(data) {
    try {
      const response = await fetch("/save_step3/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.status === "ok") {
        return true;
      } else {
        alert("Error saving data: " + (result.error || "Unknown error"));
        return false;
      }
    } catch (error) {
      alert("Failed to save data. Please try again.");
      return false;
    }
  }

  // Utility: get CSRF token from cookies (Django)
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Log values when changed
  function logCurrentValues() {
    if (portToggle.checked) {
      console.log("Port numbers entered:", portInput.value.trim() || "(none)");
    }
    if (needPhoneToggle && needPhoneToggle.checked) {
      console.log("I need phone number(s) from EazyConnect");
    }
    if (needTollFreeToggle && needTollFreeToggle.checked) {
      console.log("I need toll free number(s) from EazyConnect");
    }
    console.log("Selected City:", citySelect.value);
    console.log("Selected Area Code:", areaCodeSelect.value);
  }

  // Initialize port toggle state
  handlePortToggle();

  // Event listeners
  portToggle.addEventListener("change", () => {
    handlePortToggle();
    logCurrentValues();
  });

  if (needPhoneToggle) needPhoneToggle.addEventListener("change", logCurrentValues);
  if (needTollFreeToggle) needTollFreeToggle.addEventListener("change", logCurrentValues);

  citySelect.addEventListener("change", logCurrentValues);
  areaCodeSelect.addEventListener("change", logCurrentValues);

  portInput.addEventListener("input", logCurrentValues);

  nextBtn.addEventListener("click", async () => {
    if (!validateToggles()) return;

    // 💾 Save to localStorage for use in Step 6
    const portingEnabled = portToggle.checked;
    const portNumbers = portingEnabled
      ? portInput.value.split(",").map(num => num.trim()).filter(Boolean)
      : [];

    localStorage.setItem("portingEnabled", JSON.stringify(portingEnabled));
    localStorage.setItem("portNumbers", JSON.stringify(portNumbers));

    // Compose data to send with safety checks
    const dataToSend = {
      port_numbers_enabled: portingEnabled,
      port_numbers: portingEnabled
        ? portInput.value.split(",").map(num => num.trim()).filter(Boolean)
        : [],
      need_phone_numbers: needPhoneToggle ? needPhoneToggle.checked : false,
      need_toll_free_numbers: needTollFreeToggle ? needTollFreeToggle.checked : false,
      city: citySelect.value,
      area_code: areaCodeSelect.value,
    };

    // Only include port_numbers if toggle is ON and numbers entered
    if (portingEnabled) {
      const portTrimmed = portInput.value.trim();
      if (!portTrimmed) {
        alert("Please enter phone numbers or turn off the porting option.");
        return;
      }
      dataToSend.port_numbers = portTrimmed.split(",").map(num => num.trim());
    }

    console.log("Sending data to backend:", dataToSend);

    const success = await saveStep3Data(dataToSend);

    if (success) {
      document.getElementById("step3").style.display = "none";
      document.getElementById("step4").style.display = "block";
      document.getElementById("step4").scrollIntoView({ behavior: "smooth" });
    }
  });

  const prevBtn = document.querySelector(".choose-prev-btn");

  prevBtn.addEventListener("click", function () {
    // Hide current step (Step 3)
    document.getElementById("step3").style.display = "none";

    // Show previous step (Step 2)
    document.getElementById("step2").style.display = "block";

    // Scroll to Step 2 smoothly
    document.getElementById("step2").scrollIntoView({ behavior: "smooth" });
  });
});
