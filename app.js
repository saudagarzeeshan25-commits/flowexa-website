/* =========================================================
   FLOWEXA
   Google Sheets + Resources + Calculator + Score + Cal.com
   ========================================================= */

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbweN1Y4g86OuTwJUwf1N3D65tJX5awpE5MG1ElSuOoaa3IaXGzWliPeApWr0D1Z-xveJg/exec";

const CAL_LINK =
  "https://cal.com/saudagar-zeeshan-sttyxl/30min";


/* =========================================================
   RESOURCE DATA
   ========================================================= */

const RESOURCE_META = {

  playbook: {

    title:
      "The Booked Job Playbook™",

    kicker:
      "FREE PDF — THE BOOKED JOB PLAYBOOK™",

    description:
      "A step-by-step operating system for tightening an already-growing home-service business.",

    file:
      "booked-job-playbook.pdf"

  },


  recovery: {

    title:
      "Revenue Recovery Map™",

    kicker:
      "FREE PDF — REVENUE RECOVERY MAP™",

    description:
      "A practical map for finding money already sitting in missed calls, unsold estimates, no-shows and dormant opportunities.",

    file:
      "revenue-recovery-map.pdf"

  },


  followup: {

    title:
      "Lead Follow-Up Sequence™",

    kicker:
      "FREE PDF — LEAD FOLLOW-UP SEQUENCE™",

    description:
      "A stage-based follow-up operating system for serious opportunities.",

    file:
      "lead-follow-up-sequence.pdf"

  },


  receptionist: {

    title:
      "AI Front Desk Blueprint™",

    kicker:
      "FREE PDF — AI FRONT DESK BLUEPRINT™",

    description:
      "A practical guide to where AI can handle work and where human escalation still matters.",

    file:
      "ai-receptionist-blueprint.pdf"

  }

};


/* =========================================================
   MODAL
   ========================================================= */

function getModal() {

  return document.getElementById(
    "modal"
  );

}


function getModalContent() {

  return document.getElementById(
    "modalContent"
  );

}


function setModalContent(html) {

  const content =
    getModalContent();

  if (!content) {

    console.error(
      "modalContent not found."
    );

    return;
  }


  content.innerHTML = `

    <button
      class="close"
      type="button"
      aria-label="Close"
      onclick="closeModal()"
    >
      ×
    </button>

    ${html}

  `;

}


function showModal(html) {

  const modal =
    getModal();

  if (!modal) {

    console.error(
      "modal not found."
    );

    return;
  }


  setModalContent(
    html
  );


  modal.classList.add(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "modal-open"
  );

}


function closeModal() {

  const modal =
    getModal();

  if (!modal) {
    return;
  }


  modal.classList.remove(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "modal-open"
  );

}


function openModal(type) {

  if (
    type === "pilot"
  ) {

    openPilotModal();

    return;
  }


  if (
    type === "audit"
  ) {

    openScore();

    return;
  }


  if (
    type === "calcLead"
  ) {

    openCalculatorLeadModal();

    return;
  }


  console.error(
    "Unknown modal type:",
    type
  );

}


/* =========================================================
   CAL.COM
   ========================================================= */

let calLoading =
  false;

let calReady =
  false;


function loadCalScript(callback) {

  if (
    window.Cal &&
    typeof window.Cal ===
      "function"
  ) {

    calReady = true;

    callback();

    return;
  }


  const existing =
    document.querySelector(
      'script[src="https://app.cal.com/embed/embed.js"]'
    );


  if (existing) {

    waitForCal(
      callback
    );

    return;
  }


  if (calLoading) {

    waitForCal(
      callback
    );

    return;
  }


  calLoading =
    true;


  const script =
    document.createElement(
      "script"
    );


  script.src =
    "https://app.cal.com/embed/embed.js";


  script.async =
    true;


  script.onload =
    function () {

      waitForCal(
        callback
      );

    };


  script.onerror =
    function () {

      calLoading =
        false;

      showCalFallback();

    };


  document.head.appendChild(
    script
  );

}


