document.querySelector('.previous-btn.login-step-btn').addEventListener('click', function() {
  // Hide OTP step (step5-2)
  document.getElementById('step5-2').style.display = 'none';

  // Show login step (step5-1)
  document.getElementById('step5-1').style.display = 'block';

  // Scroll to login step smoothly
  document.getElementById('step5-1').scrollIntoView({ behavior: 'smooth' });
});


document.getElementById("verifyOtpBtn").addEventListener("click", function () {
  const otp = document.getElementById("otpInput").value.trim();

  if (!otp) {
    alert("Please enter the OTP.");
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

  fetch("/save_step52/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify({ otp: otp }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success" || data.status === "user_exists") {
          alert(data.message);

          // Hide OTP step
          document.getElementById("step5-2").style.display = "none";

          // Show login step
          document.getElementById("step5-1").style.display = "block";
          document.getElementById("step5-1").scrollIntoView({ behavior: "smooth" });

        } else {
          alert(data.message || "OTP verification failed.");
        }

    })
    .catch((error) => {
      console.error("Error during OTP verification:", error);
      alert("Something went wrong during OTP verification.");
    });
});
