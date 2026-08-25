const CAL_URL="https://cal.com/saudagar-zeeshan-sttyxl/30min";

const CONFIG={
  // Paste your deployed Google Apps Script /exec URL here.
  SHEET_WEBHOOK_URL:"https://script.google.com/macros/s/AKfycbweN1Y4g86OuTwJUwf1N3D65tJX5awpE5MG1ElSuOoaa3IaXGzWliPeApWr0D1Z-xveJg/exec"
};

const PDFS={
  playbook:"booked-job-playbook.pdf",
  recovery:"revenue-recovery-map.pdf",
  followup:"lead-follow-up-sequence.pdf",
  receptionist:"ai-receptionist-blueprint.pdf"
};

let pendingPdf="";

/* =========================================================
   CAL.COM INLINE EMBED
   ========================================================= */

let calScriptPromise=null;

function loadCalScript(){

  if(
    window.Cal &&
    typeof window.Cal==="function"
  ){
    return Promise.resolve();
  }

  if(calScriptPromise){
    return calScriptPromise;
  }

  calScriptPromise=new Promise((resolve,reject)=>{

    const existing=document.querySelector(
      'script[src="https://app.cal.com/embed/embed.js"]'
    );

    if(existing){

      let attempts=0;

      const timer=setInterval(()=>{

        attempts++;

        if(
          window.Cal &&
          typeof window.Cal==="function"
        ){
          clearInterval(timer);
          resolve();
          return;
        }

        if(attempts>=100){

          clearInterval(timer);

          reject(
            new Error(
              "Cal.com embed script did not initialize."
            )
          );

        }

      },100);

      return;
    }

    const script=document.createElement("script");

    script.src="https://app.cal.com/embed/embed.js";
    script.async=true;

    script.onload=()=>{

      if(
        window.Cal &&
        typeof window.Cal==="function"
      ){

        resolve();

      }else{

        reject(
          new Error(
            "Cal.com loaded but window.Cal is unavailable."
          )
        );

      }

    };

    script.onerror=()=>{

      reject(
        new Error(
          "Could not load Cal.com embed script."
        )
      );

    };

    document.head.appendChild(script);

  });

  return calScriptPromise;
}


function initializeCalEmbed(){

  const target=
    document.getElementById(
      "flowexaCalEmbed"
    );

  if(!target){
    return;
  }

  if(
    !window.Cal ||
    typeof window.Cal!=="function"
  ){

    showCalFallback();

    return;
  }

  target.innerHTML="";

  try{

    window.Cal(
      "init",
      {
        origin:"https://cal.com"
      }
    );

    window.Cal(
      "inline",
      {
        elementOrSelector:
          "#flowexaCalEmbed",

        calLink:
          "saudagar-zeeshan-sttyxl/30min",

        config:{
          layout:"month_view",
          theme:"light"
        }
      }
    );

    try{

      window.Cal(
        "ui",
        {
          styles:{
            branding:{
              brandColor:"#1d68f2"
            }
          },

          hideEventTypeDetails:false
        }
      );

    }catch(uiError){

      console.warn(
        "Cal.com UI configuration skipped:",
        uiError
      );

    }

  }catch(error){

    console.error(
      "Cal.com inline embed error:",
      error
    );

    showCalFallback();

  }

}


function showCalFallback(){

  const target=
    document.getElementById(
      "flowexaCalEmbed"
    );

  if(!target){
    return;
  }

  target.innerHTML=`

    <div class="cal-error">

      <strong>
        Calendar could not load inside the website.
      </strong>

      <p>
        You can still book your strategy call
        using the button below.
      </p>

      <a
        class="btn blue"
        href="${CAL_URL}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open Cal.com directly →
      </a>

    </div>

  `;
}


