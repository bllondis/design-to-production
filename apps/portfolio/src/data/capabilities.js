// Localised capability content for the home page. Technical assets and destinations stay shared so every locale
// points to the same case studies, products and media.

const chapterStructure = [
  {
    id: "engineering",
    number: "01",
    projects: [{ href: "/work/design-to-production/" }, { href: "/work/timeflow/" }, { href: "/work/dutchwaffle/" }],
    blocks: [
      {
        id: "systems",
        action: { href: "/work/design-to-production/" },
        visual: { src: "/work/design-to-production/storybook-tokens.jpg", focus: "0.6 0.35" },
        character: "/assets/pixel-cat.jpg",
        motion: { kind: "walk", sprite: "/assets/pixel-cat-walk.png" },
      },
      {
        id: "ai-building",
        action: { href: "/work/timeflow/" },
        secondary: { href: "https://timeflow-assistant-main.vercel.app/" },
        visual: { src: "/assets/timeflow-review.jpg", focus: "0.62 0.35" },
        character: "/assets/pixel-sloth.jpg",
        motion: { kind: "hang", sprite: "/assets/pixel-sloth-hang.png" },
      },
      {
        id: "ai-mobile",
        action: { href: "/work/dutchwaffle/" },
        secondary: { href: "https://bllondis.github.io/DutchWaffle/" },
        visual: { src: "/work/dutchwaffle/app-flow.jpg", focus: "0.5 0.5" },
        character: "/assets/pixel-waffle.jpg?v=2",
        motion: { kind: "bow", sprite: "/assets/pixel-waffle-walk.png" },
      },
    ],
  },
  {
    id: "product",
    number: "02",
    projects: [{ href: "/work/docustream/" }, { href: "/work/bookit/" }],
    blocks: [
      {
        id: "greenfield",
        action: { href: "/work/docustream/" },
        visual: { src: "/assets/docustream-dashboard.jpg", focus: "0.6 0.45" },
        character: "/assets/pixel-beet.jpg?v=2",
        motion: { kind: "burrow", sprite: "/assets/pixel-beet-walk.png" },
      },
      {
        id: "mature",
        action: { href: "/work/bookit/" },
        visual: { src: "/assets/bookit-floorplan.jpg", focus: "0.6 0.55" },
        character: "/assets/pixel-pigeon.jpg",
        motion: { kind: "fly", walk: "/assets/pixel-pigeon-walk.png", flight: "/assets/pixel-pigeon-fly.png" },
      },
    ],
  },
];

