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
  // This is a static page with no server-side
  // handler wired up yet, so we do client-side
  // validation and show a friendly status
  // message rather than silently failing.
  // Replace the body of handleSubmit with a
  // real fetch()/fetch to your form backend
  // (e.g. Formspree, Netlify Forms, your own
  // API) when one is available.
  // ----------------------------------------
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailField = contactForm.querySelector("#email");
      const nameField = contactForm.querySelector("#name");

      if (emailField && !emailField.checkValidity()) {
        setFormStatus("Please enter a valid email address.", true);
        emailField.focus();
        return;
      }

      // Simple honesty check: nothing is actually being sent yet.
      const name = nameField && nameField.value.trim();
      setFormStatus(
        (name ? name + ", thanks" : "Thanks") +
          " for reaching out! Please text " +
          "+17084009333 to confirm your message — this form isn't " +
          "connected to email yet.",
        false
      );
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
