import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const sourcePath = '/Users/kotya/Documents/portfolio-site-3/public/cases/docustream.html';
const outputPath = '/Users/kotya/Documents/Portfolio-new/cases/docustream.html';
const source = readFileSync(sourcePath, 'utf8');

const screenshots = [...source.matchAll(/<img src="(data:image\/[^;]+;base64,[^"]+)" alt="([^"]*)">/g)]
  .map(([, src, alt]) => ({ src, alt }));

if (screenshots.length !== 9) {
  throw new Error(`Expected 9 authentic DocuStream screenshots, found ${screenshots.length}`);
}

const shot = (index) => {
  const image = screenshots[index];
  return `<img src="${image.src}" alt="${image.alt}" loading="lazy" decoding="async">`;
};

let head = source.slice(0, source.indexOf('<body>'));
head = head
  .replace('<title>DocuStream - Case Study · Tetiana Dovgalenko</title>', '<title>DocuStream — Product Design Case Study · Tetiana Dovgalenko</title>\n<meta name="description" content="DocuStream case study — designing a greenfield enterprise UCC filing platform for complex legal workflows.">')
  .replace('&display=swap', '&amp;display=swap')
  .replace(/\n  \/\* LOUPE \*\/[\s\S]*?@media \(hover:hover\) and \(pointer:fine\)\{ \.shot img\{cursor:zoom-in;\} \}\n/, '\n  .shot img{cursor:zoom-in;}\n')
  .replace('</style>', `
  /* CASE-STUDY STORY — reuses the existing visual language */
  .hero-context{
    max-width:680px;margin:28px auto 0;padding-top:22px;
    border-top:1px solid var(--line);
    color:var(--ink-3);font-size:13px;line-height:1.55;
  }
  .principle{
    padding:78px 24px;text-align:center;background:var(--ink);color:#fff;
  }
  .principle .eyebrow{color:#79b8f3;}
  .principle blockquote{
    max-width:780px;margin:0 auto;font-size:clamp(2.25rem,5vw,3.8rem);
    font-weight:500;line-height:1.08;letter-spacing:-.025em;text-wrap:balance;
  }
  .path-grid,.levels{
    max-width:980px;margin:44px auto 0;padding:0 24px;
    display:grid;grid-template-columns:repeat(2,1fr);gap:18px;text-align:left;
  }
  .path-card,.level{
    background:var(--bg-2);border:1px solid var(--line);border-radius:22px;padding:30px;
  }
  section.alt .path-card,section.alt .level{background:#fff;}
  .path-card h3,.level h3{
    margin-bottom:12px;font-size:1.32rem;font-weight:600;letter-spacing:-.015em;
  }
  .path-card p,.level p{color:var(--ink-2);font-size:15.5px;line-height:1.55;}
  .path-card ul{list-style:disc;margin-top:20px;padding:12px 0 0 20px;border-top:1px solid var(--line);}
  .path-card li{padding:7px 0 7px 2px;color:var(--ink-2);font-size:14px;}
  .path-card li::marker{color:var(--accent);}
  .path-label,.level small{
    display:block;margin-bottom:18px;color:var(--accent);font-size:11px;
    font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  }
  .guidance-rule{
    max-width:932px;margin:18px auto 0;padding:22px 28px;
    display:grid;grid-template-columns:1fr 1fr;gap:22px;
    border:1px solid var(--line);border-radius:18px;background:var(--accent-soft);
    color:var(--ink);font-size:16px;font-weight:600;text-align:left;
  }
  .guidance-rule span:last-child{color:var(--accent);}
  .levels{grid-template-columns:repeat(3,1fr);}
  .level{padding:26px;}
  .level small{margin-bottom:12px;}
  .evidence-sequence{max-width:1040px;margin:52px auto 0;}
  .evidence-sequence .shot{margin-top:44px;}
  .evidence-sequence .shot:first-child{margin-top:0;}
  .shot figcaption{
    max-width:720px;margin:15px auto 0;color:var(--ink-3);
    font-size:13px;line-height:1.5;text-align:center;
  }
  .edge-list{
    max-width:980px;margin:44px auto 0;padding:0;
    display:grid;grid-template-columns:repeat(2,1fr);gap:1px;
    background:var(--line);border:1px solid var(--line);border-radius:22px;overflow:hidden;
  }
  .edge-item{padding:22px 26px;background:#fff;text-align:left;}
  .edge-item dt{font-weight:600;font-size:16px;}
  .edge-item dd{margin-top:4px;color:var(--ink-2);font-size:14px;}
  section.alt .edge-item{background:var(--bg-2);}
  .cards.two{grid-template-columns:repeat(2,1fr);}
  @media (max-width:760px){
    .path-grid,.levels,.guidance-rule,.edge-list,.cards.two{grid-template-columns:1fr;}
    .path-grid,.levels,.edge-list{margin-left:18px;margin-right:18px;padding:0;}
    .guidance-rule{margin-left:18px;margin-right:18px;}
    .principle{padding:64px 18px;}
  }
  @media (prefers-reduced-motion:reduce){
    .lightbox,.lightbox img,.lightbox img.swapping{transition:none!important;}
  }
</style>`);

