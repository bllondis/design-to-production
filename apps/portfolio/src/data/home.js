import { chaptersByLocale } from "./capabilities.js";
import { cv, person } from "./site.js";

export const homeLocales = ["en", "uk", "nl"];

const localePaths = {
  en: "/",
  uk: "/uk/",
  nl: "/nl/",
};

// Flags are pixel drawings, not emoji: Windows has no flag emoji and shows the two letters instead.
const languageOptions = [
  { code: "en", shortLabel: "EN", label: "English", flag: "/assets/flag-en.svg", href: localePaths.en },
  { code: "nl", shortLabel: "NL", label: "Nederlands", flag: "/assets/flag-nl.svg", href: localePaths.nl },
  { code: "uk", shortLabel: "UA", label: "Українська", flag: "/assets/flag-uk.svg", href: localePaths.uk },
];

const translations = {
  en: {
    meta: {
      title: "Tetiana Dovgalenko | Product Designer and Design Engineer",
      description:
        "Tetiana Dovgalenko is a Product Designer and Design Engineer working across complex B2B software, AI-assisted products, and design systems.",
      imageAlt: "Tetiana Dovgalenko, Product Design and Design Engineering",
    },
    skipToContent: "Skip to content",
    header: {
      identityLabel: `${person.name}, home`,
      navLabel: "Primary navigation",
      nav: { cv: "CV" },
      languageTrigger: "Change language. Current language: {label}",
      languageMenu: "Languages",
      menuOpen: "Open menu",
      menuClose: "Close menu",
    },
    hero: {
      role: "Product Designer / Design Engineer",
      title: "Complex B2B products\nAI‑assisted workflows\nDesign systems",
    },
    work: {
      ariaLabel: "Capabilities",
      chapterLabel: "Capability",
      skillsLabel: "What I bring",
      openDoor: "Open the pixel door",
      closeDoor: "Close the pixel door",
    },
    method: {
      label: "Working method / System to interface",
      title: "Model the system before\npolishing the interface",
      intro: "From understanding the domain to validating how the system behaves in the product",
      steps: [
        ["Understand", "Domain, rules, constraints"],
        ["Model", "States, relationships, edge cases"],
        ["Reduce", "Hierarchy, guidance, disclosure"],
        ["Prototype", "Flows, behaviour, critical states"],
        ["Build", "Components, feasibility, implementation"],
        ["Validate", "Behaviour, edge cases, iteration"],
      ],
    },
    about: {
      label: "About",
      title: "Hello, I’m Tetiana\nNice to meet you",
      paragraphs: [
        "I like making products that feel clear, considered and visually strong, especially when the system underneath is complex and data-heavy.",
        "Working with AI pushed me closer to code, prototyping and engineering tools. It changed the way I design, because I can now move further from an idea into something that actually works.",
        "Originally from Kyiv, I’ve been based in The Hague since 2018.",
        "Before product design, I worked with fabric, light and composition. I spent six years as a costume artist in film production, studied art history and painting, and I still carry a camera almost everywhere.",
      ],
      photoAlt: "Portrait of Tetiana Dovgalenko on the North Sea dunes",
      practiceLabel: "Beyond product / Visual practice",
      practice: ["Photography", "Fashion", "Costume", "Visual direction"],
      bringLabel: "What I bring",
      bring: [
        "Ideas",
        "Positive energy",
        "Good questions",
        "An eye for detail",
        "Strong opinions about spacing",
        "A camera, usually",
      ],
    },
    contact: {
      title: "Have a complex system that needs to feel simple?",
      body: "I work between product logic, interaction design, and implementation for complex B2B software, AI-assisted products, and design systems.",
      action: "Get in touch",
      links: { email: "Email", linkedin: "LinkedIn", github: "GitHub", cv: "CV", pdf: "PDF" },
      popup: {
        close: "Close",
        copy: "Copy",
        open: "Open",
        copyAria: "Copy {label}",
        copied: "Copied",
        failed: "Can't copy",
        copiedStatus: "{label} copied",
        failedStatus: "Copying failed",
      },
    },
    footer: {
      ariaLabel: "Footer",
      groups: { contact: "Contact", capabilities: "Capabilities", cases: "Cases", navigate: "Navigate" },
      capabilities: [
        "Design Systems",
        "AI Product Building",
        "AI-Built Mobile Apps",
        "Greenfield Enterprise",
        "Mature Enterprise",
      ],
      navigation: { work: "Work", about: "About", system: "Design system", top: "Back to top" },
      legal: `${person.name}. Product Design / Design Engineering.`,
    },
  },
  uk: {
    meta: {
      title: "Тетяна Довгаленко — продуктова дизайнерка та дизайн-інженерка",
      description:
        "Тетяна Довгаленко проєктує складні B2B-продукти, продукти з ШІ та дизайн-системи й доводить дизайн до реалізації.",
      imageAlt: "Тетяна Довгаленко, продуктовий дизайн і дизайн-інженерія",
    },
    skipToContent: "Перейти до основного вмісту",
    header: {
      identityLabel: "Тетяна Довгаленко, головна сторінка",
      navLabel: "Основна навігація",
      nav: { cv: "CV" },
      languageTrigger: "Змінити мову. Поточна мова: {label}",
      languageMenu: "Мови",
      menuOpen: "Відкрити меню",
      menuClose: "Закрити меню",
    },
    hero: {
      role: "Продуктова дизайнерка / Дизайн-інженерка",
      title: "Складні B2B-продукти\nРобочі процеси з ШІ\nДизайн-системи",
    },
    work: {
      ariaLabel: "Напрями роботи",
      chapterLabel: "Напрям роботи",
      skillsLabel: "Що я вмію",
      openDoor: "Відкрити піксельні дверцята",
      closeDoor: "Закрити піксельні дверцята",
    },
    method: {
      label: "Метод роботи / Від системи до інтерфейсу",
      title: "Спочатку моделюю систему,\nпотім допрацьовую інтерфейс",
      intro: "Від розуміння предметної області до перевірки того, як система працює в продукті.",
      steps: [
        ["Зрозуміти", "Предметна область, правила, обмеження"],
        ["Змоделювати", "Стани, зв’язки, нетипові сценарії"],
        ["Спростити", "Ієрархія, підказки, поступове розкриття інформації"],
        ["Створити прототип", "Сценарії, поведінка, критичні стани"],
        ["Реалізувати", "Компоненти, здійсненність, реалізація"],
        ["Перевірити", "Поведінка, нетипові сценарії, доопрацювання"],
      ],
    },
    about: {
      label: "Про мене",
      title: "Привіт, я Тетяна!\nПриємно познайомитися",
      paragraphs: [
        "Мені подобається створювати зрозумілі, продумані й виразні продукти. Особливо коли за інтерфейсом стоїть складна система з великими обсягами даних. Робота з ШІ наблизила мене до коду, прототипування й інженерних інструментів. Це змінило мій підхід до дизайну: тепер я можу довести ідею до того, що справді працює.",
        "Я з Києва, а з 2018 року живу в Гаазі. До продуктового дизайну я працювала з тканиною, світлом і композицією. Шість років була художницею з костюмів у кіно, вивчала історію мистецтва й живопис, а камеру досі майже завжди ношу із собою.",
      ],
      photoAlt: "Портрет Тетяни Довгаленко на дюнах Північного моря",
      practiceLabel: "Поза продуктовим дизайном / Візуальна практика",
      practice: ["Фотографія", "Мода", "Костюм", "Візуальна режисура"],
      bringLabel: "Що я приношу",
      bring: [
        "Ідеї",
        "Позитивну енергію",
        "Хороші запитання",
        "Уважне око",
        "Непохитні переконання щодо відступів",
        "І зазвичай камеру",
      ],
    },
    contact: {
      title: "Як зробити складну систему зрозумілою?",
      body: "Я поєдную продуктову логіку, дизайн взаємодії та реалізацію. Працюю зі складним B2B-софтом, продуктами з ШІ та дизайн-системами.",
      action: "Зв’язатися",
      links: {
        email: "Електронна пошта",
        linkedin: "LinkedIn",
        github: "GitHub",
        cv: "CV",
        pdf: "PDF",
      },
      popup: {
        close: "Закрити",
        copy: "Копіювати",
        open: "Відкрити",
        copyAria: "Скопіювати — {label}",
        copied: "Скопійовано",
        failed: "Не вдалося скопіювати",
        copiedStatus: "{label} скопійовано",
        failedStatus: "Не вдалося скопіювати",
      },
    },
    footer: {
      ariaLabel: "Нижня навігація",
      groups: { contact: "Контакти", capabilities: "Напрями роботи", cases: "Кейси", navigate: "Навігація" },
      capabilities: [
        "Дизайн-системи",
        "Розробка продуктів із ШІ",
        "Мобільні застосунки за допомогою ШІ",
        "Корпоративні продукти з нуля",
        "Розвиток корпоративних продуктів",
      ],
      navigation: { work: "Роботи", about: "Про мене", system: "Дизайн-система", top: "На початок сторінки" },
      legal: "Тетяна Довгаленко. Продуктовий дизайн / Дизайн-інженерія.",
    },
  },
  nl: {
    meta: {
      title: "Tetiana Dovgalenko — productdesigner en design engineer",
      description:
        "Tetiana Dovgalenko ontwerpt complexe B2B-software, producten met AI en designsystemen en brengt haar ontwerpen tot in productie.",
      imageAlt: "Tetiana Dovgalenko, productdesign en design engineering",
    },
    skipToContent: "Direct naar de inhoud",
    header: {
      identityLabel: `${person.name}, home`,
      navLabel: "Hoofdnavigatie",
      nav: { cv: "Cv" },
      languageTrigger: "Taal wijzigen. Huidige taal: {label}",
      languageMenu: "Talen",
      menuOpen: "Menu openen",
      menuClose: "Menu sluiten",
    },
    hero: {
      role: "Productdesigner / Design engineer",
      title: "Complexe B2B-producten\nWorkflows met AI\nDesignsystemen",
    },
    work: {
      ariaLabel: "Expertise",
      chapterLabel: "Expertise",
      skillsLabel: "Wat ik meebreng",
      openDoor: "Pixeldeur openen",
      closeDoor: "Pixeldeur sluiten",
    },
    method: {
      label: "Werkwijze / Van systeem naar interface",
      title: "Eerst het systeem modelleren,\ndan de interface verfijnen",
      intro: "Van het domein begrijpen tot toetsen hoe het systeem zich in het product gedraagt.",
      steps: [
        ["Begrijpen", "Domein, regels, randvoorwaarden"],
        ["Modelleren", "Toestanden, relaties, uitzonderingen"],
        ["Vereenvoudigen", "Hiërarchie, begeleiding, informatie stapsgewijs tonen"],
        ["Prototypen", "Flows, gedrag, kritieke toestanden"],
        ["Bouwen", "Componenten, haalbaarheid, implementatie"],
        ["Toetsen", "Gedrag, uitzonderingen, bijsturen"],
      ],
    },
    about: {
      label: "Over mij",
      title: "Hoi, ik ben Tetiana!\nLeuk je te ontmoeten",
      paragraphs: [
        "Ik maak graag producten die helder, doordacht en visueel sterk zijn, vooral als er achter de interface een complex systeem met veel data zit. Door met AI te werken ben ik meer gaan doen met code, prototypes en engineeringtools. Dat heeft mijn manier van ontwerpen veranderd. Ik kan een idee nu verder brengen, tot iets dat echt werkt.",
        "Ik kom uit Kyiv en woon sinds 2018 in Den Haag. Voordat ik productdesigner werd, werkte ik met stof, licht en compositie. Ik werkte zes jaar aan kostuums voor films, studeerde kunstgeschiedenis en schilderkunst en heb nog steeds bijna altijd een camera bij me.",
      ],
      photoAlt: "Portret van Tetiana Dovgalenko in de duinen aan de Noordzee",
      practiceLabel: "Naast productdesign / Visueel werk",
      practice: ["Fotografie", "Mode", "Kostuum", "Visuele regie"],
      bringLabel: "Wat ik meebreng",
      bring: [
        "Ideeën",
        "Positieve energie",
        "Goede vragen",
        "Een scherp oog",
        "Sterke meningen over witruimte",
        "Meestal ook een camera",
      ],
    },
    contact: {
      title: "Hoe maak je een complex systeem begrijpelijk?",
      body: "Ik verbind productlogica, interactieontwerp en implementatie. Ik werk aan complexe B2B-software, producten met AI en designsystemen.",
      action: "Neem contact op",
      links: { email: "E-mail", linkedin: "LinkedIn", github: "GitHub", cv: "Cv", pdf: "PDF" },
      popup: {
        close: "Sluiten",
        copy: "Kopiëren",
        open: "Openen",
        copyAria: "Kopieer {label}",
        copied: "Gekopieerd",
        failed: "Kopiëren is mislukt",
        copiedStatus: "{label} gekopieerd",
        failedStatus: "Kopiëren is mislukt",
      },
    },
    footer: {
      ariaLabel: "Footernavigatie",
      groups: { contact: "Contact", capabilities: "Expertise", cases: "Cases", navigate: "Navigatie" },
      capabilities: [
        "Designsystemen",
        "AI-producten bouwen",
        "Mobiele apps bouwen met AI",
        "Nieuwe bedrijfssoftware",
        "Bedrijfssoftware uitbreiden",
      ],
      navigation: { work: "Werk", about: "Over mij", system: "Designsysteem", top: "Naar boven" },
      legal: `${person.name}. Productdesign / Design engineering.`,
    },
  },
};

