// Content for the capability chapters on the home page.
// Add a block here and the page renders it with the same component; flip alternates automatically.

export const chapters = [
  {
    id: "engineering",
    number: "01",
    title: "AI Design Engineering",
    intro:
      "I design the interaction layer between people, product systems, AI, and code, then build enough of it to prove it works.",
    blocks: [
      {
        id: "systems",
        title: "Design Systems",
        statement: "One product language, from Figma to production.",
        body: "I turn repeated product patterns into reusable foundations, components, and implementation rules, then review the built interface for design-code parity.",
        proof: "Proof / TED Design System, Figma to React",
        action: { label: "See it in the design system", href: "/work/ted-design-system/" },
        visual: {
          src: "/work/ted/react-manager-heatmap.png",
          focus: "0.62 0.45",
          caption: "TED / React heatmap",
        },
        character: "/assets/pixel-cat.jpg",
        skills: [
          "Foundations and design tokens",
          "Component architecture and variants",
          "Figma to code parity reviews",
          "React, TypeScript, Tailwind",
          "Accessibility by default",
          "Documentation and adoption",
        ],
      },
      {
        id: "ai-building",
        title: "AI Product Building",
        statement: "From product hypothesis to a deployed, working product.",
        body: "I use AI and code as part of the design process: model the workflow, test behaviour in a functional prototype, connect real services, and ship a focused MVP.",
        proof: "Proof / Timeflow, a live AI product",
        action: { label: "See it in Timeflow", href: "/work/timeflow/" },
        secondary: { label: "Open live product", href: "https://timeflow-assistant-main.vercel.app/" },
        visual: { src: "/assets/timeflow-review.jpg", focus: "0.62 0.35", caption: "Timeflow / AI draft review" },
        character: "/assets/pixel-waffle.jpg",
        skills: [
          "Problem framing and discovery",
          "Workflow and state modelling",
          "Functional AI prototypes",
          "APIs, OAuth, Supabase",
          "React and TypeScript builds",
          "Shipping MVPs to production",
        ],
      },
    ],
  },
  {
    id: "product",
    number: "02",
    title: "Product Design",
    intro:
      "I make dense enterprise domains understandable, whether the product starts from a blank page or already serves hundreds of thousands of people.",
    blocks: [
      {
        id: "greenfield",
        title: "Greenfield Enterprise Products",
        statement: "Making complex systems understandable from day one.",
        body: "I translate domain rules into information architecture, role-aware workflows, and guidance that helps people complete high-stakes tasks with confidence.",
        proof: "Proof / DocuStream, 100+ document types, 6 roles",
        action: { label: "See it in DocuStream", href: "/work/docustream/" },
        visual: {
          src: "/assets/docustream-dashboard.jpg",
          focus: "0.6 0.45",
          caption: "DocuStream / Filings dashboard",
        },
        character: "/assets/pixel-beet.jpg?v=2",
        skills: [
          "Domain modelling",
          "Information architecture",
          "Role-based workflows",
          "Lifecycle and state design",
          "Progressive guidance",
          "Research and validation",
        ],
      },
      {
        id: "mature",
        title: "Extending Mature Enterprise Products",
        statement: "New behaviour, in a language people already know.",
        body: "I add capability to established products without disrupting the mental models, component language, and operating scale people already rely on.",
        proof: "Proof / BookIT, 200K+ users, 1,200+ locations",
        action: { label: "See it in BookIT", href: "/work/bookit/" },
        visual: { src: "/assets/bookit-floorplan.jpg", focus: "0.6 0.55", caption: "BookIT / Floorplan editor" },
        character: "/assets/pixel-girl.jpg",
        skills: [
          "Auditing existing systems",
          "Designing within an established language",
          "New features at enterprise scale",
          "Protecting user mental models",
          "Alignment with product and engineering",
          "Incremental rollout and iteration",
        ],
      },
    ],
  },
];
