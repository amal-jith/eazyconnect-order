document.getElementById("goToSignup").addEventListener("click", function (e) {
  e.preventDefault(); // Prevent default anchor behavior

  // Hide login step (assuming its ID is step5-1)
  document.getElementById("step5-1").style.display = "none";

  // Show the create account section
  document.getElementById("step5").style.display = "block";

  // Smooth scroll into view
  document.getElementById("step5").scrollIntoView({ behavior: "smooth" });
});

document.querySelector('.login-nxt-btn').addEventListener('click', function () {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  fetch('/save_step51/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      alert("Login successful!");

      // Go to step 6 (order summary)
      document.getElementById("step5-1").style.display = "none";
      document.getElementById("step6").style.display = "block";
      document.getElementById("step6").scrollIntoView({ behavior: "smooth" });

        // Call your Step 6 function here
    if (typeof renderOrderSummary === "function") {
    renderOrderSummary();
    }
    if (typeof renderSelectedPlans === "function") {
      renderSelectedPlans();
    }

    } else {
      alert(data.message || 'Invalid login credentials.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Something went wrong.");
  });
});
