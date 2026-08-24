// ========================================
// NOVA MASSAGE
// Basic site scripts
// ========================================

document.addEventListener("DOMContentLoaded", function () {

  // ----------------------------------------
  // Automatically update copyright year
  // ----------------------------------------

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // ----------------------------------------
  // Elements
  // ----------------------------------------

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


  // ----------------------------------------
  // "Drop us a line" contact drawer
  // ----------------------------------------

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


  if (
    dropLineTrigger &&
    contactDrawer &&
    drawerBackdrop
  ) {

    dropLineTrigger.addEventListener(
      "click",
      openDrawer
    );


    if (drawerClose) {

      drawerClose.addEventListener(
        "click",
        closeDrawer
      );

    }


    drawerBackdrop.addEventListener(
      "click",
      closeDrawer
    );
  }


  // ----------------------------------------
  // Close contact drawer with Escape
  // ----------------------------------------

  document.addEventListener(
    "keydown",
    function (e) {

      if (e.key === "Escape") {

        if (contactDrawer) {
          closeDrawer();
        }

      }

    }
  );


  // ----------------------------------------
  // Header video
  // Fall back gracefully if video fails
  // ----------------------------------------

  const heroVideo =
    document.getElementById("heroVideo");


  if (heroVideo) {

    heroVideo.addEventListener(
      "error",
      function () {

        heroVideo.style.display = "none";

      }
    );

  }


  // ----------------------------------------
  // Contact form
  //
  // Sends to FormSubmit and displays the
  // result inside the drawer.
  // ----------------------------------------

  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      function (e) {

        e.preventDefault();


        const emailField =
          contactForm.querySelector("#email");

        const nameField =
          contactForm.querySelector("#name");

        const submitButton =
          contactForm.querySelector(
            'button[type="submit"]'
          );


        // ------------------------------------
        // Validate email
        // ------------------------------------

        if (
          emailField &&
          !emailField.checkValidity()
        ) {

          setFormStatus(
            "Please enter a valid email address.",
            true
          );

          emailField.focus();

          return;
        }


        // ------------------------------------
        // Get name
        // ------------------------------------

        const name =
          nameField &&
          nameField.value.trim();


        // ------------------------------------
        // Form data
        // ------------------------------------

        const formData =
          new FormData(contactForm);


        // ------------------------------------
        // FormSubmit AJAX endpoint
        // ------------------------------------

        const ajaxAction =
          contactForm.action.replace(
            "https://formsubmit.co/",
            "https://formsubmit.co/ajax/"
          );


        // ------------------------------------
        // Disable button
        // ------------------------------------

        if (submitButton) {
          submitButton.disabled = true;
        }


        setFormStatus(
          "Sending your message…",
          false
        );


        // ------------------------------------
        // Submit
        // ------------------------------------

        fetch(
          ajaxAction,
          {
            method: "POST",

            headers: {
              Accept: "application/json"
            },

            body: formData
          }
        )

        .then(
          function (response) {

            if (!response.ok) {
              throw new Error(
                "Request failed"
              );
            }

            return response.json();

          }
        )

        .then(
          function () {

            setFormStatus(

              (
                name
                  ? name + ", thanks"
                  : "Thanks"
              ) +

              " for reaching out! Your message is on its way — " +

              "we'll get back to you soon. You're welcome to text " +

              "+17084009333 too.",

              false

            );


            contactForm.reset();


            setTimeout(
              closeDrawer,
              2200
            );

          }
        )

        .catch(
          function () {

            setFormStatus(

              "Something went wrong sending that. " +

              "Please text +17084009333 directly, " +

              "or try again in a moment.",

              true

            );

          }
        )

        .finally(
          function () {

            if (submitButton) {
              submitButton.disabled = false;
            }

          }
        );

      }
    );


    // ----------------------------------------
    // Reset form
    // ----------------------------------------

    contactForm.addEventListener(
      "reset",
      function () {

        setFormStatus(
          "",
          false
        );

      }
    );


    // ----------------------------------------
    // Attachment counter
    // ----------------------------------------

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


  // ----------------------------------------
  // Form status helper
  // ----------------------------------------

  function setFormStatus(
    message,
    isError
  ) {

    if (!formStatus) {
      return;
    }


    formStatus.textContent =
      message;


    formStatus.style.color =
      isError
        ? "#b3261e"
        : "";

  }

});