function waitForCal(
  callback
) {

  let attempts =
    0;


  const timer =
    setInterval(
      function () {

        attempts++;


        if (
          window.Cal &&
          typeof window.Cal ===
            "function"
        ) {

          clearInterval(
            timer
          );


          calReady =
            true;


          calLoading =
            false;


          callback();


          return;
        }


        if (
          attempts >= 50
        ) {

          clearInterval(
            timer
          );


          calLoading =
            false;


          showCalFallback();

        }

      },
      200
    );

}


function initializeCal() {

  const target =
    document.getElementById(
      "flowexaCalEmbed"
    );


  if (
    !target ||
    !window.Cal
  ) {

    return;
  }


  target.innerHTML =
    "";


  try {

    window.Cal(
      "init",
      {
        origin:
          "https://app.cal.com"
      }
    );


    window.Cal(
      "inline",
      {
        elementOrSelector:
          "#flowexaCalEmbed",

        calLink:
          "saudagar-zeeshan-sttyxl/30min",

        config: {

          layout:
            "month_view",

          theme:
            "light"

        }

      }
    );


    /*
     * UI configuration.
     */

    try {

      window.Cal(
        "ui",
        {
          styles: {
            branding: {
              brandColor:
                "#1d68f2"
            }
          },

          hideEventTypeDetails:
            false

        }
      );

    } catch (
      uiError
    ) {

      console.warn(
        "Cal UI configuration skipped:",
        uiError
      );

    }


  } catch (
    error
  ) {

    console.error(
      "Cal.com embed error:",
      error
    );


    showCalFallback();

  }

}


function showCalFallback() {

  const target =
    document.getElementById(
      "flowexaCalEmbed"
    );


  if (!target) {
    return;
  }


  target.innerHTML = `

    <div
      class="cal-loading cal-error"
    >

      <strong>
        Calendar could not load inside the website.
      </strong>

      <a
        href="${CAL_LINK}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open Calendar in New Tab →
      </a>

    </div>

  `;

}


function openCal() {

  showModal(`

    <div class="eyebrow">
      FLOWEXA STRATEGY CALL
    </div>


    <h2>
      Book a Strategy Call.
    </h2>


    <p>
      Choose an available time below
      without leaving the Flowexa website.
    </p>


    <div
      class="cal-wrap"
    >

      <div
        id="flowexaCalEmbed"
        class="cal-inline"
      >

        <div
          class="cal-loading"
        >
          Loading the calendar…
        </div>

      </div>

    </div>


    <div
      class="cal-actions"
    >

      <a
        class="btn outline"
        href="${CAL_LINK}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open Calendar in New Tab →
      </a>

    </div>

  `);


  loadCalScript(
    initializeCal
  );

}


/* =========================================================
   GOOGLE SHEETS
   ========================================================= */

async function postLead(
  data
) {

  try {

    await fetch(
      ENDPOINT,
      {

        method:
          "POST",

        mode:
          "no-cors",

        headers: {

          "Content-Type":
            "text/plain;charset=utf-8"

        },

        body:
          JSON.stringify(
            data
          )

      }
    );


    /*
     * no-cors returns an opaque
     * response. The request has
     * still been sent.
     */

    return true;


  } catch (
    error
  ) {

    console.error(
      "Lead submission error:",
      error
    );


    return false;

  }

}


/* =========================================================
   FORM DATA
   ========================================================= */

function getFormData(
  form
) {

  return Object.fromEntries(
    new FormData(
      form
    ).entries()
  );

}


function normalizeLead(
  form,
  type,
  extras = {}
) {

  const raw =
    getFormData(
      form
    );


  return {

    type:
      type || "",

    name:
      raw.name ||
      raw.fullName ||
      "",

    email:
      raw.email ||
      "",

    phone:
      raw.phone ||
      "",

    company:
      raw.company ||
      raw.business ||
      "",

    website:
      raw.website ||
      "",

    businessType:
      raw.businessType ||
      raw.industry ||
      "",

    problem:
      raw.problem ||
      raw.challenge ||
      raw.details ||
      raw.message ||
      "",

    resource:
      raw.resource ||
      "",

    source:
      raw.source ||
      "Flowexa Website",

    details:
      raw.details ||
      "",

    ...extras

  };

}


