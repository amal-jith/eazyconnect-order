document.getElementById("submitOrderBtn").addEventListener("click", function () {
  const termsChecked = document.getElementById("checkedTerms").checked;
  if (!termsChecked) {
    alert("Please agree to the terms of service before submitting your order.");
    return; // stop here — no submit!
  }

  // Terms accepted, proceed with submit

  // Gather localStorage/sessionStorage data
  const selectedDevices = JSON.parse(localStorage.getItem("selectedDevices") || "[]");
  const selectedPlans = JSON.parse(localStorage.getItem("selectedPlans") || "[]");
  const estimatedTotal = localStorage.getItem("estimatedTotal") || null;
  const userAllocation = JSON.parse(localStorage.getItem("userAllocation") || "{}");
  const portingEnabled = JSON.parse(localStorage.getItem("portingEnabled") || "false");
  const portNumbers = JSON.parse(localStorage.getItem("portNumbers") || "[]");
  const selectedInstallationType = document.querySelector('input[name="installationType"]:checked')?.value || null;
  const promoCode = localStorage.getItem("promoCode") || null;
  const usageType = localStorage.getItem("usageType") || null;
  const postalCode = localStorage.getItem("postalCode") || null;
  const city = localStorage.getItem("city") || null;

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  fetch("/submit_order/", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify({
      selectedDevices,
      selectedPlans,
      estimatedTotal,
      userAllocation,
      portingEnabled,
      portNumbers,
      installationType: selectedInstallationType,
      usageType,
      city,
      postalCode,
      promoCode,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const modal = new bootstrap.Modal(document.getElementById("orderSuccessModal"));
        modal.show();
      } else {
        alert(data.message || "Failed to submit order.");
      }
    })
    .catch((error) => {
      console.error("Error submitting order:", error);
      alert("An unexpected error occurred.");
    });
});