function openCal(){

  const m=
    document.getElementById("modal");

  const c=
    document.getElementById("modalContent");

  if(!m || !c){
    return;
  }

  c.innerHTML=`

    <button
      class="close"
      onclick="closeModal()"
      aria-label="Close"
    >
      ×
    </button>

    <div class="eyebrow">
      Flowexa Strategy Call
    </div>

    <h2>
      Let's find the highest-value leak first.
    </h2>

    <p class="small">
      Choose a time that works without leaving
      the Flowexa website.
    </p>

    <div class="cal-wrap">

      <div
        id="flowexaCalEmbed"
        class="cal-inline"
      >

        <div class="cal-loading">
          Loading the calendar…
        </div>

      </div>

    </div>

    <div class="cal-actions">

      <a
        class="btn outline"
        href="${CAL_URL}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open Cal.com directly →
      </a>

    </div>

  `;

  openModalShell();

  requestAnimationFrame(()=>{

    loadCalScript()

      .then(()=>{

        requestAnimationFrame(
          initializeCalEmbed
        );

      })

      .catch(error=>{

        console.error(
          "Cal.com loading failed:",
          error
        );

        showCalFallback();

      });

  });

}


function openModalShell(){

  const m=
    document.getElementById("modal");

  if(!m){
    return;
  }

  m.classList.add("open");

  m.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );

}


/* =========================================================
   PDF RESOURCE GATE
   ========================================================= */

function openPdfGate(type){

  pendingPdf=type;

  const names={
    playbook:"The Booked Job Playbook™",
    recovery:"Revenue Recovery Map™",
    followup:"Lead Follow-Up Sequence™",
    receptionist:"AI Front Desk Blueprint™"
  };

  const c=
    document.getElementById(
      "modalContent"
    );

  c.innerHTML=`

    <button
      class="close"
      onclick="closeModal()"
      aria-label="Close"
    >
      ×
    </button>

    <div class="eyebrow">
      Free PDF — ${names[type]}
    </div>

    <h2>
      Get the full operating guide.
    </h2>

    <p class="small">
      Enter your details once. The PDF will
      download immediately after submission.
      Your information is used so Flowexa can
      follow up with the resource and understand
      which problem you care about.
    </p>

    <form onsubmit="submitPdfLead(event)">

      <div class="formgrid">

        <div class="field">
          <label>Full name *</label>
          <input
            name="name"
            required
            autocomplete="name"
          >
        </div>

        <div class="field">
          <label>Business email *</label>
          <input
            name="email"
            type="email"
            required
            autocomplete="email"
          >
        </div>

        <div class="field">
          <label>Business name *</label>
          <input
            name="company"
            required
          >
        </div>

        <div class="field">
          <label>Website *</label>
          <input
            name="website"
            type="url"
            placeholder="https://"
            required
          >
        </div>

        <div class="field">
          <label>Business type *</label>

          <select
            name="businessType"
            required
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

        </div>

        <div class="field">
          <label>Biggest focus right now *</label>

          <select
            name="challenge"
            required
          >

            <option value="">
              Select one
            </option>

            <option>
              Convert more existing leads
            </option>

            <option>
              Recover missed calls / old opportunities
            </option>

            <option>
              Improve follow-up
            </option>

            <option>
              Automate operations
            </option>

            <option>
              Implement AI safely
            </option>

            <option>
              Owner visibility / reporting
            </option>

          </select>

        </div>

      </div>

      <div
        class="note"
        style="margin-top:13px"
      >
        Required fields are intentional:
        this lets Flowexa send the right
        follow-up instead of generic marketing.
      </div>

      <button
        class="btn blue glow"
        style="margin-top:18px"
      >
        Download My PDF →
      </button>

      <div
        class="pdf-status small"
        aria-live="polite"
        style="margin-top:10px"
      ></div>

    </form>

  `;

  openModalShell();

}


async function submitPdfLead(e){

  e.preventDefault();

  const data=
    Object.fromEntries(
      new FormData(e.target).entries()
    );

  data.type="pdf-download";
  data.resource=pendingPdf;
  data.page=location.pathname;

  const url=
    PDFS[pendingPdf];

  const status=
    e.target.querySelector(
      ".pdf-status"
    );

  if(status){

    status.textContent=
      "Sending your information…";

  }

  const ok=
    await sendLead(data);

  if(!ok){

    if(status){

      status.textContent=
        "We couldn't submit your information. Please try again.";

    }

    return;
  }

  if(status){

    status.textContent=
      "Submission received. Starting your PDF…";

  }

  setTimeout(()=>{

    closeModal();

    const a=
      document.createElement("a");

    a.href=
      new URL(
        url,
        window.location.href
      ).href;

    a.download=
      url.split("/").pop();

    document.body.appendChild(a);

    a.click();

    a.remove();

    toast(
      "PDF download started."
    );

  },250);

}


