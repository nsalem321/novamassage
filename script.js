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

});
