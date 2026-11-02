// Site-wide content: identity, contact points and navigation.

export const person = {
  name: "Tetiana Dovgalenko",
  role: "Product Design + Engineering",
  email: "tetiana.dovgalenko@gmail.com",
  linkedin: "https://nl.linkedin.com/in/tanya-dovgalenko",
};

export const cvRequest = `mailto:${person.email}?subject=CV%20request`;

export const primaryNav = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "CV", href: cvRequest },
  { label: "Contact", href: "/#contact" },
];

export const footerColumns = [
  {
    title: "Contact",
    links: [
      { label: "Email", href: `mailto:${person.email}` },
      { label: "LinkedIn", href: person.linkedin, external: true },
      { label: "Request CV", href: cvRequest },
    ],
  },
  {
    title: "Capabilities",
    links: [
      { label: "Design Systems", href: "/#systems-title" },
      { label: "AI Product Building", href: "/#ai-building-title" },
      { label: "Greenfield Enterprise", href: "/#greenfield-title" },
      { label: "Mature Enterprise", href: "/#mature-title" },
    ],
  },
  {
    title: "Cases",
    links: [
      { label: "TED Design System", href: "/work/ted-design-system/" },
      { label: "Timeflow", href: "/work/timeflow/" },
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
