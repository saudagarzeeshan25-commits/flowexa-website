const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbweN1Y4g86OuTwJUwf1N3D65tJX5awpE5MG1ElSuOoaa3IaXGzWliPeApWr0D1Z-xveJg/exec";

const CAL_LINK =
  "https://cal.com/saudagar-zeeshan-sttyxl/30min";


/* =========================================================
   RESOURCE DATA
   ========================================================= */

const RESOURCE_META = {
  playbook: {
    title: "The Booked Job Playbook™",
    kicker: "FREE PDF — THE BOOKED JOB PLAYBOOK™",
    description:
      "The operating framework for an established home-service business that already has demand and wants to turn more of it into booked, completed and collected jobs.",
    file: "booked-job-playbook.pdf"
  },

  recovery: {
    title: "Revenue Recovery Map™",
    kicker: "FREE PDF — REVENUE RECOVERY MAP™",
    description:
      "A practical map for finding money already sitting in missed calls, stale estimates, cancellations and other pipeline leaks.",
    file: "revenue-recovery-map.pdf"
  },

  followup: {
    title: "Lead Follow-Up Sequence™",
    kicker: "FREE PDF — LEAD FOLLOW-UP SEQUENCE™",
    description:
      "A decision-based follow-up framework for leads that did not book on the first interaction.",
    file: "lead-follow-up-sequence.pdf"
  },

  receptionist: {
    title: "AI Receptionist Blueprint™",
    kicker: "FREE PDF — AI RECEPTIONIST BLUEPRINT™",
    description:
      "A practical guide to where AI can earn money in an established home-service operation—and where human judgment still matters.",
    file: "ai-receptionist-blueprint.pdf"
  }
};


/* =========================================================
   MOBILE MENU
   ========================================================= */

function toggleMenu() {
  const navLinks = document.getElementById("navLinks");

  if (navLinks) {
    navLinks.classList.toggle("open");
  }
}


/* =========================================================
   MODAL
   ========================================================= */

function closeModal() {
  const modal = document.getElementById("modal");

  if (!modal) {
    return;
  }

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("modal-open");
}


function openModal(html) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");

  if (!modal || !modalContent) {
    console.error("Modal elements were not found.");
    return;
  }

  modalContent.innerHTML = html;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");
}


/* =========================================================
   RESOURCE MODAL
   ========================================================= */

function openResource(key) {
  const resource = RESOURCE_META[key];

  if (!resource) {
    console.error("Unknown resource:", key);
    return;
  }

  openModal(`
    <div class="eyebrow">
      ${resource.kicker}
    </div>

    <h2>
      Get the full operating guide.
    </h2>

    <p>
      ${resource.description}
      Enter your details once. The PDF becomes available immediately after submission.
    </p>

    <form class="resource-form" id="resourceForm">

      <input
        type="hidden"
        name="type"
        value="resource-download"
      >

      <input
        type="hidden"
        name="resource"
        value="${key}"
      >

      <input
        type="hidden"
        name="page"
        value="resource-modal"
      >

      <label>
        Full name *
        <input
          required
          name="name"
          autocomplete="name"
        >
      </label>

      <label>
        Business email *
        <input
          required
          type="email"
          name="email"
          autocomplete="email"
        >
      </label>

      <label>
        Business name *
        <input
          required
          name="company"
        >
      </label>

      <label>
        Website *
        <input
          required
          type="url"
          name="website"
          placeholder="https://"
        >
      </label>

      <label>
        Business type *
        <select
          required
          name="businessType"
        >
          <option value="">
            Select one
          </option>

          <option>Roofing</option>
          <option>HVAC</option>
          <option>Plumbing</option>
          <option>Remodeling</option>
          <option>Med Spa</option>
          <option>Interior Design</option>
          <option>Other home service</option>
        </select>
      </label>

      <label>
        Biggest focus right now *
        <select
          required
          name="challenge"
        >
          <option value="">
            Select one
          </option>

          <option>
            Convert more existing leads
          </option>

          <option>
            Recover missed calls
          </option>

          <option>
            Improve follow-up
          </option>

          <option>
            Book appointments faster
          </option>

          <option>
            Automate operations
          </option>
        </select>
      </label>

      <div class="wide download-note">
        Required fields are intentional: this gives Flowexa enough context
        to follow up with something relevant rather than generic marketing.
      </div>

      <button
        class="btn btn-primary"
        type="submit"
      >
        Download My PDF →
      </button>

      <p
        class="form-status wide"
        id="resourceStatus"
        aria-live="polite"
      ></p>

    </form>
  `);

  const form = document.getElementById("resourceForm");

  if (form) {
    form.addEventListener("submit", function (event) {
      submitResource(event, key);
    });
  }
}


/* =========================================================
   SEND LEAD TO GOOGLE APPS SCRIPT
   ========================================================= */

async function postLead(data) {
  try {
    await fetch(ENDPOINT, {
      method: "POST",

      /*
       * no-cors is intentional because the Google Apps Script
       * endpoint is being used as a form receiver.
       */
      mode: "no-cors",

      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },

      body: JSON.stringify(data)
    });

    /*
     * With no-cors the browser cannot read the response.
     * If fetch itself did not throw, the request was sent.
     */
    return true;

  } catch (error) {
    console.error(
      "Flowexa lead submission error:",
      error
    );

    return false;
  }
}