/* =========================================================
   FREE PILOT
   ========================================================= */

function openPilotModal() {

  showModal(`

    <div class="eyebrow">
      FREE PILOT
    </div>


    <h2>
      Apply for the Flowexa Free Pilot.
    </h2>


    <p>
      Tell us a little about your business
      and the bottleneck you want to improve.
    </p>


    <form
      id="pilotForm"
      class="resource-form"
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
            Kitchen Remodeling
          </option>

          <option>
            Interior Design
          </option>

          <option>
            Med Spa
          </option>

          <option>
            Electrical
          </option>

          <option>
            Other Home Service
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
            Missed calls / slow response
          </option>

          <option>
            Lead qualification
          </option>

          <option>
            Appointment booking
          </option>

          <option>
            Follow-up
          </option>

          <option>
            Old lead reactivation
          </option>

          <option>
            Reporting / visibility
          </option>

          <option>
            Other
          </option>

        </select>

      </label>


      <label class="wide">

        Tell us what is happening today

        <textarea
          name="details"
          rows="4"
          placeholder="What happens from the moment a lead contacts you until the job is booked?"
        ></textarea>

      </label>


      <button
        class="btn blue glow"
        type="submit"
      >
        Submit Free Pilot Application →
      </button>


      <p
        id="pilotStatus"
        class="small wide"
        aria-live="polite"
      ></p>

    </form>

  `);


  const form =
    document.getElementById(
      "pilotForm"
    );


  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    async function(
      event
    ) {

      event.preventDefault();


      const button =
        form.querySelector(
          'button[type="submit"]'
        );


      const status =
        document.getElementById(
          "pilotStatus"
        );


      if (button) {

        button.disabled =
          true;

        button.textContent =
          "Submitting…";

      }


      if (status) {

        status.textContent =
          "Sending your application…";

      }


      const ok =
        await postLead(

          normalizeLead(
            form,
            "free-pilot"
          )

        );


      if (ok) {

        setModalContent(`

          <div class="eyebrow">
            FREE PILOT
          </div>

          <h2>
            Application received.
          </h2>

          <p>
            Your information has been
            submitted successfully.
          </p>

          <div class="actions">

            <button
              class="btn blue glow"
              onclick="openCal()"
              type="button"
            >
              Book a Strategy Call →
            </button>

            <button
              class="btn outline"
              onclick="closeModal()"
              type="button"
            >
              Done
            </button>

          </div>

        `);

      } else {

        if (status) {

          status.textContent =
            "Something went wrong. Please try again.";

        }


        if (button) {

          button.disabled =
            false;

          button.textContent =
            "Submit Free Pilot Application →";

        }

      }

    }
  );

}


/* =========================================================
   PDF RESOURCES
   ========================================================= */

function openPdfGate(
  key
) {

  openResource(
    key
  );

}


function openResource(
  key
) {

  const resource =
    RESOURCE_META[key];


  if (!resource) {

    console.error(
      "Unknown resource:",
      key
    );

    return;

  }


  showModal(`

    <div class="eyebrow">
      ${resource.kicker}
    </div>


    <h2>
      Get the full operating guide.
    </h2>


    <p>
      ${resource.description}
      Enter your details once.
      The PDF will become available
      immediately after submission.
    </p>


    <form
      id="resourceForm"
      class="resource-form"
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
          <option>Kitchen Remodeling</option>
          <option>Interior Design</option>
          <option>Med Spa</option>
          <option>Electrical</option>
          <option>Other Home Service</option>

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


      <div class="wide note">

        Required fields are intentional.
        This gives Flowexa enough context
        to follow up with something relevant.

      </div>


      <button
        class="btn blue glow"
        id="resourceSubmit"
        type="submit"
      >
        Download My PDF →
      </button>


      <p
        id="resourceStatus"
        class="small wide"
        aria-live="polite"
      ></p>

    </form>

  `);


  const form =
    document.getElementById(
      "resourceForm"
    );


  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    function(
      event
    ) {

      submitResource(
        event,
        key
      );

    }
  );

}


