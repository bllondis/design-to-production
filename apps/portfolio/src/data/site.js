// Site-wide content: identity, contact points and navigation.

export const person = {
  name: "Tetiana Dovgalenko",
  email: "tetiana.dovgalenko@gmail.com",
  linkedin: "https://nl.linkedin.com/in/tanya-dovgalenko",
  github: "https://github.com/bllondis",
};

export const cv = "/Tetiana_Dovgalenko_Resume.pdf";

export const contactLinks = [
  { label: "Email", detail: person.email, href: `mailto:${person.email}` },
  { label: "LinkedIn", detail: "in/tanya-dovgalenko", href: person.linkedin, external: true },
  { label: "GitHub", detail: "bllondis", href: person.github, external: true },
  { label: "CV", detail: "PDF", href: cv, external: true },
];

export const primaryNav = [
  { label: "CV", href: cv, external: true },
  { label: "GitHub", href: person.github, external: true },
  { label: "LinkedIn", href: person.linkedin, external: true },
];

export const projectHomeAction = {
  label: "Home",
  mobileLabel: "←",
  ariaLabel: "Back to home",
  href: "/#top",
};

export const footerColumns = [
  {
    title: "Contact",
    links: contactLinks,
  },
  {
    title: "Capabilities",
    links: [
      { label: "Design Systems", href: "/#systems-title" },
      { label: "AI Product Building", href: "/#ai-building-title" },
      { label: "AI-Built Mobile Apps", href: "/#ai-mobile-title" },
      { label: "Greenfield Enterprise", href: "/#greenfield-title" },
      { label: "Mature Enterprise", href: "/#mature-title" },
    ],
  },
  {
    title: "Cases",
    links: [
      { label: "Design to production", href: "/work/design-to-production/" },
      { label: "Timeflow", href: "/work/timeflow/" },
      { label: "DutchWaffle", href: "/work/dutchwaffle/" },
      { label: "DocuStream", href: "/work/docustream/" },
      { label: "BookIT", href: "/work/bookit/" },
    ],
  },
  {
    title: "Navigate",
    links: [
      { label: "Work", href: "/#work" },
      { label: "About", href: "/#about" },
      { label: "Design system", href: "/system/" },
      { label: "Back to top", href: "/#top" },
    ],
  },
];