/* =========================================================
   RESOURCE SUBMISSION
   ========================================================= */

async function submitResource(event, key) {
  event.preventDefault();

  const form = event.target;

  const status =
    document.getElementById("resourceStatus");

  if (!form || !status) {
    return;
  }

  const data = Object.fromEntries(
    new FormData(form).entries()
  );

  status.textContent =
    "Sending your information…";

  const ok = await postLead(data);

  const resource = RESOURCE_META[key];

  if (!ok) {
    status.textContent =
      "Something went wrong. Please try again.";

    return;
  }

  document.getElementById("modalContent").innerHTML = `
    <div class="success">

      <div class="big">
        ✓
      </div>

      <div class="eyebrow">
        ${resource.kicker}
      </div>

      <h2>
        Your guide is ready.
      </h2>

      <p>
        Your details have been submitted and the operating guide is ready to open.
      </p>

      <a
        class="btn btn-primary btn-lg"
        href="${resource.file}"
        download
      >
        Download the PDF →
      </a>

      <p class="micro">
        If the browser opens the PDF instead of downloading it,
        use the PDF viewer's download button.
      </p>

      <a
        class="btn btn-secondary"
        href="${CAL_LINK}"
        target="_blank"
        rel="noopener"
      >
        Book a Strategy Call →
      </a>

    </div>
  `;
}


/* =========================================================
   MAIN CONTACT / PILOT FORM
   ========================================================= */

async function submitLead(event, type) {
  event.preventDefault();

  const form = event.target;

  if (!form) {
    return;
  }

  const status =
    form.querySelector("#contactStatus") ||
    document.getElementById("contactStatus") ||
    form.querySelector(".form-status");

  const data = Object.fromEntries(
    new FormData(form).entries()
  );

  data.type = type || "contact";
  data.page = window.location.pathname;
  data.source = "Flowexa website";

  if (status) {
    status.textContent =
      "Sending your request…";

    status.style.color = "#607087";
  }

  const ok = await postLead(data);

  if (ok) {

    if (status) {
      status.textContent =
        type === "pilot"
          ? "Request received. Your pilot application has been submitted."
          : "Request received. We'll review the information and follow up.";

      status.style.color = "#059669";
    }

    showToast(
      type === "pilot"
        ? "Pilot application submitted."
        : "Request received."
    );

    /*
     * Reset only after successful submission.
     */
    form.reset();

  } else {

    if (status) {
      status.textContent =
        "We couldn't submit the request. Please try again or book a strategy call directly.";

      status.style.color = "#dc2626";
    }

    showToast(
      "Submission failed. Please try again."
    );
  }
}


/* =========================================================
   REVENUE CALCULATOR
   ========================================================= */

function calc() {

  const missedCallsInput =
    document.getElementById("missedCalls");

  const avgJobInput =
    document.getElementById("avgJob");

  const bookingRateInput =
    document.getElementById("bookingRate");

  const lossElement =
    document.getElementById("loss");

  if (
    !missedCallsInput ||
    !avgJobInput ||
    !bookingRateInput ||
    !lossElement
  ) {
    return;
  }

  const calls = Math.max(
    0,
    Number(missedCallsInput.value) || 0
  );

  const avg = Math.max(
    0,
    Number(avgJobInput.value) || 0
  );

  const rate =
    Math.min(
      100,
      Math.max(
        0,
        Number(bookingRateInput.value) || 0
      )
    ) / 100;

  const loss =
    calls * rate * avg;

  lossElement.textContent =
    loss.toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      }
    );
}


/* =========================================================
   CALCULATOR LISTENERS
   ========================================================= */

[
  "missedCalls",
  "avgJob",
  "bookingRate"
].forEach(function (id) {

  const element =
    document.getElementById(id);

  if (element) {
    element.addEventListener(
      "input",
      calc
    );
  }
});


calc();


/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

function updateScrollProgress() {

  /*
   * This ID is used by the fixed scroll-loading line
   * added to index.html.
   */
  const progress =
    document.getElementById("scrollProgress");

  if (!progress) {
    return;
  }

  const documentHeight =
    document.documentElement.scrollHeight;

  const viewportHeight =
    window.innerHeight;

  const maxScroll =
    documentHeight - viewportHeight;

  if (maxScroll <= 0) {
    progress.style.width = "0%";
    return;
  }

  const percentage =
    (window.scrollY / maxScroll) * 100;

  progress.style.width =
    Math.min(
      100,
      Math.max(0, percentage)
    ) + "%";
}


window.addEventListener(
  "scroll",
  updateScrollProgress,
  {
    passive: true
  }
);

window.addEventListener(
  "resize",
  updateScrollProgress
);

updateScrollProgress();


/* =========================================================
   MODAL EVENTS
   ========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Escape") {
      closeModal();
    }

  }
);


const modal =
  document.getElementById("modal");

if (modal) {

  modal.addEventListener(
    "click",
    function (event) {

      if (
        event.target.id === "modal"
      ) {
        closeModal();
      }

    }
  );
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;


function showToast(message) {

  const toast =
    document.getElementById("toast");

  if (!toast) {
    return;
  }

  toast.textContent = message;

  toast.classList.add("show");

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(
    function () {
      toast.classList.remove("show");
    },
    3000
  );
}


/*
 * Keep compatibility with any existing code
 * that calls toast() directly.
 */
function toast(message) {
  showToast(message);
}
