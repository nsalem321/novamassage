// ========================================
// NOVA MASSAGE
// Basic site scripts
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  // ----------------------------------------
  // Automatically update the copyright year
  // (works if you add <span id="year"></span>
  // inside the footer's copyright line)
  // ----------------------------------------
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ----------------------------------------
  // Elements
  // ----------------------------------------
  const body = document.body;

  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mobileNav = document.getElementById("mobileNav");

  const moreButton = document.getElementById("moreButton");
  const moreMenu = document.getElementById("moreMenu");

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  // ----------------------------------------
  // Mobile nav (hamburger) menu
  // ----------------------------------------
  function openMobileNav() {
    mobileNav.classList.add("open");
    mobileNav.setAttribute("aria-hidden", "false");
    mobileMenuButton.setAttribute("aria-expanded", "true");
    mobileMenuButton.classList.add("open");
    body.classList.add("menu-open");
  }

  function closeMobileNav() {
    mobileNav.classList.remove("open");
    mobileNav.setAttribute("aria-hidden", "true");
    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.classList.remove("open");
    body.classList.remove("menu-open");
  }

  function toggleMobileNav() {
    const isOpen = mobileNav.classList.contains("open");
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  if (mobileMenuButton && mobileNav) {
    mobileMenuButton.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMobileNav();
    });

    // Close the mobile nav after tapping a link
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    // Close when clicking outside the open menu
    document.addEventListener("click", function (e) {
      if (
        mobileNav.classList.contains("open") &&
        !mobileNav.contains(e.target) &&
        !mobileMenuButton.contains(e.target)
      ) {
        closeMobileNav();
      }
    });
  }

  // ----------------------------------------
  // "More" dropdown menu (desktop)
  // ----------------------------------------
  function openMoreMenu() {
    moreMenu.classList.add("open");
    moreMenu.setAttribute("aria-hidden", "false");
    moreButton.setAttribute("aria-expanded", "true");
  }

  function closeMoreMenu() {
    moreMenu.classList.remove("open");
    moreMenu.setAttribute("aria-hidden", "true");
    moreButton.setAttribute("aria-expanded", "false");
  }

  function toggleMoreMenu() {
    const isOpen = moreMenu.classList.contains("open");
    if (isOpen) {
      closeMoreMenu();
    } else {
      openMoreMenu();
    }
  }

  if (moreButton && moreMenu) {
    moreButton.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMoreMenu();
    });

    moreMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMoreMenu);
    });

    document.addEventListener("click", function (e) {
      if (
        moreMenu.classList.contains("open") &&
        !moreMenu.contains(e.target) &&
        !moreButton.contains(e.target)
      ) {
        closeMoreMenu();
      }
    });
  }

  // ----------------------------------------
  // Shared: close both menus on Escape,
  // and on resize back to desktop width
  // ----------------------------------------
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (mobileNav) closeMobileNav();
      if (moreMenu) closeMoreMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 700 && mobileNav && mobileNav.classList.contains("open")) {
      closeMobileNav();
    }
  });

  // ----------------------------------------
  // Header video: fall back gracefully if the
  // video source is missing or fails to load
  // ----------------------------------------
  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    heroVideo.addEventListener("error", function () {
      heroVideo.style.display = "none";
    });
  }

  // ----------------------------------------
  // Contact form
  // Submits to FormSubmit (https://formsubmit.co), which
  // relays the message straight to thenovamassage@gmail.com.
  // No backend/server code required. We POST via fetch so we
  // can show an inline status message instead of redirecting
  // the visitor to a new page.
  //
  // IMPORTANT ONE-TIME STEP: the very first time this form is
  // submitted (from the live site), FormSubmit sends an
  // activation email to thenovamassage@gmail.com. Someone needs
  // to click the confirmation link in that email — after that,
  // every future submission is delivered automatically.
  // ----------------------------------------
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailField = contactForm.querySelector("#email");
      const nameField = contactForm.querySelector("#name");
      const submitButton = contactForm.querySelector('button[type="submit"]');

      if (emailField && !emailField.checkValidity()) {
        setFormStatus("Please enter a valid email address.", true);
        emailField.focus();
        return;
      }

      const name = nameField && nameField.value.trim();
      const formData = new FormData(contactForm);
      const ajaxAction = contactForm.action.replace(
        "https://formsubmit.co/",
        "https://formsubmit.co/ajax/"
      );

      if (submitButton) submitButton.disabled = true;
      setFormStatus("Sending your message…", false);

      fetch(ajaxAction, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Request failed");
          return response.json();
        })
        .then(function () {
          setFormStatus(
            (name ? name + ", thanks" : "Thanks") +
              " for reaching out! Your message is on its way — " +
              "we'll get back to you soon. You're welcome to text " +
              "+17084009333 too.",
            false
          );
          contactForm.reset();
        })
        .catch(function () {
          setFormStatus(
            "Something went wrong sending that. Please text " +
              "+17084009333 directly, or try again in a moment.",
            true
          );
        })
        .finally(function () {
          if (submitButton) submitButton.disabled = false;
        });
    });

    contactForm.addEventListener("reset", function () {
      setFormStatus("", false);
    });

    // Update the "Attachments (0)" note when a file is chosen
    const attachmentInput = contactForm.querySelector("#attachment");
    const attachmentNote = contactForm.querySelector(".attachment-note");
    if (attachmentInput && attachmentNote) {
      attachmentInput.addEventListener("change", function () {
        const count = attachmentInput.files ? attachmentInput.files.length : 0;
        attachmentNote.textContent = "Attachments (" + count + ")";
      });
    }
  }

  function setFormStatus(message, isError) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.style.color = isError ? "#b3261e" : "";
  }
});
