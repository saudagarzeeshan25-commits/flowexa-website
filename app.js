/* =========================================================
   FLOWEXA WEBSITE — APP.JS
   ========================================================= */

const CAL_URL =
  "https://cal.com/saudagar-zeeshan-sttyxl/30min";

const CONFIG = {
  SHEET_WEBHOOK_URL:
    "https://script.google.com/macros/s/AKfycbweN1Y4g86OuTwJUwf1N3D65tJX5awpE5MG1ElSuOoaa3IaXGzWliPeApWr0D1Z-xveJg/exec"
};

const PDFS = {
  playbook: "booked-job-playbook.pdf",
  recovery: "revenue-recovery-map.pdf",
  followup: "lead-follow-up-sequence.pdf",
  receptionist: "ai-receptionist-blueprint.pdf"
};

let pendingPdf = "";
let auditAnswers = [];


/* =========================================================
   MODAL HELPERS
   ========================================================= */

function openModalShell() {
  const modal = document.getElementById("modal");

  if (!modal) {
    console.error("Flowexa: #modal not found.");
    return;
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}


function closeModal() {
  const modal = document.getElementById("modal");

  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}


/* =========================================================
   STRATEGY CALL
   ========================================================= */

function openCal() {
  const content = document.getElementById("modalContent");

  if (!content) {
    console.error("Flowexa: #modalContent not found.");
    return;
  }

  content.innerHTML = `
    <button class="close" onclick="closeModal()" aria-label="Close">
      ×
    </button>

    <div class="eyebrow">
      Flowexa Strategy Call
    </div>

    <h2>
      Let's find the highest-value leak first.
    </h2>

    <p class="small">
      Choose a time that works. If the calendar cannot load
      in the preview, use the button below to open Cal.com directly.
    </p>

    <div class="cal-wrap">
      <iframe
        src="${CAL_URL}?embed=true"
        title="Book a Flowexa Strategy Call"
        loading="lazy">
      </iframe>
    </div>

    <div style="margin-top:13px">
      <a
        class="btn outline"
        href="${CAL_URL}"
        target="_blank"
        rel="noopener">
        Open Cal.com directly →
      </a>
    </div>
  `;

  openModalShell();
}


/* =========================================================
   PDF DOWNLOAD GATE
   ========================================================= */

function openPdfGate(type) {

  if (!PDFS[type]) {
    console.error("Flowexa: Unknown PDF type:", type);
    return;
  }

  pendingPdf = type;

  const names = {
    playbook: "The Booked Job Playbook™",
    recovery: "Revenue Recovery Map™",
    followup: "Lead Follow-Up Sequence™",
    receptionist: "AI Front Desk Blueprint™"
  };

  const content = document.getElementById("modalContent");

  if (!content) {
    console.error("Flowexa: #modalContent not found.");
    return;
  }

  content.innerHTML = `
    <button class="close" onclick="closeModal()" aria-label="Close">
      ×
    </button>

    <div class="eyebrow">
      Free PDF — ${names[type]}
    </div>

    <h2>
      Get the full operating guide.
    </h2>

    <p class="small">
      Enter your details once. The PDF will download immediately
      after submission. Your information is used so Flowexa can
      follow up with the resource and understand which problem
      you care about.
    </p>

    <form onsubmit="submitPdfLead(event)">

      <div class="formgrid">

        <div class="field">
          <label>Full name *</label>
          <input
            name="name"
            autocomplete="name"
            required>
        </div>

        <div class="field">
          <label>Business email *</label>
          <input
            name="email"
            type="email"
            autocomplete="email"
            required>
        </div>

        <div class="field">
          <label>Business name *</label>
          <input
            name="company"
            autocomplete="organization"
            required>
        </div>

        <div class="field">
          <label>Website *</label>
          <input
            name="website"
            type="url"
            placeholder="https://"
            required>
        </div>

        <div class="field">
          <label>Business type *</label>

          <select name="businessType" required>
            <option value="">Select one</option>
            <option>Roofing</option>
            <option>HVAC</option>
            <option>Plumbing</option>
            <option>Kitchen Remodeling</option>
            <option>Interior Design</option>
            <option>Med Spa</option>
            <option>Electrical</option>
            <option>Other Home Service</option>
          </select>
        </div>

        <div class="field">
          <label>Biggest focus right now *</label>

          <select name="challenge" required>
            <option value="">Select one</option>
            <option>Convert more existing leads</option>
            <option>Recover missed calls / old opportunities</option>
            <option>Improve follow-up</option>
            <option>Automate operations</option>
            <option>Implement AI safely</option>
            <option>Owner visibility / reporting</option>
          </select>
        </div>

      </div>

      <div
        class="note"
        style="margin-top:13px">

        Required fields are intentional:
        this lets Flowexa send the right follow-up
        instead of generic marketing.

      </div>

      <button
        class="btn blue glow"
        style="margin-top:18px"
        type="submit">

        Download My PDF →

      </button>

      <div
        class="pdf-status small"
        aria-live="polite"
        style="margin-top:10px">
      </div>

    </form>
  `;

  openModalShell();
}


/* =========================================================
   PDF SUBMISSION
   ========================================================= */

async function submitPdfLead(event) {

  event.preventDefault();

  const form = event.target;

  const data =
    Object.fromEntries(
      new FormData(form).entries()
    );

  data.type = "pdf-download";
  data.resource = pendingPdf;
  data.page = window.location.pathname;

  const pdfPath = PDFS[pendingPdf];

  const status =
    form.querySelector(".pdf-status");

  const button =
    form.querySelector("button[type='submit']");

  if (status) {
    status.textContent =
      "Sending your information…";
  }

  if (button) {
    button.disabled = true;
    button.textContent = "Submitting…";
  }

  const success = await sendLead(data);

  if (!success) {

    if (status) {
      status.textContent =
        "We couldn't submit your information. Please try again.";
    }

    if (button) {
      button.disabled = false;
      button.textContent = "Download My PDF →";
    }

    return;
  }

  if (status) {
    status.textContent =
      "Submission received. Starting your PDF…";
  }

  /*
   * Give the browser a moment to hand the Google
   * Apps Script request to the hidden iframe.
   */

  setTimeout(function () {

    closeModal();

    const downloadUrl =
      new URL(
        pdfPath,
        window.location.href
      ).href;

    const link =
      document.createElement("a");

    link.href = downloadUrl;
    link.download =
      pdfPath.split("/").pop();

    link.target = "_blank";
    link.rel = "noopener";

    document.body.appendChild(link);

    link.click();

    link.remove();

    toast("PDF download started.");

  }, 500);
}


/* =========================================================
   GOOGLE SHEETS SUBMISSION
   ========================================================= */

async function sendLead(data) {

  const payload = {

    source: "Flowexa website",

    ...data,

    business:
      data.business ||
      data.company ||
      "",

    industry:
      data.industry ||
      data.businessType ||
      data.typeOfBusiness ||
      data.type ||
      "",

    problem:
      data.problem ||
      data.challenge ||
      data.details ||
      data.message ||
      data.process ||
      data.leak ||
      "",

    resource:
      data.resource ||
      "",

    createdAt:
      new Date().toISOString()

  };


  const endpoint =
    CONFIG.SHEET_WEBHOOK_URL;


  if (!endpoint) {

    console.error(
      "Flowexa: Google Apps Script URL is missing."
    );

    return false;
  }


  try {

    /*
     * Google Apps Script redirects POST requests.
     * A native form POST inside a hidden iframe avoids
     * the CORS problem that happens with fetch().
     */

    const frameName =
      "flowexa_submit_" +
      Date.now();


    const iframe =
      document.createElement("iframe");

    iframe.name = frameName;
    iframe.style.display = "none";

    document.body.appendChild(iframe);


    const form =
      document.createElement("form");

    form.method = "POST";
    form.action = endpoint;
    form.target = frameName;
    form.style.display = "none";


    Object.entries(payload).forEach(
      function ([key, value]) {

        const input =
          document.createElement("input");

        input.type = "hidden";
        input.name = key;

        if (Array.isArray(value)) {

          input.value =
            JSON.stringify(value);

        } else if (
          typeof value === "object" &&
          value !== null
        ) {

          input.value =
            JSON.stringify(value);

        } else {

          input.value =
            String(value ?? "");

        }

        form.appendChild(input);
      }
    );


    document.body.appendChild(form);

    form.submit();


    /*
     * We cannot read the Google Apps Script response
     * because it is cross-origin.
     *
     * The successful form.submit() means the browser
     * handed the request to the endpoint.
     */

    setTimeout(
      function () {

        form.remove();
        iframe.remove();

      },
      8000
    );


    return true;


  } catch (error) {

    console.error(
      "Flowexa lead submission failed:",
      error
    );

    return false;
  }
}


/* =========================================================
   GENERAL MODALS
   ========================================================= */

function openModal(type) {

  const content =
    document.getElementById("modalContent");


  if (!content) {

    console.error(
      "Flowexa: #modalContent not found."
    );

    return;
  }


  content.innerHTML =
    `<button
       class="close"
       onclick="closeModal()"
       aria-label="Close">
       ×
     </button>`;


  /* ---------------- PILOT ---------------- */

  if (type === "pilot") {

    content.innerHTML += `

      <div class="eyebrow">
        Free Pilot
      </div>

      <h2>
        Apply for the Flowexa Free Pilot.
      </h2>

      <p class="small">
        We are not looking for a perfect business.
        We are looking for a real process where fixing
        one bottleneck could create meaningful value.
      </p>

      <form
        onsubmit="submitLead(event,'pilot')">

        <div class="formgrid">

          <div class="field">
            <label>First name *</label>
            <input
              name="firstName"
              required>
          </div>

          <div class="field">
            <label>Last name *</label>
            <input
              name="lastName"
              required>
          </div>

          <div class="field">
            <label>Business email *</label>
            <input
              name="email"
              type="email"
              required>
          </div>

          <div class="field">
            <label>Company *</label>
            <input
              name="company"
              required>
          </div>

          <div class="field">
            <label>Website *</label>
            <input
              name="website"
              type="url"
              placeholder="https://"
              required>
          </div>

          <div class="field">

            <label>Business type *</label>

            <select name="businessType" required>

              <option value="">
                Select one
              </option>

              <option>Roofing</option>
              <option>HVAC</option>
              <option>Plumbing</option>
              <option>Kitchen Remodeling</option>
              <option>Interior Design</option>
              <option>Med Spa</option>
              <option>Other Home Service</option>

            </select>

          </div>

          <div class="field full">

            <label>
              What would you most like fixed? *
            </label>

            <textarea
              name="challenge"
              rows="4"
              required
              placeholder="Missed calls, slow response, estimates, follow-up, booking, etc.">
            </textarea>

          </div>

        </div>

        <button
          class="btn blue glow"
          style="margin-top:18px"
          type="submit">

          Submit Pilot Application →

        </button>

        <div
          class="form-status small"
          aria-live="polite"
          style="margin-top:12px">
        </div>

      </form>
    `;
  }


  /* ---------------- CALCULATOR LEAD ---------------- */

  if (type === "calcLead") {

    content.innerHTML += `

      <div class="eyebrow">
        Revenue Leak Calculator™
      </div>

      <h2>
        Send this analysis to me.
      </h2>

      <p class="small">
        We'll save the calculator inputs with your
        contact details so Flowexa can follow up
        with context instead of starting from zero.
      </p>

      <form onsubmit="submitCalcLead(event)">

        <div class="formgrid">

          <div class="field">
            <label>Full name *</label>
            <input name="name" required>
          </div>

          <div class="field">
            <label>Business email *</label>
            <input
              name="email"
              type="email"
              required>
          </div>

          <div class="field">
            <label>Business name *</label>
            <input
              name="company"
              required>
          </div>

          <div class="field">
            <label>Website *</label>
            <input
              name="website"
              type="url"
              placeholder="https://"
              required>
          </div>

        </div>

        <div
          class="note"
          style="margin-top:13px">

          Your calculator assumptions will be
          attached to the lead record automatically.

        </div>

        <button
          class="btn blue glow"
          style="margin-top:18px"
          type="submit">

          Save My Analysis →

        </button>

        <div
          class="form-status small"
          aria-live="polite"
          style="margin-top:12px">
        </div>

      </form>
    `;
  }


  /* ---------------- RECOVERY MAP ---------------- */

  if (type === "mapform") {

    content.innerHTML += `

      <div class="eyebrow">
        Revenue Recovery Map™
      </div>

      <h2>
        Give me the basics and map
        the biggest recovery opportunity.
      </h2>

      <p class="small">
        Required fields keep the map useful.
        Your submission will be saved for follow-up.
      </p>

      <form
        onsubmit="submitLead(event,'recovery-map')">

        <div class="formgrid">

          <div class="field">
            <label>Full name *</label>
            <input name="name" required>
          </div>

          <div class="field">
            <label>Business email *</label>
            <input
              name="email"
              type="email"
              required>
          </div>

          <div class="field">
            <label>Business name *</label>
            <input name="company" required>
          </div>

          <div class="field">
            <label>Website *</label>
            <input
              name="website"
              type="url"
              placeholder="https://"
              required>
          </div>

          <div class="field">

            <label>Business type *</label>

            <select name="businessType" required>

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

          </div>

          <div class="field">

            <label>
              Biggest suspected leak *
            </label>

            <select name="leak" required>

              <option value="">
                Select one
              </option>

              <option>Missed calls</option>
              <option>Slow lead response</option>
              <option>Appointment no-shows</option>
              <option>Unsold estimates</option>
              <option>Old leads</option>
              <option>Past customers</option>
              <option>Not sure</option>

            </select>

          </div>

          <div class="field full">

            <label>
              What happens after a new lead contacts you? *
            </label>

            <textarea
              name="process"
              rows="4"
              required
              placeholder="Briefly describe what happens from first contact to booked job.">
            </textarea>

          </div>

        </div>

        <button
          class="btn blue glow"
          style="margin-top:18px"
          type="submit">

          Request My Recovery Map →

        </button>

        <div
          class="form-status small"
          aria-live="polite"
          style="margin-top:12px">
        </div>

      </form>
    `;
  }


  /* ---------------- AUDIT ---------------- */

  if (type === "audit") {

    auditAnswers = [];

    content.innerHTML +=
      auditShell();

    openModalShell();

    /*
     * THIS IS THE IMPORTANT FIX.
     *
     * Previously the modal opened but renderAudit()
     * was not called, leaving the quiz empty.
     */

    renderAudit();

    return;
  }


  /* ---------------- PLAYBOOK ---------------- */

  if (type === "playbook") {
    content.innerHTML += playbookHTML();
  }


  /* ---------------- RECOVERY ---------------- */

  if (type === "recovery") {
    content.innerHTML += recoveryHTML();
  }


  /* ---------------- FOLLOW-UP ---------------- */

  if (type === "followup") {
    content.innerHTML += followupHTML();
  }


  /* ---------------- RECEPTIONIST ---------------- */

  if (type === "receptionist") {
    content.innerHTML += receptionistHTML();
  }


  openModalShell();
}


/* =========================================================
   BOOKED JOB PLAYBOOK
   ========================================================= */

function playbookHTML() {

  return `

    <div class="eyebrow">
      The Booked Job Playbook™
    </div>

    <h2>
      If I had to build a home-service
      business from zero today.
    </h2>

    <div class="resource-copy">

      <p>
        This is the order I would follow:
        <strong>
          market → offer → demand → response →
          sales → delivery → retention →
          measurement → automation.
        </strong>
        I would not start by buying software.
      </p>

      <div class="principle">
        <strong>Rule #1:</strong>
        Never automate a process you have not
        first made understandable and measurable.
      </div>


      <h3>
        Phase 1 — Pick a market where one job matters
      </h3>

      <ol>

        <li>
          Choose a service with meaningful ticket
          size and clear customer pain.
        </li>

        <li>
          Start with a tight service area so travel,
          scheduling and local reputation are manageable.
        </li>

        <li>
          Define the customer you want:
          property type, project size, urgency
          and buying trigger.
        </li>

        <li>
          Write down the jobs you will
          <em>not</em> take.
          Margin and capacity matter more
          than vanity lead volume.
        </li>

      </ol>


      <h3>
        Phase 2 — Build an offer people can
        understand in 10 seconds
      </h3>

      <ul>

        <li>
          Make the outcome obvious:
          what problem is solved, for whom,
          and what happens next.
        </li>

        <li>
          Reduce uncertainty with proof,
          process transparency, warranty/guarantee
          language where legitimate, and clear expectations.
        </li>

        <li>
          Give the prospect one obvious next step:
          call, estimate, inspection or consultation.
        </li>

      </ul>


      <h3>
        Phase 3 — Build the demand engine
      </h3>

      <p>
        Pick a small number of channels and learn
        them deeply. Local search, referrals, paid
        lead sources, partnerships and outbound can
        all work; the mistake is adding channels
        before you know your conversion economics.
      </p>

      <div class="scorecard">

        <div>
          <strong>Track</strong>
          <span>Leads by source</span>
        </div>

        <div>
          <strong>Track</strong>
          <span>Booked appointments</span>
        </div>

        <div>
          <strong>Track</strong>
          <span>Won revenue</span>
        </div>

      </div>


      <h3>
        Phase 4 — Win the speed-to-lead battle
      </h3>

      <ol>

        <li>
          Decide who owns every new inquiry.
        </li>

        <li>
          Set a response standard.
        </li>

        <li>
          Use an immediate acknowledgement
          when a human cannot respond.
        </li>

        <li>
          Recover missed calls instead of
          treating them as dead.
        </li>

        <li>
          Qualify before spending expensive sales time.
        </li>

      </ol>


      <h3>
        Phase 5 — Turn estimates into decisions
      </h3>

      <p>
        Every estimate should have a defined next step.
        Explain the recommendation, answer objections,
        give a realistic decision path, then follow up
        systematically. “Sent estimate” is not the
        same thing as “lost lead.”
      </p>


      <h3>
        Phase 6 — Build the follow-up machine
        before the AI machine
      </h3>

      <ul>
        <li>New inquiry sequence.</li>
        <li>Appointment reminder sequence.</li>
        <li>Estimate follow-up sequence.</li>
        <li>No-decision sequence.</li>
        <li>Past-customer reactivation sequence.</li>
      </ul>


      <h3>
        Phase 7 — Protect delivery and reputation
      </h3>

      <p>
        Top earners do not only sell well.
        They schedule capacity, communicate delays,
        document the work, collect reviews, ask for
        referrals and make the next purchase easy.
      </p>


      <h3>
        Phase 8 — Know your numbers
      </h3>

      <p>
        At minimum, know leads → appointments →
        estimates → wins → revenue → gross margin.
        Then ask:
        <strong>
          where does the largest drop happen?
        </strong>
        Fix the largest economic bottleneck first.
      </p>


      <h3>
        Phase 9 — Only now add AI and automation
      </h3>

      <ol>

        <li>
          Automate repetitive acknowledgement and routing.
        </li>

        <li>
          Automate data movement between tools.
        </li>

        <li>
          Use AI for structured qualification
          and information gathering.
        </li>

        <li>
          Use AI for follow-up where
          the business rules are clear.
        </li>

        <li>
          Use AI reception only after you know
          the correct scripts, escalation rules
          and booking logic.
        </li>

        <li>
          Keep humans in the loop for pricing
          exceptions, angry customers, safety issues,
          unusual jobs and anything outside the
          system's authority.
        </li>

      </ol>


      <div class="principle">

        <strong>The end state:</strong>
        a business where demand is captured,
        serious prospects are handled quickly,
        sales opportunities are followed up,
        delivery is consistent, and the owner
        can see the numbers without personally
        chasing every detail.

      </div>


      <h3>
        90-day order
      </h3>

      <p>

        <strong>Days 1–30:</strong>
        offer, lead sources, response process,
        qualification and basic tracking.

        <br>

        <strong>Days 31–60:</strong>
        estimate follow-up, appointment reminders,
        reactivation and reporting.

        <br>

        <strong>Days 61–90:</strong>
        automate the proven workflows,
        add controlled AI and remove
        repetitive owner work.

      </p>


      <div style="margin-top:25px">

        <button
          class="btn blue glow pulse"
          onclick="closeModal();openCal()">

          Want help applying this to your business?
          Book a Strategy Call →

        </button>

      </div>

    </div>
  `;
}


/* =========================================================
   REVENUE RECOVERY MAP
   ========================================================= */

function recoveryHTML() {

  return `

    <div class="eyebrow">
      Revenue Recovery Map™
    </div>

    <h2>
      Find the money already inside the business
      before buying more leads.
    </h2>

    <div class="resource-copy">

      <p>
        The fastest revenue opportunity is often
        not another lead source. It is the demand
        you already paid for but failed to convert,
        follow up with or reactivate.
      </p>


      <h3>
        Map the journey
      </h3>

      <ol>

        <li>
          <strong>New lead:</strong>
          How many inquiries arrive each month?
        </li>

        <li>
          <strong>Response:</strong>
          How many get a response quickly enough to matter?
        </li>

        <li>
          <strong>Qualification:</strong>
          How many are actually a fit?
        </li>

        <li>
          <strong>Appointment:</strong>
          How many qualified leads book?
        </li>

        <li>
          <strong>Show:</strong>
          How many appointments happen?
        </li>

        <li>
          <strong>Estimate:</strong>
          How many receive a clear proposal and next step?
        </li>

        <li>
          <strong>Decision:</strong>
          How many buy?
        </li>

        <li>
          <strong>Delivery:</strong>
          How many become reviews, referrals
          or repeat customers?
        </li>

      </ol>


      <h3>
        The eight recovery buckets
      </h3>

      <div class="scorecard">

        <div>
          <strong>Missed calls</strong>
          <span>Recover calls that already happened.</span>
        </div>

        <div>
          <strong>Slow leads</strong>
          <span>Reduce response delay.</span>
        </div>

        <div>
          <strong>No-shows</strong>
          <span>Confirm and recover appointments.</span>
        </div>

        <div>
          <strong>Unsold estimates</strong>
          <span>Follow up before intent disappears.</span>
        </div>

        <div>
          <strong>No-decisions</strong>
          <span>Give prospects a legitimate next step.</span>
        </div>

        <div>
          <strong>Dormant leads</strong>
          <span>Revisit old demand where appropriate.</span>
        </div>

        <div>
          <strong>Past customers</strong>
          <span>Find legitimate repeat work.</span>
        </div>

        <div>
          <strong>Referrals</strong>
          <span>Systematize the ask after a good outcome.</span>
        </div>

      </div>


      <h3>
        How I'd prioritize
      </h3>

      <p>
        Estimate
        <strong>
          volume × conversion gap × average job value
        </strong>.
        A small improvement in a high-ticket stage
        can be worth more than a large improvement
        in a low-value stage.
      </p>


      <div class="principle">

        <strong>Example:</strong>
        If 40 qualified estimates are sitting untouched
        and the average job is $5,000, the first question
        is not “How do we get more leads?”
        It is “Why are these 40 opportunities not
        being worked correctly?”

      </div>


      <h3>
        The 7-day recovery sprint
      </h3>

      <ol>

        <li>
          Export recent leads and estimates.
        </li>

        <li>
          Separate open, lost, no-response
          and no-decision opportunities.
        </li>

        <li>
          Call the highest-value open opportunities first.
        </li>

        <li>
          Start a structured follow-up sequence
          for the remainder.
        </li>

        <li>
          Review every missed-call process.
        </li>

        <li>
          Reactivate a small, relevant group
          of past customers.
        </li>

        <li>
          Measure recovered appointments and revenue,
          not just messages sent.
        </li>

      </ol>


      <h3>
        What to automate
      </h3>

      <p>
        Data collection, reminders, task creation,
        status changes, simple acknowledgements and
        reporting are strong automation candidates.
        Pricing disputes, complaints, unusual project
        scope and safety-sensitive issues should remain
        human-controlled.
      </p>


      <div style="margin-top:25px">

        <button
          class="btn blue glow pulse"
          onclick="closeModal();openModal('mapform')">

          Build My Revenue Recovery Map →

        </button>

      </div>

    </div>
  `;
}


/* =========================================================
   LEAD FOLLOW-UP
   ========================================================= */

function followupHTML() {

  return `

    <div class="eyebrow">
      Lead Follow-Up Sequence™
    </div>

    <h2>
      Follow up like a disciplined sales operation —
      not like a spam bot.
    </h2>

    <div class="resource-copy">

      <p>
        The sequence changes by stage. A homeowner
        who just requested an estimate should not
        receive the same message as someone who
        ignored a proposal for three weeks.
      </p>


      <h3>
        Sequence A — New inquiry that has not booked
      </h3>

      <ol>

        <li>
          <strong>Immediately:</strong>
          confirm receipt and make the next step obvious.
        </li>

        <li>
          <strong>Same day:</strong>
          answer the likely question or ask for
          the missing qualification detail.
        </li>

        <li>
          <strong>Day 2:</strong>
          short check-in; remove friction.
        </li>

        <li>
          <strong>Day 4–5:</strong>
          offer a concrete scheduling option.
        </li>

        <li>
          <strong>Day 8–10:</strong>
          final active follow-up, then move to
          a lower-frequency nurture state.
        </li>

      </ol>


      <h3>
        Sequence B — Estimate sent, no decision
      </h3>

      <ol>

        <li>
          <strong>24 hours:</strong>
          confirm they received it.
        </li>

        <li>
          <strong>Day 3:</strong>
          ask whether the project, scope or timing
          needs clarification.
        </li>

        <li>
          <strong>Day 7:</strong>
          surface the next decision:
          move forward, revise scope or revisit timing.
        </li>

        <li>
          <strong>Day 14:</strong>
          close the active loop politely.
        </li>

        <li>
          <strong>30–45 days:</strong>
          only if relevant, re-open the conversation
          based on season, project timing or
          a legitimate reason.
        </li>

      </ol>


      <h3>
        Sequence C — Dormant customer
      </h3>

      <p>
        Start from a real reason to contact them:
        seasonal maintenance, a related service,
        a warranty check, a legitimate upgrade
        opportunity or a useful reminder.
        Do not manufacture urgency.
      </p>


      <h3>
        The rules that make this work
      </h3>

      <ul>

        <li>
          Every message should have one job.
        </li>

        <li>
          Do not repeat the same
          “just following up” message five times.
        </li>

        <li>
          Stop when the prospect asks you to stop.
        </li>

        <li>
          Escalate replies to a human when intent,
          emotion or complexity changes.
        </li>

        <li>
          Use automation to preserve consistency,
          not to hide bad sales behavior.
        </li>

      </ul>


      <h3>
        Where AI helps
      </h3>

      <p>
        AI can classify intent, summarize replies,
        identify missing information, draft a response
        within approved boundaries and create a task
        for a salesperson. The business should still
        define the rules before AI is given authority.
      </p>


      <div style="margin-top:25px">

        <button
          class="btn blue glow pulse"
          onclick="closeModal();openCal()">

          Want this built into your process?
          Book a Strategy Call →

        </button>

      </div>

    </div>
  `;
}


/* =========================================================
   AI RECEPTIONIST
   ========================================================= */

function receptionistHTML() {

  return `

    <div class="eyebrow">
      AI Front Desk Blueprint™
    </div>

    <h2>
      Design the receptionist around business
      rules — not a chatbot prompt.
    </h2>

    <div class="resource-copy">

      <p>
        An AI receptionist is valuable when it
        reliably handles predictable work and
        knows when to stop. It should not pretend
        to be a human expert outside its authority.
      </p>


      <h3>
        1. Define the job
      </h3>

      <ul>

        <li>
          Answer common questions from approved information.
        </li>

        <li>
          Capture service, location, urgency
          and contact details.
        </li>

        <li>
          Check basic service-area fit.
        </li>

        <li>
          Route qualified inquiries toward booking.
        </li>

        <li>
          Create a clean handoff when
          a human is required.
        </li>

      </ul>


      <h3>
        2. Give it a knowledge boundary
      </h3>

      <p>
        Services offered, service area, hours,
        booking rules, emergency policy, common
        questions, cancellation rules and approved
        language. If the answer is not in the
        knowledge base, the system should say it
        needs a human rather than invent one.
      </p>


      <h3>
        3. Define escalation triggers
      </h3>

      <ul>

        <li>Angry or distressed customer</li>
        <li>Safety or emergency issue</li>
        <li>Pricing exception or negotiation</li>
        <li>Complex project scope</li>
        <li>Legal/insurance dispute</li>
        <li>Customer explicitly requests a person</li>

      </ul>


      <h3>
        4. Define qualification
      </h3>

      <p>
        Ask only what the business actually needs
        to decide the next step: service type,
        location, urgency, property/project basics,
        timing and contact information.
      </p>


      <h3>
        5. Define booking
      </h3>

      <p>
        Only offer appointments the business
        actually wants filled. Protect buffers,
        travel constraints, capacity and special
        requirements.
      </p>


      <h3>
        6. Measure it
      </h3>

      <div class="scorecard">

        <div>
          <strong>Containment</strong>
          <span>How many conversations are resolved?</span>
        </div>

        <div>
          <strong>Qualified</strong>
          <span>How many become real opportunities?</span>
        </div>

        <div>
          <strong>Booked</strong>
          <span>How many turn into appointments?</span>
        </div>

      </div>


      <div class="principle">

        <strong>Best use of AI:</strong>
        remove repetitive work while making the
        human handoff cleaner — not eliminate
        humans from situations that require judgment.

      </div>


      <div style="margin-top:25px">

        <button
          class="btn blue glow pulse"
          onclick="closeModal();openCal()">

          Want an AI front desk designed
          for your process?
          Book a Strategy Call →

        </button>

      </div>

    </div>
  `;
}


/* =========================================================
   BOOKED JOB SCORE
   ========================================================= */

function auditShell() {

  return `

    <div class="eyebrow">
      Booked Job Score™
    </div>

    <h2>
      Find your biggest lead-to-booking
      gaps in about a minute.
    </h2>

    <p class="small">
      Eight questions. No long form.
      Your result is directional and designed
      to show where we'd investigate first.
    </p>

    <div id="auditapp" class="quiz"></div>
  `;
}


const auditQuestions = [

  [
    "How are missed calls handled?",
    [
      "Someone calls back manually",
      "Automated text",
      "Receptionist handles it",
      "AI handles it",
      "Not sure"
    ]
  ],

  [
    "How quickly does someone respond to a new lead?",
    [
      "Immediately",
      "Within 5 minutes",
      "Within an hour",
      "Several hours",
      "Sometimes next day"
    ]
  ],

  [
    "How are appointments booked?",
    [
      "Phone/manual",
      "Website booking",
      "Staff books them",
      "Automated system",
      "AI books them"
    ]
  ],

  [
    "What happens when a lead does not book?",
    [
      "Manual follow-up",
      "Automated follow-up",
      "AI follow-up",
      "Inconsistent follow-up",
      "Not sure"
    ]
  ],

  [
    "Do you follow up with past customers?",
    [
      "Yes, systematically",
      "Sometimes",
      "No",
      "Not sure"
    ]
  ],

  [
    "How do you track leads and appointments?",
    [
      "CRM",
      "Spreadsheet",
      "Service software",
      "Multiple systems",
      "Mostly manual"
    ]
  ],

  [
    "How do you monitor lead performance?",
    [
      "Dashboard/reporting",
      "CRM reports",
      "Spreadsheet",
      "Manually",
      "We do not really track it"
    ]
  ],

  [
    "How mature is your automation?",
    [
      "Little/no automation",
      "Some automations",
      "Several systems",
      "Highly automated",
      "Not sure"
    ]
  ]

];


function renderAudit() {

  const app =
    document.getElementById("auditapp");

  if (!app) {
    console.error(
      "Flowexa: #auditapp not found."
    );
    return;
  }


  const questionIndex =
    auditAnswers.length;


  /*
   * After all 8 questions,
   * show the lead form.
   */

  if (
    questionIndex >=
    auditQuestions.length
  ) {

    showAuditLeadGate();

    return;
  }


  const question =
    auditQuestions[questionIndex];


  const progress =
    ((questionIndex + 1) /
      auditQuestions.length) *
    100;


  app.innerHTML = `

    <h3>
      ${question[0]}
    </h3>

    <div class="progress">

      <div
        class="bar"
        style="width:${progress}%">
      </div>

    </div>

    <div class="small">
      Question
      ${questionIndex + 1}
      of
      ${auditQuestions.length}
    </div>

    <div
      class="answers"
      style="margin-top:16px">

      ${question[1]
        .map(function (answer, index) {

          return `
            <button
              type="button"
              class="answer"
              onclick="answerAudit(${index})">

              ${answer}

            </button>
          `;

        })
        .join("")}

    </div>
  `;
}


function answerAudit(index) {

  auditAnswers.push(index);

  renderAudit();
}


function showAuditLeadGate() {

  const app =
    document.getElementById("auditapp");

  if (!app) return;


  app.innerHTML = `

    <div class="eyebrow">
      Your answers are ready
    </div>

    <h3>
      Where should we send your result?
    </h3>

    <p class="small">
      Required so Flowexa can follow up
      with the exact gap you identified.
    </p>

    <form
      onsubmit="submitAuditLead(event)">

      <div class="formgrid">

        <div class="field">
          <label>Full name *</label>
          <input
            name="name"
            autocomplete="name"
            required>
        </div>

        <div class="field">
          <label>Business email *</label>
          <input
            name="email"
            type="email"
            autocomplete="email"
            required>
        </div>

        <div class="field">
          <label>Business name *</label>
          <input
            name="company"
            required>
        </div>

        <div class="field">
          <label>Website *</label>
          <input
            name="website"
            type="url"
            placeholder="https://"
            required>
        </div>

      </div>

      <button
        class="btn blue glow"
        style="margin-top:18px"
        type="submit">

        Show My Booked Job Score →

      </button>

      <div
        class="form-status small"
        aria-live="polite"
        style="margin-top:12px">
      </div>

    </form>
  `;
}


async function submitAuditLead(event) {

  event.preventDefault();

  const form = event.target;

  const data =
    Object.fromEntries(
      new FormData(form).entries()
    );

  data.type = "audit";
  data.auditAnswers = auditAnswers;
  data.page = window.location.pathname;


  const status =
    form.querySelector(".form-status");

  const button =
    form.querySelector("button");


  if (status) {
    status.textContent =
      "Submitting your result…";
  }

  if (button) {
    button.disabled = true;
    button.textContent =
      "Submitting…";
  }


  const success =
    await sendLead(data);


  if (!success) {

    if (status) {
      status.textContent =
        "Submission failed. Please try again.";
      status.style.color =
        "#dc2626";
    }

    if (button) {
      button.disabled = false;
      button.textContent =
        "Show My Booked Job Score →";
    }

    return;
  }


  showAuditResult();
}


function showAuditResult() {

  const answers =
    auditAnswers;

  let gaps = [];


  if (
    answers[0] === 0 ||
    answers[0] === 4
  ) {

    gaps.push([
      "Missed-call recovery",
      "HIGH"
    ]);
  }


  if (answers[1] >= 2) {

    gaps.push([
      "Lead response speed",
      "HIGH"
    ]);
  }


  if (answers[2] <= 1) {

    gaps.push([
      "Appointment booking",
      "MEDIUM"
    ]);
  }


  if (answers[3] !== 1) {

    gaps.push([
      "Follow-up discipline",
      "HIGH"
    ]);
  }


  if (
    answers[4] === 1 ||
    answers[4] === 2 ||
    answers[4] === 3
  ) {

    gaps.push([
      "Customer reactivation",
      "MEDIUM"
    ]);
  }


  if (
    answers[5] === 1 ||
    answers[5] === 4
  ) {

    gaps.push([
      "Lead visibility",
      "MEDIUM"
    ]);
  }


  if (answers[6] >= 2) {

    gaps.push([
      "Owner reporting",
      "MEDIUM"
    ]);
  }


  if (answers[7] === 0) {

    gaps.push([
      "Automation foundation",
      "HIGH"
    ]);
  }


  let score =
    92 -
    gaps.length * 7 -
    answers.filter(
      function (answer) {
        return answer >= 2;
      }
    ).length * 2;


  score =
    Math.max(
      35,
      Math.min(94, score)
    );


  gaps =
    gaps.slice(0, 3);


  const app =
    document.getElementById("auditapp");

  if (!app) return;


  const gapHTML =
    gaps.length

      ? gaps
          .map(function (gap) {

            return `
              <div class="resultitem">

                <strong>
                  ${gap[0]}
                </strong>

                <div
                  class="status ${
                    gap[1] === "HIGH"
                      ? "high"
                      : "med"
                  }">

                  ${gap[1]}
                  OPPORTUNITY

                </div>

              </div>
            `;

          })
          .join("")

      : `

        <div class="resultitem">

          <strong>
            Strong foundation
          </strong>

          <div class="status strong">
            LOWER PRIORITY
          </div>

        </div>

      `;


  app.innerHTML = `

    <div class="eyebrow">
      Your result
    </div>

    <div class="score-ring">

      ${score}

      <span
        style="
          font-size:23px;
          color:#7b8797;
        ">

        /100

      </span>

    </div>

    <p class="small">
      This score is a directional diagnostic
      based on your answers. The opportunities
      below are where I'd investigate first.
    </p>

    <div class="resultgrid">

      ${gapHTML}

    </div>

    <div style="margin-top:22px">

      <button
        class="btn blue glow pulse"
        onclick="closeModal();openCal()">

        Want the deeper version?
        Book a Strategy Call →

      </button>

    </div>
  `;
}


/* =========================================================
   REVENUE CALCULATOR
   ========================================================= */

function calcLeak() {

  const missed =
    document.getElementById("missed");

  const rate =
    document.getElementById("rate");

  const job =
    document.getElementById("job");

  const result =
    document.getElementById("calcresult");


  if (
    !missed ||
    !rate ||
    !job ||
    !result
  ) {
    return;
  }


  const missedCalls =
    Math.max(
      0,
      Number(missed.value) || 0
    );


  const bookingRate =
    Math.min(
      100,
      Math.max(
        0,
        Number(rate.value) || 0
      )
    ) / 100;


  const averageJob =
    Math.max(
      0,
      Number(job.value) || 0
    );


  const revenue =
    missedCalls *
    bookingRate *
    averageJob;


  const intensity =
    Math.max(
      12,
      Math.min(
        100,
        Math.round(
          (revenue / 100000) * 100
        )
      )
    );


  result.innerHTML = `

    <div
      class="eyebrow"
      style="color:#dc2626">

      Estimated revenue currently at risk

    </div>

    <div class="big-number">

      $${Math.round(
        revenue
      ).toLocaleString()}

    </div>

    <div class="leak-bar">

      <span
        style="width:${intensity}%">
      </span>

    </div>

    <p class="small">

      <strong>
        This is an estimate of revenue
        potentially leaking from unanswered demand.
      </strong>

      ${missedCalls.toLocaleString()}
      missed calls ×
      ${Math.round(
        bookingRate * 100
      )}%
      booking assumption ×
      $${averageJob.toLocaleString()}
      average job value.

    </p>

    <div
      class="actions"
      style="margin-top:12px">

      <button
        class="btn outline"
        onclick="openModal('calcLead')">

        Email Me This Analysis →

      </button>

      <button
        class="btn outline"
        onclick="openModal('audit')">

        Find the Bigger Leaks →

      </button>

    </div>
  `;
}


/* =========================================================
   CALCULATOR LEAD
   ========================================================= */

async function submitCalcLead(event) {

  event.preventDefault();

  const form = event.target;

  const data =
    Object.fromEntries(
      new FormData(form).entries()
    );


  data.type =
    "calculator";


  data.missedCalls =
    document.getElementById("missed")?.value || "";


  data.bookingRate =
    document.getElementById("rate")?.value || "";


  data.averageJobValue =
    document.getElementById("job")?.value || "";


  data.page =
    window.location.pathname;


  const status =
    form.querySelector(".form-status");


  if (status) {
    status.textContent =
      "Saving your analysis…";
  }


  const success =
    await sendLead(data);


  if (!success) {

    if (status) {
      status.textContent =
        "Submission failed. Please try again.";
      status.style.color =
        "#dc2626";
    }

    return;
  }


  closeModal();

  toast(
    "Analysis captured. Your inputs are saved for follow-up."
  );
}


/* =========================================================
   GENERAL FORM SUBMISSION
   ========================================================= */

async function submitLead(event, type) {

  event.preventDefault();

  const form = event.target;


  const data =
    Object.fromEntries(
      new FormData(form).entries()
    );


  data.type =
    type || "contact";


  data.page =
    window.location.pathname;


  const status =
    form.querySelector("#contactStatus") ||
    form.querySelector("#formStatus") ||
    form.querySelector(".form-status") ||
    form.querySelector(
      '.small[aria-live="polite"]'
    );


  const button =
    form.querySelector(
      "button[type='submit']"
    );


  if (status) {

    status.style.color =
      "#607087";

    status.textContent =
      "Sending your request…";
  }


  if (button) {

    button.disabled = true;

    button.textContent =
      "Submitting…";
  }


  const success =
    await sendLead(data);


  if (success) {

    if (status) {

      status.style.color =
        "#059669";

      status.textContent =
        type === "pilot"

          ? "Request received. Your pilot application has been submitted."

          : "Request received. We'll review the information and follow up.";
    }


    toast(
      type === "pilot"
        ? "Pilot application submitted."
        : "Request submitted."
    );


    if (type === "contact") {

      form.reset();

      if (button) {

        button.disabled = false;

        button.textContent =
          "Send Request →";
      }

    } else {

      setTimeout(
        function () {
          closeModal();
        },
        900
      );
    }


  } else {

    if (status) {

      status.style.color =
        "#dc2626";

      status.textContent =
        "We couldn't submit the request. Please try again or book a strategy call directly.";
    }


    if (button) {

      button.disabled = false;

      button.textContent =
        type === "pilot"
          ? "Submit Pilot Application →"
          : "Submit Request →";
    }


    toast(
      "Submission failed. Please try again."
    );
  }
}


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


document.addEventListener(
  "DOMContentLoaded",
  function () {

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


    updateScrollProgress();

  }
);


/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

function updateScrollProgress() {

  const bar =
    document.getElementById(
      "scrollProgress"
    );


  if (!bar) return;


  const max =
    document.documentElement
      .scrollHeight -
    window.innerHeight;


  if (max <= 0) {

    bar.style.width =
      "0%";

    return;
  }


  const value =
    (
      window.scrollY / max
    ) * 100;


  bar.style.width =
    Math.min(
      100,
      Math.max(0, value)
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


/* =========================================================
   TOAST
   ========================================================= */

function toast(message) {

  const element =
    document.getElementById("toast");


  if (!element) return;


  element.textContent =
    message;


  element.classList.add(
    "show"
  );


  clearTimeout(
    window.__flowexaToastTimer
  );


  window.__flowexaToastTimer =
    setTimeout(
      function () {

        element.classList.remove(
          "show"
        );

      },
      2600
    );
}
