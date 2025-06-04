// orderSummary.js
function renderOrderSummary() {
  console.log("Rendering Order Summary");

  // Your logic here to read from localStorage/sessionStorage
  // and update the summary DOM, e.g.:

  const selectedDevices = JSON.parse(localStorage.getItem("selectedDevices")) || [];
  const container = document.getElementById("selectedDevicesContainer"); // the div where device cards go
  container.innerHTML = ""; // clear old

  selectedDevices.forEach(device => {
    const card = document.createElement("div");
    card.className = "card summary-card border-0";
    card.innerHTML = `
      <div class="card-body p-0">
        <div class="device-card-order">
          <div class="device-left">
            <div class="fw-semibold">${device.name}</div>
            <small class="text-muted">Monthly</small>
          </div>
          <div class="device-right">
            <span>${device.quantity}</span>&nbsp;<small>devices</small>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}


function renderSelectedPlans() {
  const plansContainer = document.getElementById("selectedPlansSummary");
  if (!plansContainer) return;

  const selectedPlans = JSON.parse(localStorage.getItem("selectedPlans")) || [];

  plansContainer.innerHTML = ""; // Clear previous content

  selectedPlans.forEach(plan => {
    const card = document.createElement("div");
    card.className = "card summary-card mb-3";

    card.innerHTML = `
      <div class="card-body p-0">
        <div class="summary-top d-flex justify-content-between align-items-center">
          <div class="d-flex flex-column">
            <h6 class="summary-title m-0">${plan.name}</h6>
            <small class="summary-title-1">Billed ${plan.billing_cycle || "monthly"}</small>
          </div>
          <div class="summary-price d-flex align-items-center">$${plan.price}${plan.billing_cycle === "monthly" ? "/mo" : ""}</div>
        </div>
        <div class="p-3" style="display:none;">
          <p class="users-title m-0">${plan.users} <span class="fw-normal text-muted">user${plan.users > 1 ? "s" : ""}</span></p>
        </div>
      </div>
    `;

    plansContainer.appendChild(card);
  });

  if(selectedPlans.length === 0) {
    plansContainer.innerHTML = "<p>No plans selected.</p>";
  }
}



function renderInstallationType() {
  const installationType = localStorage.getItem("installationType") || "Not selected";
  const container = document.getElementById("installationTypeSummary");
  if (!container) return;

  container.innerHTML = `
    <p><strong>Installation Type:</strong> ${installationType}</p>
  `;
}

// Call this function along with others when the summary page loads:

// Call this on Step 6 load or display
renderSelectedPlans();
renderInstallationType();


//document.querySelector('.submit-btn').addEventListener('click', function () {
//  const termsChecked = document.getElementById('checkedTerms').checked;
//
//  if (!termsChecked) {
//    alert("Please agree to the terms of service before submitting your order.");
//    return;
//  }
//
//  // Show the custom modal
//  const modal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
//    modal.show();
//
//});

// Close modal on 'X' or button click
document.querySelector('.custom-modal-close').addEventListener('click', () => {
  document.getElementById('orderSuccessModal').style.display = 'none';
});

document.querySelector('.close-modal-btn').addEventListener('click', () => {
  document.getElementById('orderSuccessModal').style.display = 'none';
});

