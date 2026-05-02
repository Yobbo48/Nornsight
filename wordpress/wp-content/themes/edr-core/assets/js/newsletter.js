document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("[data-edr-newsletter-form]");

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const emailInput = form.querySelector("input[type='email']");
      const message = form.querySelector("[data-edr-newsletter-message]");

      if (!emailInput || !message) return;

      const body = new URLSearchParams();
      body.set("action", "edr_core_newsletter_subscribe");
      body.set("nonce", edrCore.nonce);
      body.set("email", emailInput.value);

      try {
        const response = await fetch(edrCore.ajaxUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          body: body.toString(),
        });

        const result = await response.json();
        message.textContent = result?.data?.message || "Merci.";
      } catch (error) {
        message.textContent = "Une erreur temporaire est survenue.";
      }
    });
  });
});