async function submitResource(
  event,
  key
) {

  event.preventDefault();


  const form =
    event.target;


  const button =
    document.getElementById(
      "resourceSubmit"
    );


  const status =
    document.getElementById(
      "resourceStatus"
    );


  if (button) {

    button.disabled =
      true;

    button.textContent =
      "Submitting…";

  }


  if (status) {

    status.textContent =
      "Submitting your information…";

  }


  const data =
    normalizeLead(
      form,
      "resource-download"
    );


  const ok =
    await postLead(
      data
    );


  const resource =
    RESOURCE_META[key];


  if (!ok) {

    if (status) {

      status.textContent =
        "Something went wrong. Please try again.";

    }


    if (button) {

      button.disabled =
        false;

      button.textContent =
        "Download My PDF →";

    }


    return;

  }


  setModalContent(`

    <div class="eyebrow">
      ${resource.kicker}
    </div>


    <h2>
      Your guide is ready.
    </h2>


    <p>
      Your information has been
      submitted successfully.
    </p>


    <div class="actions">

      <a
        class="btn blue glow"
        href="${resource.file}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open / Download the PDF →
      </a>


      <button
        class="btn outline"
        onclick="openCal()"
        type="button"
      >
        Book a Strategy Call →
      </button>

    </div>


    <p class="micro">
      The PDF will open in a new browser tab.
    </p>

  `);

}


/* =========================================================
   BOOKED JOB SCORE
   ========================================================= */

function openScore() {

  showModal(`

    <div class="eyebrow">
      60-SECOND DIAGNOSTIC — BOOKED JOB SCORE™
    </div>


    <h2>
      Find your biggest lead-to-booking
      gaps in about a minute.
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

        1. How quickly do you normally
        respond to a new lead? *

        <select
          required
          name="responseTime"
        >

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

        <select
          required
          name="missedCall"
        >

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

        <select
          required
          name="estimateFollowup"
        >

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

        <select
          required
          name="leadTracking"
        >

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

        <select
          required
          name="leadHandling"
        >

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

        6. How often do leads go cold
        without a clear next step? *

        <select
          required
          name="coldLeads"
        >

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

        7. How clearly can you see
        where leads are being lost? *

        <select
          required
          name="visibility"
        >

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

        <select
          required
          name="priority"
        >

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
          class="btn blue glow"
          id="scoreSubmit"
          type="submit"
        >
          See My Score →
        </button>

      </div>


      <p
        id="scoreStatus"
        class="small wide"
        aria-live="polite"
      ></p>

    </form>

  `);


  const form =
    document.getElementById(
      "scoreForm"
    );


  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    submitScore
  );

}


async function submitScore(
  event
) {

  event.preventDefault();


  const form =
    event.target;


  const button =
    document.getElementById(
      "scoreSubmit"
    );


  const status =
    document.getElementById(
      "scoreStatus"
    );


  const answers =
    getFormData(
      form
    );


  if (button) {

    button.disabled =
      true;

    button.textContent =
      "Calculating…";

  }


  if (status) {

    status.textContent =
      "Calculating your score…";

  }


  let score = 0;


  const scoring =
    Object.values(
      answers
    );


  scoring.forEach(
    function(value) {

      const text =
        String(
          value
        ).toLowerCase();


      if (

        text.includes(
          "within 5"
        ) ||

        text.includes(
          "immediately"
        ) ||

        text.includes(
          "every estimate"
        ) ||

        text.includes(
          "centralized"
        ) ||

        text.includes(
          "dedicated"
        ) ||

        text ===
          "rarely" ||

        text.includes(
          "very clearly"
        )

      ) {

        score += 2;

      } else {

        score += 1;

      }

    }
  );


  const submitted =
    await postLead({

      type:
        "booked-job-score",

      name:
        "",

      email:
        "",

      businessType:
        "",

      problem:
        answers.priority ||
        "",

      resource:
        "booked-job-score",

      source:
        "Flowexa Website",

      score:
        score,

      auditData:
        answers

    });


  let title =
    "";

  let description =
    "";


  if (
    score >= 13
  ) {

    title =
      "Strong foundation.";

    description =
      "Your core lead-to-booking process appears relatively structured. The biggest opportunity is likely optimization rather than rebuilding the entire process.";

  } else if (
    score >= 9
  ) {

    title =
      "There are meaningful gaps.";

    description =
      "Your process has some structure, but several handoffs or follow-up points may be costing you booked jobs.";

  } else {

    title =
      "There is significant leakage.";

    description =
      "Your answers suggest inconsistent response, tracking or follow-up may be creating avoidable lead-to-booking losses.";

  }


  setModalContent(`

    <div class="eyebrow">
      BOOKED JOB SCORE™
    </div>


    <div class="big-number">
      ${score}/16
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


    <div class="actions">

      <button
        class="btn blue glow"
        onclick="openCal()"
        type="button"
      >
        Book a Strategy Call →
      </button>


      <button
        class="btn outline"
        onclick="closeModal()"
        type="button"
      >
        Done
      </button>

    </div>

  `);

}


