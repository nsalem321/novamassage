// ========================================
// NOVA MASSAGE
// Site functionality
// ========================================

document.addEventListener("DOMContentLoaded", function () {

  // ========================================
  // COPYRIGHT YEAR
  // ========================================

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // ========================================
  // ELEMENTS
  // ========================================

  const body = document.body;

  const dropLineTrigger =
    document.getElementById("dropLineTrigger");

  const contactDrawer =
    document.getElementById("contactDrawer");

  const drawerBackdrop =
    document.getElementById("drawerBackdrop");

  const drawerClose =
    document.getElementById("drawerClose");

  const contactForm =
    document.getElementById("contactForm");

  const formStatus =
    document.getElementById("formStatus");

  const heroVideo =
    document.getElementById("heroVideo");


  // ========================================
  // CONTACT DRAWER
  // ========================================

  function openDrawer() {

    if (!contactDrawer || !drawerBackdrop) {
      return;
    }

    contactDrawer.classList.add("open");

    contactDrawer.setAttribute(
      "aria-hidden",
      "false"
    );

    drawerBackdrop.classList.add("open");

    body.classList.add("menu-open");

    if (contactForm) {
      const firstInput = contactForm.querySelector(
        "input:not([type='hidden']):not([type='file'])"
      );

      if (firstInput) {
        setTimeout(function () {
          firstInput.focus();
        }, 300);
      }
    }
  }


  function closeDrawer() {

    if (!contactDrawer || !drawerBackdrop) {
      return;
    }

    contactDrawer.classList.remove("open");

    contactDrawer.setAttribute(
      "aria-hidden",
      "true"
    );

    drawerBackdrop.classList.remove("open");

    body.classList.remove("menu-open");
  }


  if (dropLineTrigger) {
    dropLineTrigger.addEventListener(
      "click",
      openDrawer
    );
  }


  if (drawerClose) {
    drawerClose.addEventListener(
      "click",
      closeDrawer
    );
  }


  if (drawerBackdrop) {
    drawerBackdrop.addEventListener(
      "click",
      closeDrawer
    );
  }


  // ========================================
  // ESCAPE KEY
  // ========================================

  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Escape") {
        closeDrawer();
      }

    }
  );


  // ========================================
  // HERO VIDEO
  // ========================================

  if (heroVideo) {

    heroVideo.addEventListener(
      "error",
      function () {
        heroVideo.style.display = "none";
      }
    );


    // Some mobile browsers may prevent
    // autoplay. Try to start it manually.
    const playPromise = heroVideo.play();

    if (
      playPromise !== undefined
    ) {

      playPromise.catch(
        function () {
          // Autoplay may be blocked.
          // The poster image will remain visible.
        }
      );

    }

  }


  // ========================================
  // CONTACT FORM
  // ========================================

  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        const emailField =
          contactForm.querySelector("#email");

        const nameField =
          contactForm.querySelector("#name");

        const replyToField =
          contactForm.querySelector("#_replyto");

        const submitButton =
          contactForm.querySelector(
            'button[type="submit"]'
          );


        // ====================================
        // VALIDATE FORM
        // ====================================

        if (!contactForm.checkValidity()) {

          contactForm.reportValidity();

          return;
        }


        // ====================================
        // GET NAME
        // ====================================

        const name =
          nameField
            ? nameField.value.trim()
            : "";


        // ====================================
        // SET REPLY-TO
        // ====================================

        if (
          replyToField &&
          emailField
        ) {

          replyToField.value =
            emailField.value.trim();

        }


        // ====================================
        // FORM DATA
        // ====================================

        const formData =
          new FormData(contactForm);


        // ====================================
        // AJAX ENDPOINT
        // ====================================

        const ajaxAction =
          contactForm.action.replace(
            "https://formsubmit.co/",
            "https://formsubmit.co/ajax/"
          );


        // ====================================
        // DISABLE SEND BUTTON
        // ====================================

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Sending...";
        }


        setFormStatus(
          "Sending your message…",
          false
        );


        try {

          const response =
            await fetch(
              ajaxAction,
              {
                method: "POST",
                headers: {
                  Accept: "application/json"
                },
                body: formData
              }
            );


          if (!response.ok) {
            throw new Error(
              "Request failed"
            );
          }


          const result =
            await response.json();


          // FormSubmit normally returns
          // success information here.
          if (
            result &&
            result.success === false
          ) {
            throw new Error(
              "Form submission failed"
            );
          }


          // ==================================
          // SUCCESS
          // ==================================

          setFormStatus(

            (
              name
                ? name + ", thanks"
                : "Thanks"
            ) +

            " for reaching out! Your message is " +

            "on its way — we'll get back to you soon. " +

            "You're welcome to text +1 (708) 400-9333 too.",

            false

          );


          contactForm.reset();


          const attachmentNote =
            contactForm.querySelector(
              ".attachment-note"
            );

          if (attachmentNote) {
            attachmentNote.textContent =
              "Attachments (0)";
          }


          setTimeout(
            function () {
              closeDrawer();
            },
            2500
          );


        } catch (error) {

          console.error(
            "Contact form error:",
            error
          );


          setFormStatus(

            "Something went wrong sending that. " +

            "Please text +1 (708) 400-9333 directly, " +

            "or try again in a moment.",

            true

          );

        } finally {

          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Send";
          }

        }

      }
    );


    // ========================================
    // FORM RESET
    // ========================================

    contactForm.addEventListener(
      "reset",
      function () {

        setTimeout(
          function () {

            setFormStatus(
              "",
              false
            );


            const attachmentNote =
              contactForm.querySelector(
                ".attachment-note"
              );

            if (attachmentNote) {
              attachmentNote.textContent =
                "Attachments (0)";
            }

          },
          0
        );

      }
    );


    // ========================================
    // ATTACHMENT COUNTER
    // ========================================

    const attachmentInput =
      contactForm.querySelector(
        "#attachment"
      );

    const attachmentNote =
      contactForm.querySelector(
        ".attachment-note"
      );


    if (
      attachmentInput &&
      attachmentNote
    ) {

      attachmentInput.addEventListener(
        "change",
        function () {

          const count =
            attachmentInput.files
              ? attachmentInput.files.length
              : 0;


          attachmentNote.textContent =
            "Attachments (" +
            count +
            ")";

        }
      );

    }

  }


  // ========================================
  // FORM STATUS HELPER
  // ========================================

  function setFormStatus(
    message,
    isError
  ) {

    if (!formStatus) {
      return;
    }


    formStatus.textContent =
      message;


    if (isError) {

      formStatus.classList.add(
        "error"
      );

    } else {

      formStatus.classList.remove(
        "error"
      );

    }

  }


  // ========================================
  // LIGHT / DARK THEME SWITCH
  // ========================================

  const themeButtons = document.querySelectorAll("[data-theme-choice]");

  function applyTheme(theme) {
    const selected = theme === "light" ? "light" : "dark";
    body.setAttribute("data-theme", selected);
    themeButtons.forEach(function (button) {
      const active = button.getAttribute("data-theme-choice") === selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    try {
      localStorage.setItem("nova-massage-theme", selected);
    } catch (error) {
      // Theme remains usable when storage is unavailable.
    }
  }

  let savedTheme = "dark";
  try {
    const storedTheme = localStorage.getItem("nova-massage-theme");
    if (storedTheme === "light" || storedTheme === "dark") savedTheme = storedTheme;
  } catch (error) {
    // Keep the default dark theme.
  }
  applyTheme(savedTheme);

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      applyTheme(button.getAttribute("data-theme-choice"));
    });
  });


  // SERVICE SEARCH AND FILTERS
  const serviceCards = Array.from(document.querySelectorAll(".popular-grid .service-card"));
  const searchInput = document.getElementById("serviceSearch");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const resultsLabel = document.getElementById("serviceResults");
  let activeFilter = "all";
  function classifyService(card) {
    const name = (card.querySelector("h4")?.textContent || "").toLowerCase();
    if (/deep tissue|tmj|upper body|neck nirvana/.test(name)) return "therapeutic";
    if (/abdominal|lymph|brush|reflexology/.test(name)) return "specialty";
    return "relaxation";
  }
  function filterServices() {
    const term = (searchInput?.value || "").trim().toLowerCase();
    let visible = 0;
    serviceCards.forEach(card => {
      const matchesText = !term || card.textContent.toLowerCase().includes(term);
      const matchesFilter = activeFilter === "all" || classifyService(card) === activeFilter;
      const show = matchesText && matchesFilter;
      card.classList.toggle("is-filtered-out", !show);
      if (show) visible++;
    });
    if (resultsLabel) resultsLabel.textContent = visible + (visible === 1 ? " treatment shown" : " treatments shown");
  }
  filterButtons.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    filterButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    filterServices();
  }));
  if (searchInput) searchInput.addEventListener("input", filterServices);

  // SCROLL REVEALS
  const revealTargets = document.querySelectorAll(".about-grid,.service-card,.gallery-tile,.ritual-panel,.faq-item,.reviews-empty");
  revealTargets.forEach((element, index) => {
    element.classList.add("js-reveal");
    element.style.transitionDelay = (index % 3) * 70 + "ms";
  });
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(element => revealObserver.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add("is-visible"));
  }

  // SUBTLE POINTER-BASED 3D CARD TILT
  const canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canHover) {
    document.querySelectorAll(".service-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 5;
        const rotateX = (0.5 - y) * 4;
        card.style.transform = "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-5px)";
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  // GUIDED FAQ CONCIERGE (NOT LIVE AI CHAT)
  const conciergeToggle = document.getElementById("conciergeToggle");
  const conciergePanel = document.getElementById("conciergePanel");
  const conciergeClose = document.getElementById("conciergeClose");
  const conciergeAnswer = document.getElementById("conciergeAnswer");
  function setConcierge(open) {
    if (!conciergeToggle || !conciergePanel) return;
    conciergePanel.hidden = !open;
    conciergeToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (conciergeToggle) conciergeToggle.addEventListener("click", () => setConcierge(conciergePanel.hidden));
  if (conciergeClose) conciergeClose.addEventListener("click", () => setConcierge(false));
  document.querySelectorAll("[data-answer]").forEach(button => {
    button.addEventListener("click", () => {
      if (conciergeAnswer) conciergeAnswer.textContent = button.dataset.answer || "";
    });
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setConcierge(false);
  });

});