const chapterCopy = {
  en: [
    {
      title: "AI Design Engineering",
      intro:
        "I design the interaction layer between people, product systems, AI, and code, then build enough of it to prove it works.",
      projects: ["Design to production", "Timeflow", "DutchWaffle"],
      blocks: [
        {
          title: "Design Systems",
          statement: "One product language, from Figma to production.",
          body: "I turn repeated product patterns into reusable foundations, components, and implementation rules, then review the built interface for design-code parity.",
          proof: "Proof / Design to production: tokens, Figma, React, CI",
          action: "See it in the design system",
          caption: "Storybook / colour roles from tokens.json",
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
          title: "AI Product Building",
          statement: "From product hypothesis to a deployed, working product.",
          body: "I use AI and code as part of the design process: model the workflow, test behaviour in a functional prototype, connect real services, and ship a focused MVP.",
          proof: "Proof / Timeflow, a live AI product",
          action: "See it in Timeflow",
          secondary: "Open live product",
          caption: "Timeflow / AI draft review",
          skills: [
            "Problem framing and discovery",
            "Workflow and state modelling",
            "Functional AI prototypes",
            "APIs, OAuth, Supabase",
            "React and TypeScript builds",
            "Shipping MVPs to production",
          ],
        },
        {
          title: "AI-Built Mobile Apps",
          statement: "From a clickable prototype to an app on the phone.",
          body: "I design the product in an AI design tool, write the handoff as a spec an agent can build from, then direct and review the build until it matches the design on every platform.",
          proof: "Proof / DutchWaffle, a Dutch learning app",
          action: "See it in DutchWaffle",
          secondary: "Try it in the browser",
          caption: "DutchWaffle / the lesson flow in the Expo build",
          skills: [
            "Prototyping in Claude Design",
            "Handoff specs for AI agents",
            "States and acceptance criteria",
            "Expo and React Native",
            "Character and brand systems",
            "Cross-platform QA",
          ],
        },
      ],
    },
    {
      title: "Product Design",
      intro:
        "I make dense enterprise domains understandable, whether the product starts from a blank page or already serves hundreds of thousands of people.",
      projects: ["DocuStream", "BookIT"],
      blocks: [
        {
          title: "Greenfield Enterprise Products",
          statement: "Making complex systems understandable from day one.",
          body: "I translate domain rules into information architecture, role-aware workflows, and guidance that helps people complete high-stakes tasks with confidence.",
          proof: "Proof / DocuStream, 100+ document types, 6 roles",
          action: "See it in DocuStream",
          caption: "DocuStream / Filings dashboard",
          skills: [
            "Domain modelling",
            "Information architecture",
            "Role-based workflows",
            "Lifecycle and state design",
            "Progressive guidance",
            "Complex rules and reusable patterns",
          ],
        },
        {
          title: "Extending Mature Enterprise Products",
          statement: "New behaviour, in a language people already know.",
          body: "I add capability to established products with large operational datasets, without disrupting the mental models, interaction patterns and product language people already rely on.",
          proof: "Proof / BookIT, 200K+ users, 1,200+ locations",
          action: "See it in BookIT",
          caption: "BookIT / Floorplan editor",
          skills: [
            "Auditing existing systems",
            "Designing within an established language",
            "Data-heavy workflows and retrieval patterns",
            "New features at enterprise scale",
            "Protecting user mental models",
            "Alignment with product and engineering",
          ],
        },
      ],
    },
  ],
  uk: [
    {
      title: "Дизайн-\nінженерія\nз ШІ",
      intro:
        "Я проєктую, як люди взаємодіють із продуктом і ШІ, а потім реалізую ключові сценарії в коді, щоб перевірити, як вони працюють.",
      projects: ["Design to Production", "Timeflow", "DutchWaffle"],
      blocks: [
        {
          title: "Дизайн-системи",
          statement: "Єдина мова продукту, від Figma до продакшену.",
          body: "Я перетворюю повторювані рішення на спільну основу, компоненти й правила реалізації. Потім перевіряю, чи відповідає готовий інтерфейс дизайну.",
          proof: "Приклад / Design to Production: токени, Figma, React, CI",
          action: "Переглянути дизайн-систему",
          caption: "Storybook / Ролі кольорів із tokens.json",
          skills: [
            "Основи дизайн-системи й дизайн-токени",
            "Архітектура компонентів і варіанти",
            "Перевірка відповідності між Figma та кодом",
            "React, TypeScript, Tailwind",
            "Доступність із самого початку",
            "Документація та впровадження",
          ],
        },
        {
          title: "Розробка продуктів із ШІ",
          statement: "Від продуктової гіпотези до запуску робочого продукту.",
          body: "Я використовую ШІ й код у процесі дизайну: моделюю робочий процес, перевіряю поведінку продукту на функціональному прототипі, підключаю реальні сервіси й запускаю MVP із ключовими функціями.",
          proof: "Приклад / Timeflow, ШІ-продукт у продакшені",
          action: "Переглянути кейс Timeflow",
          secondary: "Відкрити продукт",
          caption: "Timeflow / Перевірка чернетки, створеної ШІ",
          skills: [
            "Дослідження й формулювання проблеми",
            "Моделювання робочих процесів і станів",
            "Функціональні прототипи з ШІ",
            "API, OAuth, Supabase",
            "Розробка на React і TypeScript",
            "Запуск MVP у продакшені",
          ],
        },
        {
          title: "Мобільні застосунки за допомогою ШІ",
          statement: "Від інтерактивного прототипу до застосунку на телефоні.",
          body: "Я проєктую застосунок в інструменті дизайну з ШІ й готую специфікацію, за якою ШІ-агент може його зібрати. Потім спрямовую розробку й перевіряю, чи відповідає реалізація дизайну на кожній платформі.",
          proof: "Приклад / DutchWaffle, застосунок для вивчення нідерландської",
          action: "Переглянути кейс DutchWaffle",
          secondary: "Спробувати в браузері",
          caption: "DutchWaffle / Як проходить урок у версії на Expo",
          skills: [
            "Прототипування в Claude Design",
            "Специфікації для ШІ-агентів",
            "Стани й критерії приймання",
            "Expo та React Native",
            "Персонажі та візуальна система бренду",
            "Тестування на різних платформах",
          ],
        },
      ],
    },
    {
      title: "Продуктовий дизайн",
      intro:
        "Я роблю складні бізнес-процеси зрозумілими для користувачів. І коли продукт лише починає формуватися, і коли ним уже користуються сотні тисяч людей.",
      projects: ["DocuStream", "BookIT"],
      blocks: [
        {
          title: "Корпоративні продукти з нуля",
          statement: "Складна система, зрозуміла з першого дня.",
          body: "Я перетворюю правила предметної області на інформаційну архітектуру, сценарії для різних ролей і підказки, які допомагають упевнено виконувати відповідальні завдання.",
          proof: "Приклад / DocuStream, понад 100 типів документів, 6 ролей",
          action: "Переглянути кейс DocuStream",
          caption: "DocuStream / Панель подання документів",
          skills: [
            "Моделювання предметної області",
            "Інформаційна архітектура",
            "Робочі процеси для різних ролей",
            "Проєктування життєвих циклів і станів",
            "Покрокові підказки",
            "Складні правила й повторно використовувані рішення",
          ],
        },
        {
          title: "Розвиток корпоративних продуктів",
          statement: "Нові можливості у знайомому інтерфейсі.",
          body: "Я додаю можливості до продуктів, які вже працюють із великими обсягами операційних даних. Нові функції вписуються у звичну логіку продукту й те, як люди вже ним користуються.",
          proof: "Приклад / BookIT, понад 200 тис. користувачів, понад 1 200 локацій",
          action: "Переглянути кейс BookIT",
          caption: "BookIT / Редактор планів поверхів",
          skills: [
            "Аудит наявних систем",
            "Дизайн у межах усталеної мови продукту",
            "Сценарії роботи з великими обсягами даних і способи пошуку",
            "Нові функції в масштабі великих компаній",
            "Збереження звичної для користувачів логіки",
            "Узгодження рішень із продуктовою та інженерною командами",
          ],
        },
      ],
    },
  ],
  nl: [
    {
      title: "Design engineering met AI",
      intro:
        "Ik ontwerp hoe mensen met een product en AI werken. Daarna bouw ik de belangrijkste interacties om te toetsen of ze in de praktijk werken.",
      projects: ["Design to Production", "Timeflow", "DutchWaffle"],
      blocks: [
        {
          title: "Designsystemen",
          statement: "Eén producttaal, van Figma tot productie.",
          body: "Ik vertaal terugkerende patronen naar herbruikbare bouwstenen, componenten en implementatieregels. Daarna controleer ik of de gebouwde interface overeenkomt met het ontwerp.",
          proof: "In de praktijk / Design to Production: tokens, Figma, React, CI",
          action: "Bekijk het designsysteem",
          caption: "Storybook / Kleurrollen uit tokens.json",
          skills: [
            "Fundamenten en designtokens",
            "Componentarchitectuur en varianten",
            "Afstemming tussen Figma en code",
            "React, TypeScript, Tailwind",
            "Toegankelijkheid vanaf het begin",
            "Documentatie en adoptie",
          ],
        },
        {
          title: "AI-producten bouwen",
          statement: "Van producthypothese tot een werkend product dat live staat.",
          body: "AI en code zijn onderdeel van mijn ontwerpproces. Ik modelleer de workflow, test het gedrag in een werkend prototype, koppel echte diensten en lanceer een MVP met de belangrijkste functies.",
          proof: "In de praktijk / Timeflow, een live AI-product",
          action: "Bekijk de Timeflow-case",
          secondary: "Open het product",
          caption: "Timeflow / Een AI-concept beoordelen",
          skills: [
            "Probleemverkenning en -definitie",
            "Workflows en toestanden modelleren",
            "Werkende AI-prototypes",
            "API’s, OAuth, Supabase",
            "Bouwen met React en TypeScript",
            "MVP’s naar productie brengen",
          ],
        },
        {
          title: "Mobiele apps bouwen met AI",
          statement: "Van klikbaar prototype tot een app op je telefoon.",
          body: "Ik ontwerp de app met een AI-designtool en schrijf een specificatie waarmee een AI-agent de app kan bouwen. Daarna stuur ik de ontwikkeling aan en controleer ik op elk platform of de app overeenkomt met het ontwerp.",
          proof: "In de praktijk / DutchWaffle, een app om Nederlands te leren",
          action: "Bekijk de DutchWaffle-case",
          secondary: "Probeer het in je browser",
          caption: "DutchWaffle / Een les doorlopen in de Expo-build",
          skills: [
            "Prototypen in Claude Design",
            "Overdrachtsspecificaties voor AI-agents",
            "Toestanden en acceptatiecriteria",
            "Expo en React Native",
            "Personages en visuele merksystemen",
            "Testen op meerdere platforms",
          ],
        },
      ],
    },
    {
      title: "Productdesign",
      intro:
        "Ik maak complexe bedrijfsprocessen begrijpelijk voor gebruikers, of het product nu vanaf nul begint of al door honderdduizenden mensen wordt gebruikt.",
      projects: ["DocuStream", "BookIT"],
      blocks: [
        {
          title: "Nieuwe bedrijfssoftware",
          statement: "Complexe systemen die vanaf dag één te begrijpen zijn.",
          body: "Ik vertaal domeinregels naar informatiearchitectuur, workflows per rol en begeleiding waarmee mensen belangrijke taken met vertrouwen kunnen uitvoeren.",
          proof: "In de praktijk / DocuStream, meer dan 100 documenttypen, 6 rollen",
          action: "Bekijk de DocuStream-case",
          caption: "DocuStream / Dashboard voor ingediende documenten",
          skills: [
            "Domeinmodellering",
            "Informatiearchitectuur",
            "Workflows per gebruikersrol",
            "Levenscycli en toestanden ontwerpen",
            "Stapsgewijze begeleiding",
            "Complexe regels en herbruikbare patronen",
          ],
        },
        {
          title: "Bestaande bedrijfssoftware uitbreiden",
          statement: "Nieuwe functies in een vertrouwde producttaal.",
          body: "Ik voeg functies toe aan bestaande producten die met grote hoeveelheden operationele data werken. De uitbreiding sluit aan op hoe gebruikers het product begrijpen, welke interacties ze kennen en welke taal ze gewend zijn.",
          proof: "In de praktijk / BookIT, meer dan 200.000 gebruikers, meer dan 1.200 locaties",
          action: "Bekijk de BookIT-case",
          caption: "BookIT / Plattegrondeditor",
          skills: [
            "Bestaande systemen doorlichten",
            "Ontwerpen binnen een bestaande producttaal",
            "Workflows met veel data en patronen om informatie terug te vinden",
            "Nieuwe functies op enterprise-schaal",
            "Aansluiten op het mentale model van gebruikers",
            "Afstemming met product- en engineeringteams",
          ],
        },
      ],
    },
  ],
};