/* =========================================================
   REVENUE LEAK CALCULATOR
   ========================================================= */

function getLeakValue() {

  const missed =
    Number(
      document.getElementById(
        "missed"
      )?.value
    ) || 0;


  const rate =
    Number(
      document.getElementById(
        "rate"
      )?.value
    ) || 0;


  const job =
    Number(
      document.getElementById(
        "job"
      )?.value
    ) || 0;


  const safeRate =
    Math.min(
      100,
      Math.max(
        0,
        rate
      )
    ) / 100;


  return (
    Math.max(
      0,
      missed
    ) *
    safeRate *
    Math.max(
      0,
      job
    )
  );

}


function calcLeak() {

  const revenue =
    getLeakValue();


  const result =
    document.getElementById(
      "calcresult"
    );


  if (!result) {
    return revenue;
  }


  const number =
    result.querySelector(
      ".big-number"
    );


  if (number) {

    number.textContent =
      revenue.toLocaleString(
        "en-US",
        {
          style:
            "currency",

          currency:
            "USD",

          maximumFractionDigits:
            0

        }
      );

  }


  const bar =
    result.querySelector(
      ".leak-bar span"
    );


  if (bar) {

    const rate =
      Number(
        document.getElementById(
          "rate"
        )?.value
      ) || 0;


    const width =
      Math.min(
        100,
        Math.max(
          8,
          rate
        )
      );


    bar.style.width =
      width +
      "%";

  }


  return revenue;

}


/*
 * IMPORTANT:
 * Calculator does NOT auto-calculate.
 * The website HTML button should call:
 *
 * calcLeak()
 *
 * when clicked.
 */


/* =========================================================
   EMAIL CALCULATOR ANALYSIS
   ========================================================= */

