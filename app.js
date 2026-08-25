const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbweN1Y4g86OuTwJUwf1N3D65tJX5awpE5MG1ElSuOoaa3IaXGzWliPeApWr0D1Z-xveJg/exec";

const CAL_LINK =
  "https://cal.com/saudagar-zeeshan-sttyxl/30min";


/* =========================================================
   RESOURCE FILES
   ========================================================= */

const RESOURCE_META = {

  playbook: {
    title: "The Booked Job Playbook™",
    kicker: "FREE PDF — THE BOOKED JOB PLAYBOOK™",
    description:
      "The operating framework for an established home-service business that already has demand and wants to turn more of it into booked, completed and collected jobs.",
    file: "booked-job-playbook.pdf"
  },

  score: {
    title: "Booked Job Score™",
    kicker: "60-SECOND DIAGNOSTIC — BOOKED JOB SCORE™",
    description:
      "Eight quick questions to identify the biggest lead-to-booking gaps in your current process.",
    file: null
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

  const nav =
    document.getElementById("navLinks");

  if (!nav) return;

  nav.classList.toggle("open");

}


/* =========================================================
   MODAL
   ========================================================= */

function closeModal() {

  const modal =
    document.getElementById("modal");

  if (!modal) return;

  modal.classList.remove("open");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

}


/* =========================================================
   OPEN MODAL
   ========================================================= */

function openModal(html) {

  const modal =
    document.getElementById("modal");

  const content =
    document.getElementById("modalContent");

  if (!modal || !content) {

    console.error(
      "Modal elements were not found."
    );

    return;

  }

  content.innerHTML = html;

  modal.classList.add("open");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

}


/* =========================================================
   OPEN RESOURCE
   ========================================================= */

function openResource(key) {

  const resource =
    RESOURCE_META[key];

  if (!resource) {

    console.error(
      "Unknown resource:",
      key
    );

    return;

  }


  /*
   * Booked Job Score is not a PDF.
   * It gets its own diagnostic flow.
   */

  if (key === "score") {

    openScore();

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
      Enter your details once. The PDF will become available
      immediately after submission.
    </p>


    <form
      class="resource-form"
      id="resourceForm"
    >

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
        name="source"
        value="Flowexa Website"
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
          autocomplete="organization"
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

          <option>
            Roofing
          </option>

          <option>
            HVAC
          </option>

          <option>
            Plumbing
          </option>

          <option>
            Remodeling
          </option>

          <option>
            Med Spa
          </option>

          <option>
            Interior Design
          </option>

          <option>
            Other home service
          </option>

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
            Recover missed calls / old opportunities
          </option>

          <option>
            Convert more existing leads
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

        Required fields are intentional:
        this gives Flowexa enough context to follow up
        with something relevant rather than generic marketing.

      </div>


      <button
        class="btn btn-primary"
        type="submit"
        id="resourceSubmit"
      >
        Download My PDF →
      </button>


      <p
        class="form-status wide"
        id="resourceStatus"
      ></p>

    </form>

  `);


  const form =
    document.getElementById(
      "resourceForm"
    );


  if (!form) {

    console.error(
      "Resource form was not created."
    );

    return;

  }


  form.addEventListener(
    "submit",
    function (event) {

      submitResource(
        event,
        key
      );

    }
  );

}


/* =========================================================
   SEND DATA TO GOOGLE SHEETS
   ========================================================= */

async function postLead(data) {

  try {

    /*
     * We intentionally use text/plain.
     *
     * This avoids a CORS preflight request with
     * Google Apps Script.
     */

    await fetch(
      ENDPOINT,
      {
        method: "POST",

        mode: "no-cors",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:
          JSON.stringify(data)
      }
    );


    /*
     * With no-cors the browser gives us an
     * opaque response, so we cannot inspect
     * Google's JSON response.
     *
     * The request itself has been sent.
     */

    return true;


  } catch (error) {

    console.error(
      "Google Sheets submission error:",
      error
    );

    return false;

  }

}


/* =========================================================
   RESOURCE SUBMISSION
   ========================================================= */

async function submitResource(
  event,
  key
) {

  event.preventDefault();


  const form =
    event.target;


  const status =
    document.getElementById(
      "resourceStatus"
    );


  const button =
    document.getElementById(
      "resourceSubmit"
    );


  if (!form || !status) {

    console.error(
      "Resource form/status missing."
    );

    return;

  }


  const data =
    Object.fromEntries(
      new FormData(form).entries()
    );


  /*
   * Prevent duplicate submissions.
   */

  if (button) {

    button.disabled = true;

    button.textContent =
      "Submitting…";

  }


  status.textContent =
    "Submitting your information…";


  const ok =
    await postLead(data);


  const resource =
    RESOURCE_META[key];


  if (!ok) {

    status.textContent =
      "Something went wrong. Please try again.";

    if (button) {

      button.disabled = false;

      button.textContent =
        "Download My PDF →";

    }

    return;

  }


  /*
   * Submission was sent.
   * Now show the download action.
   */

  status.textContent = "";


  document
    .getElementById(
      "modalContent"
    )
    .innerHTML = `

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
          Your information has been submitted
          and your operating guide is ready.
        </p>


        <a
          class="btn btn-primary btn-lg"
          href="${resource.file}"
          target="_blank"
          rel="noopener"
        >
          Open / Download the PDF →
        </a>


        <p class="micro">
          The PDF will open in a new tab.
          Use the download button in the PDF viewer
          to save it to your device.
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
   BOOKED JOB SCORE
   ========================================================= */

function openScore() {

  openModal(`

    <div class="eyebrow">
      60-SECOND DIAGNOSTIC — BOOKED JOB SCORE™
    </div>

    <h2>
      Find your biggest lead-to-booking gaps
      in about a minute.
    </h2>

    <p>
      Eight quick questions.
      Your result is directional and designed
      to show where we'd investigate first.
    </p>


    <form
      class="score-form"
      id="scoreForm"
    >

      <label>
        1. How quickly do you normally respond
        to a new lead? *

        <select required name="responseTime">

          <option value="">
            Select one
          </option>

          <option>
            Within 5 minutes
          </option>

          <option>
            Within 30 minutes
          </option>

          <option>
            Within a few hours
          </option>

          <option>
            Same day
          </option>

          <option>
            Next day or later
          </option>

        </select>

      </label>


      <label>
        2. What happens when you miss a call? *

        <select required name="missedCall">

          <option value="">
            Select one
          </option>

          <option>
            We call back immediately
          </option>

          <option>
            We usually call back later
          </option>

          <option>
            It depends on the team
          </option>

          <option>
            There is no consistent process
          </option>

        </select>

      </label>


      <label>
        3. How consistently are estimates followed up? *

        <select required name="estimateFollowup">

          <option value="">
            Select one
          </option>

          <option>
            Every estimate has a follow-up process
          </option>

          <option>
            Most estimates get followed up
          </option>

          <option>
            Follow-up depends on the salesperson
          </option>

          <option>
            There is little or no structured follow-up
          </option>

        </select>

      </label>


      <label>
        4. How are new leads tracked? *

        <select required name="leadTracking">

          <option value="">
            Select one
          </option>

          <option>
            CRM / centralized system
          </option>

          <option>
            Spreadsheet
          </option>

          <option>
            Multiple tools
          </option>

          <option>
            Mostly memory / inbox / phone
          </option>

        </select>

      </label>


      <label>
        5. Who handles incoming calls and leads? *

        <select required name="leadHandling">

          <option value="">
            Select one
          </option>

          <option>
            Dedicated receptionist / coordinator
          </option>

          <option>
            Sales team
          </option>

          <option>
            Owner
          </option>

          <option>
            Whoever is available
          </option>

        </select>

      </label>


      <label>
        6. How often do leads go cold without a clear next step? *

        <select required name="coldLeads">

          <option value="">
            Select one
          </option>

          <option>
            Rarely
          </option>

          <option>
            Sometimes
          </option>

          <option>
            Often
          </option>

          <option>
            Very often
          </option>

        </select>

      </label>


      <label>
        7. How clearly can you see where leads are being lost? *

        <select required name="visibility">

          <option value="">
            Select one
          </option>

          <option>
            Very clearly
          </option>

          <option>
            Mostly clearly
          </option>

          <option>
            Somewhat
          </option>

          <option>
            Not clearly
          </option>

        </select>

      </label>


      <label>
        8. What would you most want to improve? *

        <select required name="priority">

          <option value="">
            Select one
          </option>

          <option>
            Speed to lead
          </option>

          <option>
            Missed-call recovery
          </option>

          <option>
            Estimate follow-up
          </option>

          <option>
            Lead qualification
          </option>

          <option>
            Appointment booking
          </option>

          <option>
            Overall visibility
          </option>

        </select>

      </label>


      <div class="wide">

        <button
          class="btn btn-primary"
          type="submit"
          id="scoreSubmit"
        >
          See My Score →
        </button>

      </div>


      <p
        class="form-status wide"
        id="scoreStatus"
      ></p>

    </form>

  `);


  const form =
    document.getElementById(
      "scoreForm"
    );


  if (!form) return;


  form.addEventListener(
    "submit",
    submitScore
  );

}


/* =========================================================
   SCORE SUBMISSION
   ========================================================= */

async function submitScore(event) {

  event.preventDefault();


  const form =
    event.target;


  const status =
    document.getElementById(
      "scoreStatus"
    );


  const button =
    document.getElementById(
      "scoreSubmit"
    );


  const answers =
    Object.fromEntries(
      new FormData(form).entries()
    );


  if (button) {

    button.disabled = true;

    button.textContent =
      "Calculating…";

  }


  status.textContent =
    "Calculating your directional score…";


  /*
   * Calculate a simple directional score.
   * Higher score = stronger current process.
   */

  const values =
    Object.values(answers);


  let score = 0;


  values.forEach(
    function (value) {

      const text =
        String(value)
          .toLowerCase();


      if (
        text.includes("within 5") ||
        text.includes("immediately") ||
        text.includes("every estimate") ||
        text.includes("centralized") ||
        text.includes("dedicated") ||
        text === "rarely" ||
        text.includes("very clearly")
      ) {

        score += 2;

      } else {

        score += 1;

      }

    }
  );


  /*
   * Send score information to Google Sheets.
   */

  const leadData = {

    type:
      "booked-job-score",

    name:
      "",

    email:
      "",

    phone:
      "",

    company:
      "",

    website:
      "",

    businessType:
      "",

    problem:
      answers.priority || "",

    resource:
      "booked-job-score",

    source:
      "Flowexa Website",

    score:
      score,

    responseTime:
      answers.responseTime || "",

    missedCall:
      answers.missedCall || "",

    estimateFollowup:
      answers.estimateFollowup || "",

    leadTracking:
      answers.leadTracking || "",

    leadHandling:
      answers.leadHandling || "",

    coldLeads:
      answers.coldLeads || "",

    visibility:
      answers.visibility || "",

    priority:
      answers.priority || ""

  };


  await postLead(
    leadData
  );


  let title =
    "Your Booked Job Score™";


  let description =
    "";


  if (score >= 13) {

    title =
      "Strong foundation.";

    description =
      "Your core lead-to-booking process appears relatively structured. The biggest opportunity is likely optimization rather than rebuilding the entire process.";

  } else if (score >= 9) {

    title =
      "There are meaningful gaps.";

    description =
      "Your process has some structure, but several handoffs or follow-up points may be costing you booked jobs.";

  } else {

    title =
      "There is significant leakage.";

    description =
      "Your answers suggest that inconsistent response, tracking or follow-up may be creating avoidable lead-to-booking losses.";

  }


  document
    .getElementById(
      "modalContent"
    )
    .innerHTML = `

      <div class="success">

        <div class="big">
          ${score}/16
        </div>

        <div class="eyebrow">
          BOOKED JOB SCORE™
        </div>

        <h2>
          ${title}
        </h2>

        <p>
          ${description}
        </p>

        <p class="micro">
          This is a directional diagnostic,
          not a formal audit.
        </p>

        <a
          class="btn btn-primary"
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
   MAIN CONTACT FORM
   ========================================================= */

const leadForm =
  document.getElementById(
    "leadForm"
  );


if (leadForm) {

  leadForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const status =
        document.getElementById(
          "formStatus"
        );


      const button =
        leadForm.querySelector(
          'button[type="submit"]'
        );


      const data =
        Object.fromEntries(
          new FormData(
            leadForm
          ).entries()
        );


      if (button) {

        button.disabled = true;

        button.textContent =
          "Sending…";

      }


      status.textContent =
        "Sending your request…";


      const ok =
        await postLead(
          data
        );


      if (ok) {

        status.textContent =
          "Request received. We'll review the information and follow up.";

        status.classList.add(
          "success-text"
        );

        leadForm.reset();


      } else {

        status.textContent =
          "Something went wrong. Please try again or book a strategy call directly.";

      }


      if (button) {

        button.disabled = false;

        button.textContent =
          "Send Request →";

      }

    }
  );

}


/* =========================================================
   CALCULATOR
   ========================================================= */

function calc() {

  const missedCallsInput =
    document.getElementById(
      "missedCalls"
    );


  const avgJobInput =
    document.getElementById(
      "avgJob"
    );


  const bookingRateInput =
    document.getElementById(
      "bookingRate"
    );


  const lossElement =
    document.getElementById(
      "loss"
    );


  if (
    !missedCallsInput ||
    !avgJobInput ||
    !bookingRateInput ||
    !lossElement
  ) {

    return;

  }


  const calls =
    Math.max(
      0,
      Number(
        missedCallsInput.value
      ) || 0
    );


  const avg =
    Math.max(
      0,
      Number(
        avgJobInput.value
      ) || 0
    );


  const rate =
    Math.min(
      100,
      Math.max(
        0,
        Number(
          bookingRateInput.value
        ) || 0
      )
    ) / 100;


  const loss =
    calls *
    rate *
    avg;


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
].forEach(
  function (id) {

    const element =
      document.getElementById(
        id
      );


    if (element) {

      element.addEventListener(
        "input",
        calc
      );

    }

  }
);


calc();


/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

window.addEventListener(
  "scroll",
  function () {

    const progress =
      document.querySelector(
        ".progress, #scrollProgress"
      );


    if (!progress) {
      return;
    }


    const height =
      document.documentElement
        .scrollHeight -
      window.innerHeight;


    const percentage =
      height > 0
        ? (
            window.scrollY /
            height
          ) * 100
        : 0;


    progress.style.width =
      percentage + "%";

  }
);


/* =========================================================
   ESCAPE CLOSES MODAL
   ========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape"
    ) {

      closeModal();

    }

  }
);


/* =========================================================
   CLICK OUTSIDE MODAL
   ========================================================= */

document.addEventListener(
  "click",
  function (event) {

    const modal =
      document.getElementById(
        "modal"
      );


    if (!modal) return;


    if (
      event.target === modal
    ) {

      closeModal();

    }

  }
);
