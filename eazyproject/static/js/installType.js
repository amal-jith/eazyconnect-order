document.addEventListener("DOMContentLoaded", function () {
  const installationCards = document.querySelectorAll(".installation-card");
  const nextBtn = document.querySelector(".install-type-btn");

  let selectedCard = null;
  let selectedInstallTitle = "";

  installationCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Deselect all
      installationCards.forEach((c) => c.classList.remove("selected-installation"));

      // Select clicked one
      card.classList.add("selected-installation");
      selectedCard = card;

      // Find and store install title
      const titleEl = card.querySelector(".install-title");
      selectedInstallTitle = titleEl ? titleEl.textContent.trim() : "";
    });
  });

  nextBtn.addEventListener("click", function () {
      if (!selectedCard || selectedInstallTitle === "") {
        alert("Please select an installation type before proceeding.");
        return;
      }

      console.log("Selected Installation Type:", selectedInstallTitle);
      localStorage.setItem("installationType", selectedInstallTitle);

      // Submit to backend
      fetch("/save_step4/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: new URLSearchParams({
          installation_type: selectedInstallTitle,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === "ok") {
            // Move to Step 5
            document.getElementById("step4").style.display = "none";
            document.getElementById("step5").style.display = "block";
            document.getElementById("step5").scrollIntoView({ behavior: "smooth" });
          } else {
            alert("Something went wrong while saving your selection.");
          }
        })
        .catch(error => {
          console.error("Fetch error:", error);
          alert("An error occurred while saving. Please try again.");
        });
    });
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

    const prevBtn = document.querySelector(".install-prev-type-btn");

    prevBtn.addEventListener("click", function () {
      // Hide current step (Step 4)
      document.getElementById("step4").style.display = "none";

      // Show previous step (Step 3)
      document.getElementById("step3").style.display = "block";

      // Scroll to Step 3 smoothly
      document.getElementById("step3").scrollIntoView({ behavior: "smooth" });
    });


});