const hydrateChapters = (localeCopy) =>
  localeCopy.map((chapter, chapterIndex) => {
    const sharedChapter = chapterStructure[chapterIndex];
    return {
      id: sharedChapter.id,
      number: sharedChapter.number,
      title: chapter.title,
      intro: chapter.intro,
      projects: chapter.projects.map((label, projectIndex) => ({
        ...sharedChapter.projects[projectIndex],
        label,
      })),
      blocks: chapter.blocks.map((block, blockIndex) => {
        const sharedBlock = sharedChapter.blocks[blockIndex];
        return {
          id: sharedBlock.id,
          title: block.title,
          statement: block.statement,
          body: block.body,
          proof: block.proof,
          action: { ...sharedBlock.action, label: block.action },
          ...(sharedBlock.secondary ? { secondary: { ...sharedBlock.secondary, label: block.secondary } } : {}),
          visual: { ...sharedBlock.visual, caption: block.caption },
          character: sharedBlock.character,
          ...(sharedBlock.motion ? { motion: sharedBlock.motion } : {}),
          skills: block.skills,
        };
      }),
    };
  });

export const chaptersByLocale = Object.fromEntries(
  Object.entries(chapterCopy).map(([locale, copy]) => [locale, hydrateChapters(copy)]),
);

export const chapters = chaptersByLocale.en;