const body = `<body>
  <nav class="nav" aria-label="Case study navigation">
    <div class="nav-inner">
      <div class="nav-left"><a class="nav-home" href="../index.html#docustream-case">&#8592;&nbsp;Back</a></div>
      <div class="nav-center"><span class="nav-brand">DocuStream <span>· Case Study</span></span></div>
      <span class="nav-meta">Tetiana Dovgalenko — UX/UI Designer</span>
    </div>
  </nav>

  <main>
    <header class="hero">
      <div class="wrap">
        <p class="eyebrow">Case Study · Enterprise legal-tech</p>
        <h1>Designing confidence into <em>high-stakes legal filing</em></h1>
        <p class="hero-sub">DocuStream is a greenfield enterprise platform for managing UCC filings across US jurisdictions — a regulated process where users need to understand what information is required, where a filing stands, and what actions are possible next.</p>
        <p class="hero-sub">As the UX/UI Designer, I helped shape the product experience from the ground up, translating legal and business requirements into clear workflows, system states and reusable interaction patterns.</p>
        <div class="chips" aria-label="Project context">
          <span class="chip accent">Greenfield product</span>
          <span class="chip">UX/UI Designer · Product design scope</span>
          <span class="chip">2025–2026</span>
          <span class="chip">Enterprise SaaS / Legal-tech</span>
          <span class="chip">Shipped to production</span>
        </div>
        <p class="hero-context">Screens and data have been adapted for portfolio use to protect confidential information. The workflow structure, interaction logic and design decisions shown here reflect the production work.</p>
      </div>
    </header>

    <section class="stats" aria-label="System complexity">
      <div class="stats-inner">
        <div><div class="stat-num">100<em>+</em></div><div class="stat-label">Legal document types and forms</div></div>
        <div><div class="stat-num">7<em>+</em></div><div class="stat-label">Lifecycle states</div></div>
        <div><div class="stat-num">6</div><div class="stat-label">User roles</div></div>
      </div>
    </section>

    <section class="narr reveal">
      <div class="wrap">
        <p class="eyebrow">Problem</p>
        <h2>A product model for regulated filing work</h2>
        <p class="lead">DocuStream was a greenfield product. We had legal rules, business requirements, client requests and established filing processes — but no product interaction model yet.</p>
      </div>
    </section>

    <section class="narr alt reveal">
      <div class="wrap">
        <p class="eyebrow">Approach</p>
        <h2>Translate requirements into interaction rules</h2>
        <p class="lead">I worked with the Design Lead, PM/BA, engineers and client-side filing specialists to translate those inputs into interaction rules: what information was required, what changed by jurisdiction or filing state, what needed explanation, and which actions should become available next.</p>
      </div>
    </section>

    <section class="principle reveal" aria-label="Central design principle">
      <p class="eyebrow">Central design principle</p>
      <blockquote>Reveal complexity when it becomes actionable.</blockquote>
    </section>

    <section class="narr reveal">
      <div class="wrap">
        <p class="eyebrow">Filing creation</p>
        <h2>One filing system, two levels of guidance</h2>
        <p class="lead">The product intentionally supports two parallel filing paths instead of forcing every user through the same workflow.</p>
      </div>
      <div class="path-grid">
        <article class="path-card">
          <span class="path-label">Guided Wizard</span>
          <h3>Structure when confidence needs support</h3>
          <p>For users who benefit from additional structure and guidance.</p>
          <ul><li>Debtors → Secured Parties → Collateral → Other → County fields</li><li>Contextual instructions</li><li>Progressive disclosure</li><li>Persistent filing context</li><li>Conditional fields</li><li>Save as draft</li></ul>
        </article>
        <article class="path-card">
          <span class="path-label">In-form</span>
          <h3>Direct access for filing expertise</h3>
          <p>A more direct filing path for experienced filing specialists who already understand the filing structure.</p>
          <ul><li>Direct form access</li><li>Enter all filing data in one continuous form</li><li>See the complete filing structure at once</li><li>Review how the information will appear in the document</li></ul>
        </article>
      </div>
      <!-- TODO: add authentic In-form screenshot if portfolio-safe -->
      <div class="guidance-rule"><span>More guidance where confidence was needed.</span><span>Less friction where expertise already existed.</span></div>
      <figure class="shot">${shot(2)}<figcaption>The Guided Wizard turns a complex filing into five reviewable stages while keeping filing context available throughout.</figcaption></figure>
    </section>

    <section class="feature alt reveal">
      <div class="wrap">
        <p class="eyebrow">Guided Wizard · Supporting pattern</p>
        <h2>Guidance without leaving the task</h2>
        <p class="lead">Filing rules often need explanation at the exact moment information is entered. The contextual instructions panel keeps guidance beside the active filing step, so users can reference legal information without losing form state or orientation.</p>
      </div>
      <figure class="shot">${shot(3)}<figcaption>Contextual instructions use the same overlay language as other secondary information in the product.</figcaption></figure>
    </section>

    <section class="narr reveal">
      <div class="wrap">
        <p class="eyebrow">Lifecycle design</p>
        <h2>Status is a behaviour system, not a badge</h2>
        <p class="lead">A filing continues long after submission. Its state determines what information matters, what needs attention and which actions become available.</p>
      </div>
      <div class="levels">
        <article class="level"><small>Portfolio</small><h3>Where does each filing stand?</h3><p>Status keeps a large body of work scannable.</p></article>
        <article class="level"><small>Document</small><h3>What is happening with this filing?</h3><p>Metadata, dates and warnings explain the current record.</p></article>
        <article class="level"><small>Action</small><h3>What can I do next?</h3><p>Available operations respond to the filing state.</p></article>
      </div>
      <div class="evidence-sequence">
        <figure class="shot">${shot(1)}<figcaption>Portfolio — status, jurisdiction, ownership and dates make filings comparable.</figcaption></figure>
        <figure class="shot">${shot(4)}<figcaption>Document — the filing record keeps legal content and persistent context together.</figcaption></figure>
        <figure class="shot">${shot(6)}<figcaption>State change — completion updates the relevant metadata and introduces a jurisdiction-specific warning without changing the underlying structure.</figcaption></figure>
      </div>
    </section>

    <section class="feature alt reveal">
      <div class="wrap">
        <p class="eyebrow">Progressive disclosure</p>
        <h2>Keep specialist actions available without keeping them visible</h2>
        <p class="lead">Specialist operations are essential in context but irrelevant most of the time. Contextual menus, side panels and focused modals keep these actions available without turning the document view into a control panel.</p>
      </div>
      <div class="evidence-sequence">
        <figure class="shot">${shot(5)}<figcaption>Contextual actions expose state-dependent filing operations, including UCC3 and UCC5.</figcaption></figure>
        <figure class="shot">${shot(7)}<figcaption>A side panel reveals official filing details while preserving the document as the primary context.</figcaption></figure>
        <figure class="shot">${shot(8)}<figcaption>A focused modal gives generated filing evidence a dedicated reading context.</figcaption></figure>
      </div>
    </section>

    <section class="narr reveal">
      <div class="wrap">
        <p class="eyebrow">Edge-case thinking</p>
        <h2>In regulated software, edge cases are part of the product</h2>
        <p class="lead">The main flow was only one part of the system. Exceptions, deadlines and jurisdiction rules needed the same interaction logic as the everyday path.</p>
      </div>
      <dl class="edge-list">
        <div class="edge-item"><dt>Jurisdiction-specific fields</dt><dd>Conditional requirements</dd></div>
        <div class="edge-item"><dt>Lapse deadlines</dt><dd>Time-sensitive visibility</dd></div>
        <div class="edge-item"><dt>Paper file requests</dt><dd>Alternate workflow path</dd></div>
        <div class="edge-item"><dt>Multi-page addenda</dt><dd>Scalable document structure</dd></div>
        <div class="edge-item"><dt>Conditional fields</dt><dd>Progressive disclosure</dd></div>
        <div class="edge-item"><dt>Jurisdiction caveats</dt><dd>Context-specific guidance</dd></div>
        <div class="edge-item"><dt>UCC3 / UCC5</dt><dd>State-dependent follow-on filing</dd></div>
        <div class="edge-item"><dt>Post-submission actions</dt><dd>Lifecycle-aware availability</dd></div>
      </dl>
    </section>

    <section class="feature alt reveal">
      <div class="wrap">
        <p class="eyebrow">Portfolio operations</p>
        <h2>From individual filings to portfolio operations</h2>
        <p class="lead">Clear individual workflows were only one part of the product. Teams also needed visibility across filings, owners, statuses and deadlines.</p>
        <div class="tags" aria-label="Portfolio visibility"><span class="tag">Filing status</span><span class="tag">Submission volume</span><span class="tag">Assignee workload</span><span class="tag">Lapse tracking</span></div>
      </div>
      <figure class="shot">${shot(0)}<figcaption>The dashboard connects individual filing work to the wider operational picture.</figcaption></figure>
    </section>

    <section class="narr reveal">
      <div class="wrap">
        <p class="eyebrow">Outcome</p>
        <h2>All workflows shown in this case shipped to production.</h2>
        <p class="lead">DocuStream established a consistent product model for creating, managing and acting on UCC filings across different levels of user expertise, filing states and jurisdiction-specific requirements.</p>
        <p class="lead">The same interaction patterns provided a foundation for additional forms and workflows as the product expanded.</p>
      </div>
    </section>

    <section class="learnings alt reveal">
      <div class="head wrap">
        <p class="eyebrow">Reflection</p>
        <h2>What I took forward</h2>
      </div>
      <div class="cards two">
        <article class="card"><h3>Domain knowledge is design material</h3><p>In specialised products, understanding the rules changes the quality of every interaction decision — from labels and validation to warnings, actions and workflow structure.</p></article>
        <article class="card"><h3>Model the system before the screens</h3><p>If I approached the project again, I would formalise states, conditional rules, warnings and available actions even earlier as a shared artifact for design, product and engineering.</p></article>
      </div>
    </section>
  </main>

  <footer>
    <span>Tetiana Dovgalenko — UX/UI Designer</span>
    <a href="mailto:tetiana.dovgalenko@gmail.com">tetiana.dovgalenko@gmail.com</a>
  </footer>

  <div class="lightbox" role="dialog" aria-modal="true" aria-label="Expanded product screenshot" aria-hidden="true" inert>
    <button class="lightbox-close" aria-label="Close image">&times;</button>
    <button class="lightbox-nav lightbox-prev" aria-label="Previous image">&#8249;</button>
    <button class="lightbox-nav lightbox-next" aria-label="Next image">&#8250;</button>
    <img alt="">
  </div>

  <script>
    const reveals = document.querySelectorAll('.reveal');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('in'));
    } else {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      reveals.forEach(el => observer.observe(el));
    }

    const shotImages = [...document.querySelectorAll('.shot img')];
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = lightbox.querySelector('img');
    const closeButton = lightbox.querySelector('.lightbox-close');
    let currentIndex = 0;
    let lastFocused = null;

    function showImage(index) {
      currentIndex = (index + shotImages.length) % shotImages.length;
      const image = shotImages[currentIndex];
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
    }

    function openLightbox(index) {
      lastFocused = document.activeElement;
      showImage(index);
      lightbox.classList.add('on');
      lightbox.setAttribute('aria-hidden', 'false');
      lightbox.removeAttribute('inert');
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('on');
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.setAttribute('inert', '');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    shotImages.forEach((image, index) => {
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', 'Open image: ' + image.alt);
      image.addEventListener('click', () => openLightbox(index));
      image.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(index);
        }
      });
    });

    closeButton.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', event => { event.stopPropagation(); showImage(currentIndex - 1); });
    lightbox.querySelector('.lightbox-next').addEventListener('click', event => { event.stopPropagation(); showImage(currentIndex + 1); });
    lightboxImage.addEventListener('click', event => event.stopPropagation());
    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', event => {
      if (!lightbox.classList.contains('on')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (event.key === 'ArrowRight') showImage(currentIndex + 1);
      if (event.key === 'Tab') {
        const controls = [...lightbox.querySelectorAll('button')];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  </script>
</body>
</html>`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${head}${body}`);
console.log(`Wrote ${outputPath}`);
