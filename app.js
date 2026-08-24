const ENDPOINT = "https://script.google.com/macros/s/AKfycbweN1Y4g86OuTwJUwf1N3D65tJX5awpE5MG1ElSuOoaa3IaXGzWliPeApWr0D1Z-xveJg/exec";
const CAL_LINK = "https://cal.com/saudagar-zeeshan-sttyxl/30min";

const RESOURCE_META = {
  playbook: {
    title:"The Booked Job Playbook™",
    kicker:"FREE PDF — THE BOOKED JOB PLAYBOOK™",
    description:"The operating framework for an established home-service business that already has demand and wants to turn more of it into booked, completed and collected jobs.",
    file:"booked-job-playbook.pdf"
  },
  recovery: {
    title:"Revenue Recovery Map™",
    kicker:"FREE PDF — REVENUE RECOVERY MAP™",
    description:"A practical map for finding money already sitting in missed calls, stale estimates, cancellations and other pipeline leaks.",
    file:"revenue-recovery-map.pdf"
  },
  followup: {
    title:"Lead Follow-Up Sequence™",
    kicker:"FREE PDF — LEAD FOLLOW-UP SEQUENCE™",
    description:"A decision-based follow-up framework for leads that did not book on the first interaction.",
    file:"lead-follow-up-sequence.pdf"
  },
  receptionist: {
    title:"AI Receptionist Blueprint™",
    kicker:"FREE PDF — AI RECEPTIONIST BLUEPRINT™",
    description:"A practical guide to where AI can earn money in an established home-service operation—and where human judgment still matters.",
    file:"ai-receptionist-blueprint.pdf"
  }
};

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

function closeModal() {
  const m = document.getElementById("modal");
  m.classList.remove("open");
  m.setAttribute("aria-hidden","true");
}

function openModal(html) {
  const m = document.getElementById("modal");
  document.getElementById("modalContent").innerHTML = html;
  m.classList.add("open");
  m.setAttribute("aria-hidden","false");
}

function openResource(key) {
  const r = RESOURCE_META[key];

  openModal(`
    <div class="eyebrow">${r.kicker}</div>
    <h2>Get the full operating guide.</h2>
    <p>${r.description} Enter your details once. The PDF becomes available immediately after submission.</p>

    <form class="resource-form" id="resourceForm">
      <input type="hidden" name="type" value="resource-download">
      <input type="hidden" name="resource" value="${key}">
      <input type="hidden" name="page" value="resource-modal">

      <label>
        Full name *
        <input required name="name" autocomplete="name">
      </label>

      <label>
        Business email *
        <input required type="email" name="email" autocomplete="email">
      </label>

      <label>
        Business name *
        <input required name="company">
      </label>

      <label>
        Website *
        <input required type="url" name="website" placeholder="https://">
      </label>

      <label>
        Business type *
        <select required name="businessType">
          <option value="">Select one</option>
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
        <select required name="challenge">
          <option value="">Select one</option>
          <option>Convert more existing leads</option>
          <option>Recover missed calls</option>
          <option>Improve follow-up</option>
          <option>Book appointments faster</option>
          <option>Automate operations</option>
        </select>
      </label>

      <div class="wide download-note">
        Required fields are intentional: this gives Flowexa enough context to follow up with something relevant rather than generic marketing.
      </div>

      <button class="btn btn-primary" type="submit">
        Download My PDF →
      </button>

      <p class="form-status wide" id="resourceStatus"></p>
    </form>
  `);

  document
    .getElementById("resourceForm")
    .addEventListener("submit", e => submitResource(e, key));
}

async function postLead(data) {
  try {
    await fetch(ENDPOINT, {
      method:"POST",
      mode:"no-cors",
      headers:{
        "Content-Type":"text/plain;charset=utf-8"
      },
      body:JSON.stringify(data)
    });

    return true;
  } catch(e) {
    console.error(e);
    return false;
  }
}

async function submitResource(e, key) {
  e.preventDefault();

  const form = e.target;
  const status = document.getElementById("resourceStatus");
  const data = Object.fromEntries(
    new FormData(form).entries()
  );

  status.textContent = "Preparing your PDF…";

  const ok = await postLead(data);
  const r = RESOURCE_META[key];

  status.textContent = "";

  document.getElementById("modalContent").innerHTML = `
    <div class="success">
      <div class="big">✓</div>

      <div class="eyebrow">${r.kicker}</div>

      <h2>Your guide is ready.</h2>

      <p>
        Your details have been submitted and the operating guide is ready to open.
      </p>

      <a
        class="btn btn-primary btn-lg"
        href="${r.file}"
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

document
  .getElementById("leadForm")
  .addEventListener("submit", async e => {
    e.preventDefault();

    const status = document.getElementById("formStatus");
    const data = Object.fromEntries(
      new FormData(e.target).entries()
    );

    status.textContent = "Sending…";

    const ok = await postLead(data);

    status.textContent = ok
      ? "Request received. We'll review the information and follow up."
      : "Something went wrong. Please try again or book a strategy call directly.";

    if(ok) {
      e.target.reset();
    }
  });

function calc() {
  const calls = Math.max(
    0,
    Number(document.getElementById("missedCalls").value) || 0
  );

  const avg = Math.max(
    0,
    Number(document.getElementById("avgJob").value) || 0
  );

  const rate = Math.min(
    100,
    Math.max(
      0,
      Number(document.getElementById("bookingRate").value) || 0
    )
  ) / 100;

  const loss = calls * rate * avg;

  document.getElementById("loss").textContent =
    loss.toLocaleString("en-US", {
      style:"currency",
      currency:"USD",
      maximumFractionDigits:0
    });
}

["missedCalls","avgJob","bookingRate"].forEach(id =>
  document
    .getElementById(id)
    .addEventListener("input", calc)
);

calc();

window.addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;

  document.querySelector(".progress").style.width =
    (h > 0 ? (scrollY / h) * 100 : 0) + "%";
});

document.addEventListener("keydown", e => {
  if(e.key === "Escape") {
    closeModal();
  }
});
