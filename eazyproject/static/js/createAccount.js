document.getElementById("goToLogin").addEventListener("click", function (e) {
  e.preventDefault();

  document.getElementById("step5").style.display = "none";
  document.getElementById("step5-1").style.display = "block";
  document.getElementById("step5-1").scrollIntoView({ behavior: "smooth" });
});


document.querySelector('.next-btn.create-nxt-btn').addEventListener('click', function () {
  const email = document.getElementById("createEmail").value.trim();
  const password = document.getElementById("createPassword").value.trim();
  const street = document.getElementById("street").value.trim();
  const unit = document.getElementById("unit").value.trim();
  const city = document.getElementById("city").value.trim();
  const zipcode = document.getElementById("zipcode").value.trim();
  const province = document.getElementById("province").value;
  const country = document.getElementById("countryCanada").value.trim();
  const contactPerson = document.getElementById("contactPerson").value.trim();
  const contactPhone = document.getElementById("contactPhone").value.trim();

  if (!email || !password || !street || !city || !zipcode || !province || !country || !contactPerson || !contactPhone) {
    alert("Please fill out all required fields.");
    return;
  }

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

  fetch('/save_step5/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: new URLSearchParams({
      email,
      password,
      street,
      unit,
      city,
      zipcode,
      province,
      country,
      contactPerson,
      contactPhone
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'otp_sent') {  // <-- match backend response here
        console.log("OTP sent. Proceeding to verify step.");

        document.getElementById("step5").style.display = "none";
        document.getElementById("step5-2").style.display = "block";
        document.getElementById("step5-2").scrollIntoView({ behavior: "smooth" });
      } else {
        alert(data.message || "Something went wrong while sending OTP.");
      }
    })

    .catch(error => {
      console.error('Error:', error);
      alert("Failed to initiate account creation.");
    });

});


document.addEventListener("DOMContentLoaded", function () {
  const prevBtn = document.querySelector(".install-type-btn");

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      console.log("Going back to Step 4");
      document.getElementById("step5").style.display = "none";
      document.getElementById("step4").style.setProperty('display', 'block', 'important');

      document.getElementById("step4").scrollIntoView({ behavior: "smooth" });
    });
  } else {
    console.warn("Previous button (.install-type-btn) not found");
  }
});