const caseLinks = [
  { label: "Design to Production", href: "/work/design-to-production/" },
  { label: "Timeflow", href: "/work/timeflow/" },
  { label: "DutchWaffle", href: "/work/dutchwaffle/" },
  { label: "DocuStream", href: "/work/docustream/" },
  { label: "BookIT", href: "/work/bookit/" },
];

const capabilityAnchors = ["systems", "ai-building", "ai-mobile", "greenfield", "mature"];

export const getHomeContent = (locale = "en") => {
  const content = translations[locale] ?? translations.en;
  const path = localePaths[locale] ?? localePaths.en;
  const anchor = (id) => `${path}#${id}`;
  const contactLinks = [
    { label: content.contact.links.email, detail: person.email, href: `mailto:${person.email}` },
    { label: content.contact.links.linkedin, detail: "in/tanya-dovgalenko", href: person.linkedin, external: true },
    { label: content.contact.links.github, detail: "bllondis", href: person.github, external: true },
    { label: content.contact.links.cv, detail: content.contact.links.pdf, href: cv, external: true },
  ];

  return {
    ...content,
    locale,
    path,
    chapters: chaptersByLocale[locale] ?? chaptersByLocale.en,
    languages: languageOptions.map((language) => ({ ...language, active: language.code === locale })),
    alternates: languageOptions.map(({ code, href }) => ({ lang: code, href })),
    header: {
      ...content.header,
      homeHref: anchor("top"),
      navItems: [
        { label: content.header.nav.cv, href: cv, external: true },
        { label: "GitHub", href: person.github, external: true },
        { label: "LinkedIn", href: person.linkedin, external: true },
      ],
    },
    contact: { ...content.contact, links: contactLinks },
    footer: {
      ...content.footer,
      columns: [
        { title: content.footer.groups.contact, links: contactLinks },
        {
          title: content.footer.groups.capabilities,
          links: content.footer.capabilities.map((label, index) => ({
            label,
            href: anchor(`${capabilityAnchors[index]}-title`),
          })),
        },
        { title: content.footer.groups.cases, links: caseLinks },
        {
          title: content.footer.groups.navigate,
          links: [
            { label: content.footer.navigation.work, href: anchor("work") },
            { label: content.footer.navigation.about, href: anchor("about") },
            { label: content.footer.navigation.system, href: "/system/" },
            { label: content.footer.navigation.top, href: anchor("top") },
          ],
        },
      ],
    },
  };
};