/* =========================================================
   GOOGLE SHEETS
   ========================================================= */

async function sendLead(data){

  const payload={
    source:"Flowexa website",
    ...data,

    business:
      data.business ||
      data.company ||
      "",

    industry:
      data.industry ||
      data.businessType ||
      data.typeOfBusiness ||
      "",

    problem:
      data.problem ||
      data.challenge ||
      data.details ||
      data.message ||
      "",

    resource:
      data.resource ||
      "",

    createdAt:
      new Date().toISOString()
  };

  const url=
    CONFIG.SHEET_WEBHOOK_URL;

  if(!url){

    console.error(
      "Flowexa: Google Apps Script URL is missing."
    );

    return false;
  }

  /*
   * Use a native POST into a hidden iframe.
   * This avoids CORS/preflight issues with Google Apps Script on GitHub Pages.
   * The Apps Script endpoint accepts normal form fields.
   */

  try{

    const frameName=
      "flowexa_submit_" +
      Date.now();

    const iframe=
      document.createElement(
        "iframe"
      );

    iframe.name=
      frameName;

    iframe.style.display=
      "none";

    document.body.appendChild(
      iframe
    );

    const form=
      document.createElement(
        "form"
      );

    form.method=
      "POST";

    form.action=
      url;

    form.target=
      frameName;

    form.style.display=
      "none";

    Object.entries(
      payload
    ).forEach(
      ([key,value])=>{

        const input=
          document.createElement(
            "input"
          );

        input.type=
          "hidden";

        input.name=
          key;

        input.value=
          Array.isArray(value)
            ? JSON.stringify(value)
            : String(value ?? "");

        form.appendChild(
          input
        );

      }
    );

    document.body.appendChild(
      form
    );

    form.submit();

    setTimeout(()=>{

      form.remove();
      iframe.remove();

    },8000);

    return true;

  }catch(error){

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

function openModal(type){

  const c=
    document.getElementById(
      "modalContent"
    );

  c.innerHTML=
    '<button class="close" onclick="closeModal()">×</button>';

  if(type==="pilot"){

    c.innerHTML+=`

      <div class="eyebrow">
        Free Pilot
      </div>

      <h2>
        Apply for the Flowexa Free Pilot.
      </h2>

      <p class="small">
        We are not looking for a perfect business.
        We are looking for a real process where
        fixing one bottleneck could create meaningful value.
      </p>

      <form
        onsubmit="submitLead(event,'pilot')"
      >

        <div class="formgrid">

          <div class="field">
            <label>First name *</label>
            <input
              name="firstName"
              required
            >
          </div>

          <div class="field">
            <label>Last name *</label>
            <input
              name="lastName"
              required
            >
          </div>

          <div class="field">
            <label>Business email *</label>
            <input
              name="email"
              type="email"
              required
            >
          </div>

          <div class="field">
            <label>Company *</label>
            <input
              name="company"
              required
            >
          </div>

          <div class="field">
            <label>Website *</label>
            <input
              name="website"
              type="url"
              placeholder="https://"
              required
            >
          </div>

          <div class="field">
            <label>Business type *</label>

            <select
              name="type"
              required
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
              <option>Other</option>

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
              placeholder="Missed calls, slow response, estimates, follow-up, booking, etc."
            ></textarea>

          </div>

        </div>

        <button
          class="btn blue glow"
          style="margin-top:18px"
        >
          Submit Pilot Application →
        </button>

      </form>

    `;

  }

  if(type==="playbook"){
    c.innerHTML+=playbookHTML();
  }

  if(type==="recovery"){
    c.innerHTML+=recoveryHTML();
  }

  if(type==="followup"){
    c.innerHTML+=followupHTML();
  }

  if(type==="receptionist"){
    c.innerHTML+=receptionistHTML();
  }

  if(type==="audit"){

    auditAnswers=[];

    c.innerHTML+=
      auditShell();

  }

  if(type==="calcLead"){

    c.innerHTML+=`

      <div class="eyebrow">
        Revenue Leak Calculator™
      </div>

      <h2>
        Send this analysis to me.
      </h2>

      <p class="small">
        We'll save the calculator inputs with
        your contact details so Flowexa can follow
        up with context instead of starting from zero.
      </p>

      <form
        onsubmit="submitCalcLead(event)"
      >

        <div class="formgrid">

          <div class="field">
            <label>Full name *</label>
            <input
              name="name"
              required
            >
          </div>

          <div class="field">
            <label>Business email *</label>
            <input
              name="email"
              type="email"
              required
            >
          </div>

          <div class="field">
            <label>Business name *</label>
            <input
              name="company"
              required
            >
          </div>

          <div class="field">
            <label>Website *</label>
            <input
              name="website"
              type="url"
              placeholder="https://"
              required
            >
          </div>

        </div>

        <div
          class="note"
          style="margin-top:13px"
        >
          Your calculator assumptions will be attached
          to the lead record automatically.
        </div>

        <button
          class="btn blue glow"
          style="margin-top:18px"
        >
          Save My Analysis →
        </button>

      </form>

    `;

  }

  if(type==="mapform"){

    c.innerHTML+=`

      <div class="eyebrow">
        Revenue Recovery Map™
      </div>

      <h2>
        Give me the basics and map the
        biggest recovery opportunity.
      </h2>

      <p class="small">
        Required fields keep the map useful.
        In the production version, this submission
        should go to your lead database.
      </p>

      <form
        onsubmit="submitLead(event,'recovery-map')"
      >

        <div class="formgrid">

          <div class="field">
            <label>Full name *</label>
            <input
              name="name"
              required
            >
          </div>

          <div class="field">
            <label>Business email *</label>
            <input
              name="email"
              type="email"
              required
            >
          </div>

          <div class="field">
            <label>Business name *</label>
            <input
              name="company"
              required
            >
          </div>

          <div class="field">
            <label>Website *</label>
            <input
              name="website"
              type="url"
              placeholder="https://"
              required
            >
          </div>

          <div class="field">

            <label>
              Business type *
            </label>

            <select
              name="type"
              required
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
              <option>Other Home Service</option>

            </select>

          </div>

          <div class="field">

            <label>
              Biggest suspected leak *
            </label>

            <select
              name="leak"
              required
            >

              <option value="">
                Select one
              </option>

              <option>
                Missed calls
              </option>

              <option>
                Slow lead response
              </option>

              <option>
                Appointment no-shows
              </option>

              <option>
                Unsold estimates
              </option>

              <option>
                Old leads
              </option>

              <option>
                Past customers
              </option>

              <option>
                Not sure
              </option>

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
              placeholder="Briefly describe what happens from first contact to booked job."
            ></textarea>

          </div>

        </div>

        <button
          class="btn blue glow"
          style="margin-top:18px"
        >
          Request My Recovery Map →
        </button>

      </form>

    `;

  }

  openModalShell();

  if(type==="audit"){
    renderAudit();
  }

}


/* =========================================================
   BOOKED JOB PLAYBOOK
   ========================================================= */

function playbookHTML(){

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
          market → offer → demand → response → sales
          → delivery → retention → measurement → automation.
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
          Choose a service with meaningful ticket size
          and clear customer pain.
        </li>

        <li>
          Start with a tight service area so travel,
          scheduling and local reputation are manageable.
        </li>

        <li>
          Define the customer you want:
          property type, project size, urgency and buying trigger.
        </li>

        <li>
          Write down the jobs you will <em>not</em> take.
          Margin and capacity matter more than vanity lead volume.
        </li>
      </ol>

      <h3>
        Phase 2 — Build an offer people can understand in 10 seconds
      </h3>

      <ul>
        <li>
          Make the outcome obvious:
          what problem is solved, for whom, and what happens next.
        </li>

        <li>
          Reduce uncertainty with proof, process transparency,
          warranty/guarantee language where legitimate,
          and clear expectations.
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
        Pick a small number of channels and learn them deeply.
        Local search, referrals, paid lead sources, partnerships
        and outbound can all work; the mistake is adding channels
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
          Recover missed calls instead of treating them as dead.
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
        give a realistic decision path, then follow up systematically.
        “Sent estimate” is not the same thing as “lost lead.”
      </p>

      <h3>
        Phase 6 — Build the follow-up machine before the AI machine
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
        document the work, collect reviews, ask for referrals
        and make the next purchase easy.
      </p>

      <h3>
        Phase 8 — Know your numbers
      </h3>

      <p>
        At minimum, know leads → appointments → estimates
        → wins → revenue → gross margin.
        Then ask: <strong>where does the largest drop happen?</strong>
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
          Use AI for follow-up where the business rules are clear.
        </li>

        <li>
          Use AI reception only after you know the correct scripts,
          escalation rules and booking logic.
        </li>

        <li>
          Keep humans in the loop for pricing exceptions,
          angry customers, safety issues, unusual jobs and anything
          outside the system's authority.
        </li>

      </ol>

      <div class="principle">

        <strong>The end state:</strong>
        a business where demand is captured,
        serious prospects are handled quickly,
        sales opportunities are followed up,
        delivery is consistent, and the owner can see
        the numbers without personally chasing every detail.

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
        add controlled AI and remove repetitive owner work.

      </p>

      <div style="margin-top:25px">

        <button
          class="btn blue glow pulse"
          onclick="closeModal();openCal()"
        >
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

function recoveryHTML(){

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
        The fastest revenue opportunity is often not
        another lead source. It is the demand you already
        paid for but failed to convert, follow up with or reactivate.
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
          How many become reviews, referrals or repeat customers?
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
        Estimate <strong>
          volume × conversion gap × average job value
        </strong>.
        A small improvement in a high-ticket stage can
        be worth more than a large improvement in a low-value stage.
      </p>

      <div class="principle">

        <strong>Example:</strong>
        If 40 qualified estimates are sitting untouched
        and the average job is $5,000, the first question
        is not “How do we get more leads?”
        It is “Why are these 40 opportunities not being worked correctly?”

      </div>

      <h3>
        The 7-day recovery sprint
      </h3>

      <ol>

        <li>
          Export recent leads and estimates.
        </li>

        <li>
          Separate open, lost, no-response and
          no-decision opportunities.
        </li>

        <li>
          Call the highest-value open opportunities first.
        </li>

        <li>
          Start a structured follow-up sequence for the remainder.
        </li>

        <li>
          Review every missed-call process.
        </li>

        <li>
          Reactivate a small, relevant group of past customers.
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
        Data collection, reminders, task creation, status changes,
        simple acknowledgements and reporting are strong automation candidates.
        Pricing disputes, complaints, unusual project scope and
        safety-sensitive issues should remain human-controlled.
      </p>

      <div style="margin-top:25px">

        <button
          class="btn blue glow pulse"
          onclick="closeModal();openModal('mapform')"
        >
          Build My Revenue Recovery Map →
        </button>

      </div>

    </div>

  `;

}


/* =========================================================
   LEAD FOLLOW-UP SEQUENCE
   ========================================================= */

function followupHTML(){

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
        The sequence changes by stage.
        A homeowner who just requested an estimate
        should not receive the same message as someone
        who ignored a proposal for three weeks.
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
          based on season, project timing or a legitimate reason.
        </li>

      </ol>

      <h3>
        Sequence C — Dormant customer
      </h3>

      <p>
        Start from a real reason to contact them:
        seasonal maintenance, a related service,
        a warranty check, a legitimate upgrade opportunity
        or a useful reminder. Do not manufacture urgency.
      </p>

      <h3>
        The rules that make this work
      </h3>

      <ul>

        <li>
          Every message should have one job.
        </li>

        <li>
          Do not repeat the same “just following up”
          message five times.
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
        within approved boundaries and create a task for
        a salesperson. The business should still define
        the rules before AI is given authority.
      </p>

      <div style="margin-top:25px">

        <button
          class="btn blue glow pulse"
          onclick="closeModal();openCal()"
        >
          Want this built into your process?
          Book a Strategy Call →
        </button>

      </div>

    </div>

  `;

}


/* =========================================================
   AI FRONT DESK BLUEPRINT
   ========================================================= */

function receptionistHTML(){

  return `

    <div class="eyebrow">
      AI Front Desk Blueprint™
    </div>

    <h2>
      Design the receptionist around
      business rules — not a chatbot prompt.
    </h2>

    <div class="resource-copy">

      <p>
        An AI receptionist is valuable when it reliably
        handles predictable work and knows when to stop.
        It should not pretend to be a human expert
        outside its authority.
      </p>

      <h3>
        1. Define the job
      </h3>

      <ul>
        <li>
          Answer common questions from approved information.
        </li>

        <li>
          Capture service, location, urgency and contact details.
        </li>

        <li>
          Check basic service-area fit.
        </li>

        <li>
          Route qualified inquiries toward booking.
        </li>

        <li>
          Create a clean handoff when a human is required.
        </li>
      </ul>

      <h3>
        2. Give it a knowledge boundary
      </h3>

      <p>
        Services offered, service area, hours,
        booking rules, emergency policy, common questions,
        cancellation rules and approved language.
        If the answer is not in the knowledge base,
        the system should say it needs a human rather
        than invent one.
      </p>

      <h3>
        3. Define escalation triggers
      </h3>

      <ul>

        <li>
          Angry or distressed customer
        </li>

        <li>
          Safety or emergency issue
        </li>

        <li>
          Pricing exception or negotiation
        </li>

        <li>
          Complex project scope
        </li>

        <li>
          Legal/insurance dispute
        </li>

        <li>
          Customer explicitly requests a person
        </li>

      </ul>

      <h3>
        4. Define qualification
      </h3>

      <p>
        Ask only what the business actually needs
        to decide the next step:
        service type, location, urgency,
        property/project basics, timing and contact information.
      </p>

      <h3>
        5. Define booking
      </h3>

      <p>
        Only offer appointments the business actually wants filled.
        Protect buffers, travel constraints, capacity
        and special requirements.
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
        human handoff cleaner — not eliminate humans
        from situations that require judgment.

      </div>

      <div style="margin-top:25px">

        <button
          class="btn blue glow pulse"
          onclick="closeModal();openCal()"
        >
          Want an AI front desk designed for your process?
          Book a Strategy Call →
        </button>

      </div>

    </div>

  `;

}


/* =========================================================
   BOOKED JOB SCORE
   ========================================================= */

function auditShell(){

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

    <div
      id="auditapp"
      class="quiz"
    ></div>

  `;

}


const qs=[

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

let auditAnswers=[];


function renderAudit(){

  const app=
    document.getElementById(
      "auditapp"
    );

  const i=
    auditAnswers.length;

  if(i>=qs.length){

    showAuditLeadGate();

    return;
  }

  const q=
    qs[i];

  app.innerHTML=`

    <h3>
      ${q[0]}
    </h3>

    <div class="progress">

      <div
        class="bar"
        style="width:${((i+1)/qs.length)*100}%"
      ></div>

    </div>

    <div class="small">
      Question ${i+1} of ${qs.length}
    </div>

    <div
      class="answers"
      style="margin-top:16px"
    >

      ${q[1].map(
        (x,n)=>
          `<button
             class="answer"
             onclick="answerAudit(${n})"
           >
             ${x}
           </button>`
      ).join("")}

    </div>

  `;

}


function answerAudit(n){

  auditAnswers.push(n);

  renderAudit();

}


function showAuditLeadGate(){

  const app=
    document.getElementById(
      "auditapp"
    );

  app.innerHTML=`

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
      onsubmit="submitAuditLead(event)"
    >

      <div class="formgrid">

        <div class="field">
          <label>Full name *</label>
          <input
            name="name"
            required
          >
        </div>

        <div class="field">
          <label>Business email *</label>
          <input
            name="email"
            type="email"
            required
          >
        </div>

        <div class="field">
          <label>Business name *</label>
          <input
            name="company"
            required
          >
        </div>

        <div class="field">
          <label>Website *</label>
          <input
            name="website"
            type="url"
            placeholder="https://"
            required
          >
        </div>

      </div>

      <button
        class="btn blue glow"
        style="margin-top:18px"
      >
        Show My Booked Job Score →
      </button>

    </form>

  `;

}


async function submitAuditLead(e){

  e.preventDefault();

  const data=
    Object.fromEntries(
      new FormData(e).entries()
    );

  data.type="audit";
  data.auditAnswers=
    auditAnswers;

  data.page=
    location.pathname;

  const ok=
    await sendLead(data);

  if(!ok){

    const button=
      e.target.querySelector(
        "button"
      );

    if(button){

      button.disabled=
        false;

    }

    toast(
      "Submission failed. Please try again."
    );

    return;

  }

  showAuditResult(
    data
  );

}


function showAuditResult(){

  const a=
    auditAnswers;

  let gaps=[];

  if(
    a[0]===0 ||
    a[0]===4
  ){
    gaps.push([
      "Missed-call recovery",
      "HIGH"
    ]);
  }

  if(a[1]>=2){
    gaps.push([
      "Lead response speed",
      "HIGH"
    ]);
  }

  if(a[2]<=1){
    gaps.push([
      "Appointment booking",
      "MEDIUM"
    ]);
  }

  if(a[3]!==1){
    gaps.push([
      "Follow-up discipline",
      "HIGH"
    ]);
  }

  if(
    a[4]===1 ||
    a[4]===2 ||
    a[4]===3
  ){
    gaps.push([
      "Customer reactivation",
      "MEDIUM"
    ]);
  }

  if(
    a[5]===1 ||
    a[5]===4
  ){
    gaps.push([
      "Lead visibility",
      "MEDIUM"
    ]);
  }

  if(a[6]>=2){
    gaps.push([
      "Owner reporting",
      "MEDIUM"
    ]);
  }

  if(a[7]===0){
    gaps.push([
      "Automation foundation",
      "HIGH"
    ]);
  }

  let score=
    Math.max(
      35,
      Math.min(
        94,
        92 -
        gaps.length*7 -
        a.filter(
          x=>x>=2
        ).length*2
      )
    );

  gaps=
    gaps.slice(
      0,
      3
    );

  document.getElementById(
    "auditapp"
  ).innerHTML=`

    <div class="eyebrow">
      Your result
    </div>

    <div class="score-ring">
      ${score}

      <span
        style="font-size:23px;color:#7b8797"
      >
        /100
      </span>

    </div>

    <p class="small">
      This score is a directional diagnostic
      based on your answers. The opportunities
      below are where I'd investigate first.
    </p>

    <div class="resultgrid">

      ${
        gaps.length

        ? gaps.map(
          g=>
            `<div class="resultitem">

              <strong>
                ${g[0]}
              </strong>

              <div
                class="status ${
                  g[1]==="HIGH"
                    ?"high"
                    :"med"
                }"
              >
                ${g[1]} OPPORTUNITY
              </div>

            </div>`
        ).join("")

        :

        `<div class="resultitem">

          <strong>
            Strong foundation
          </strong>

          <div class="status strong">
            LOWER PRIORITY
          </div>

        </div>`
      }

    </div>

    <div style="margin-top:22px">

      <button
        class="btn blue glow pulse"
        onclick="closeModal();openCal()"
      >
        Want the deeper version?
        Book a Strategy Call →
      </button>

    </div>

  `;

}


/* =========================================================
   REVENUE LEAK CALCULATOR
   ========================================================= */

function calcLeak(){

  const m=
    +document.getElementById(
      "missed"
    ).value || 0;

  const r=
    (
      +document.getElementById(
        "rate"
      ).value || 0
    ) / 100;

  const j=
    +document.getElementById(
      "job"
    ).value || 0;

  const rev=
    m*r*j;

  const intensity=
    Math.max(
      12,
      Math.min(
        100,
        Math.round(
          (
            rev /
            Math.max(
              1,
              100000
            )
          )*100
        )
      )
    );

  document.getElementById(
    "calcresult"
  ).innerHTML=`

    <div
      class="eyebrow"
      style="color:#dc2626"
    >
      Estimated revenue currently at risk
    </div>

    <div class="big-number">
      $${Math.round(rev).toLocaleString()}
    </div>

    <div class="leak-bar">

      <span
        style="width:${intensity}%"
      ></span>

    </div>

    <p class="small">

      <strong>
        This is an estimate of revenue potentially
        leaking from unanswered demand.
      </strong>

      ${m.toLocaleString()}
      missed calls ×
      ${Math.round(r*100)}%
      booking assumption ×
      $${j.toLocaleString()}
      average job value.

    </p>

    <div
      class="actions"
      style="margin-top:12px"
    >

      <button
        class="btn outline"
        onclick="openModal('calcLead')"
      >
        Email Me This Analysis →
      </button>

      <button
        class="btn outline"
        onclick="openModal('audit')"
      >
        Find the Bigger Leaks →
      </button>

    </div>

  `;

}


async function submitCalcLead(e){

  e.preventDefault();

  const data=
    Object.fromEntries(
      new FormData(e).entries()
    );

  data.type=
    "calculator";

  data.missedCalls=
    document.getElementById(
      "missed"
    )?.value || "";

  data.bookingRate=
    document.getElementById(
      "rate"
    )?.value || "";

  data.averageJobValue=
    document.getElementById(
      "job"
    )?.value || "";

  data.page=
    location.pathname;

  await sendLead(
    data
  );

  closeModal();

  toast(
    "Analysis captured. Your inputs are saved for follow-up."
  );

}


/* =========================================================
   GENERAL FORM SUBMISSION
   ========================================================= */

async function submitLead(
  e,
  type
){

  e.preventDefault();

  const form=
    e.target;

  const data=
    Object.fromEntries(
      new FormData(
        form
      ).entries()
    );

  data.type=
    type;

  data.page=
    location.pathname;

  const status=

    form.querySelector(
      "#contactStatus"
    ) ||

    form.querySelector(
      "#formStatus"
    ) ||

    form.querySelector(
      ".form-status"
    ) ||

    form.querySelector(
      '.small[aria-live="polite"]'
    );

  if(status){

    status.style.color=
      "#607087";

    status.textContent=
      "Sending your request…";

  }

  const ok=
    await sendLead(
      data
    );

  if(ok){

    if(status){

      status.style.color=
        "#059669";

      status.textContent=
        type==="pilot"

        ? "Request received. Your pilot application has been submitted."

        : "Request received. We'll review the information and follow up.";

    }

    toast(
      type==="pilot"
        ? "Pilot application submitted."
        : "Request submitted."
    );

    if(type==="contact"){

      form.reset();

    }else{

      setTimeout(
        ()=>closeModal(),
        900
      );

    }

  }else{

    if(status){

      status.style.color=
        "#dc2626";

      status.textContent=
        "We couldn't submit the request. Please try again or book a strategy call directly.";

    }

    toast(
      "Submission failed. Please try again."
    );

  }

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal(){

  const m=
    document.getElementById(
      "modal"
    );

  if(!m){
    return;
  }

  m.classList.remove(
    "open"
  );

  m.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );

}


const modal=
  document.getElementById(
    "modal"
  );

if(modal){

  modal.addEventListener(
    "click",
    e=>{

      if(
        e.target.id==="modal"
      ){

        closeModal();

      }

    }
  );

}


document.addEventListener(
  "keydown",
  e=>{

    if(
      e.key==="Escape"
    ){

      closeModal();

    }

  }
);


/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

function updateScrollProgress(){

  const bar=
    document.getElementById(
      "scrollProgress"
    );

  if(!bar){
    return;
  }

  const max=
    document.documentElement.scrollHeight -
    window.innerHeight;

  const value=
    max>0
      ? (window.scrollY/max)*100
      : 0;

  bar.style.width=
    Math.min(
      100,
      Math.max(
        0,
        value
      )
    )+"%";

}


window.addEventListener(
  "scroll",
  updateScrollProgress,
  {passive:true}
);

window.addEventListener(
  "resize",
  updateScrollProgress
);

updateScrollProgress();


/* =========================================================
   TOAST
   ========================================================= */

function toast(t){

  const x=
    document.getElementById(
      "toast"
    );

  if(!x){
    return;
  }

  x.textContent=
    t;

  x.classList.add(
    "show"
  );

  clearTimeout(
    window.__flowexaToastTimer
  );

  window.__flowexaToastTimer=
    setTimeout(
      ()=>x.classList.remove(
        "show"
      ),
      2600
    );

}