function openCalculatorLeadModal() {

  const currentRevenue =
    getLeakValue();


  const missedCalls =
    Number(
      document.getElementById(
        "missed"
      )?.value
    ) || 0;


  const bookingRate =
    Number(
      document.getElementById(
        "rate"
      )?.value
    ) || 0;


  const averageJobValue =
    Number(
      document.getElementById(
        "job"
      )?.value
    ) || 0;


  showModal(`

    <div class="eyebrow">
      REVENUE LEAK CALCULATOR™
    </div>


    <h2>
      Email me this analysis.
    </h2>


    <p>
      Your current estimate is
      <strong>
        ${currentRevenue.toLocaleString(
          "en-US",
          {
            style:
              "currency",

            currency:
              "USD",

            maximumFractionDigits:
              0
          }
        )}
      </strong>
      of potential monthly revenue at risk.
    </p>


    <form
      id="calcLeadForm"
      class="resource-form"
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


      <button
        class="btn blue glow"
        id="calcEmailSubmit"
        type="submit"
      >
        Send My Analysis →
      </button>


      <p
        id="calcLeadStatus"
        class="small wide"
        aria-live="polite"
      ></p>

    </form>

  `);


  const form =
    document.getElementById(
      "calcLeadForm"
    );


  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    async function(
      event
    ) {

      event.preventDefault();


      const button =
        document.getElementById(
          "calcEmailSubmit"
        );


      const status =
        document.getElementById(
          "calcLeadStatus"
        );


      if (button) {

        button.disabled =
          true;

        button.textContent =
          "Sending…";

      }


      if (status) {

        status.textContent =
          "Sending your analysis…";

      }


      const data =
        normalizeLead(

          form,

          "calculator-lead",

          {

            problem:
              "Revenue leak calculator",

            resource:
              "revenue-leak-calculator",

            source:
              "Flowexa Website",

            calculatedRevenue:
              currentRevenue,

            missedCalls:
              missedCalls,

            bookingRate:
              bookingRate,

            averageJobValue:
              averageJobValue

          }

        );


      const ok =
        await postLead(
          data
        );


      if (ok) {

        setModalContent(`

          <div class="eyebrow">
            REVENUE LEAK CALCULATOR™
          </div>


          <h2>
            Analysis sent.
          </h2>


          <p>
            Your analysis has been submitted
            and the email should arrive shortly.
          </p>


          <p class="micro">
            Check your inbox and spam/junk folder
            if you do not see it immediately.
          </p>


          <div class="actions">

            <button
              class="btn blue glow"
              onclick="openCal()"
              type="button"
            >
              Book a Strategy Call →
            </button>


            <button
              class="btn outline"
              onclick="closeModal()"
              type="button"
            >
              Done
            </button>

          </div>

        `);

      } else {

        if (status) {

          status.textContent =
            "Something went wrong. Please try again.";

        }


        if (button) {

          button.disabled =
            false;

          button.textContent =
            "Send My Analysis →";

        }

      }

    }
  );

}


/* =========================================================
   MAIN CONTACT FORM
   ========================================================= */

function submitLead(
  event,
  type
) {

  event.preventDefault();


  const form =
    event.target;


  const status =
    document.getElementById(
      "contactStatus"
    ) ||
    document.getElementById(
      "formStatus"
    );


  const button =
    form.querySelector(
      'button[type="submit"]'
    );


  if (button) {

    button.disabled =
      true;

    button.textContent =
      "Sending…";

  }


  if (status) {

    status.textContent =
      "Sending your request…";

  }


  postLead(

    normalizeLead(
      form,
      type ||
        "contact"
    )

  )

  .then(
    function(ok) {

      if (ok) {

        if (status) {

          status.textContent =
            "Request received. We'll review the information and follow up.";

        }


        form.reset();

      } else {

        if (status) {

          status.textContent =
            "Something went wrong. Please try again or book a strategy call directly.";

        }

      }


      if (button) {

        button.disabled =
          false;

        button.textContent =
          "Send Request →";

      }

    }
  );

}


/* =========================================================
   MENU
   ========================================================= */

function toggleMenu() {

  const nav =
    document.getElementById(
      "navLinks"
    );


  if (nav) {

    nav.classList.toggle(
      "open"
    );

  }

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    const modal =
      document.getElementById(
        "modal"
      );


    if (modal) {

      modal.addEventListener(
        "click",
        function(event) {

          if (
            event.target ===
            modal
          ) {

            closeModal();

          }

        }
      );

    }


    /*
     * Calculator button compatibility.
     * Supports the existing HTML IDs.
     */

    const calculatorButton =
      document.getElementById(
        "calculateLeak"
      );


    if (
      calculatorButton
    ) {

      calculatorButton.addEventListener(
        "click",
        function(event) {

          event.preventDefault();

          calcLeak();

        }
      );

    }

  }
);


/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

window.addEventListener(
  "scroll",
  function() {

    const progress =
      document.getElementById(
        "scrollProgress"
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
      percentage +
      "%";

  }
);


/* =========================================================
   ESCAPE CLOSES MODAL
   ========================================================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key ===
      "Escape"
    ) {

      closeModal();

    }

  }
);
