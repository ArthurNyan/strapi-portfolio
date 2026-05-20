module.exports = [
  {
    legacyId: '1',
    sourceKey: 'github:ArthurNyan:Education-Portfolio',
    slug: 'uchebnoe-portfolio',
    githubUrl: 'https://github.com/ArthurNyan/Education-Portfolio',
    demoUrl: 'https://education-portfolio.vercel.app',
    link: 'https://education-portfolio.vercel.app',
    techStack: ['React', 'JavaScript', 'SCSS', 'Vercel'],
    featured: false,
    date: '2023-12-26',
    links: [
      { title: 'GitHub', link: 'https://github.com/ArthurNyan/Education-Portfolio' },
      { title: 'Demo', link: 'https://education-portfolio.vercel.app' },
    ],
    locales: {
      ru: {
        name: 'Образовательное портфолио',
        about:
          'Персональный сайт-портфолио, собранный как отдельный продукт для презентации учебных и pet-проектов.\n\nПроект фокусируется на структуре контента, аккуратной витрине работ и адаптивной подаче без тяжёлого бэкенда.',
      },
      en: {
        name: 'Education Portfolio',
        about:
          'A personal portfolio website built as a dedicated showcase for academic work and early pet projects.\n\nThe project focuses on content structure, lightweight presentation, and a responsive browsing experience without a heavy backend.',
      },
    },
  },
  {
    legacyId: '2',
    sourceKey: 'github:ArthurNyan:Integral-calculator',
    slug: 'kalkulyaor-integralov-diffurov-i-nelineynyh-uravneniy',
    githubUrl: 'https://github.com/ArthurNyan/Integral-calculator',
    demoUrl: 'http://www.arthurmail.ru',
    link: 'http://www.arthurmail.ru',
    techStack: ['TypeScript', 'Numerical Methods', 'Algorithms', 'Math UI'],
    featured: false,
    date: '2023-12-13',
    links: [
      { title: 'GitHub', link: 'https://github.com/ArthurNyan/Integral-calculator' },
      { title: 'Demo', link: 'http://www.arthurmail.ru' },
    ],
    locales: {
      ru: {
        name: 'Калькулятор интегралов, дифференциальных и нелинейных уравнений',
        about:
          'Университетское приложение для численных расчётов: интегралы, дифференциальные уравнения и нелинейные системы в одном интерфейсе.\n\nЦенность проекта в алгоритмической части: он объединяет несколько математических методов в едином TypeScript-приложении, а не сводится к простому CRUD.',
      },
      en: {
        name: 'Integral, Differential Equation, and Nonlinear Solver',
        about:
          'A university application for numerical calculations: integrals, differential equations, and nonlinear systems in a single interface.\n\nIts value is primarily algorithmic: the project combines several mathematical methods inside one TypeScript application rather than acting as a basic CRUD demo.',
      },
    },
  },
  {
    sourceKey: 'github:ArthurNyan:portfolio-platform',
    slug: 'portfolio-platform',
    githubUrl: 'https://github.com/ArthurNyan/next-portfolio',
    demoUrl: 'https://malos.ru',
    link: 'https://malos.ru',
    techStack: ['Next.js 14', 'React', 'TypeScript', 'Strapi 5', 'SCSS Modules', 'SQLite', 'i18n'],
    featured: true,
    date: '2025-12-29',
    links: [
      { title: 'Frontend repo', link: 'https://github.com/ArthurNyan/next-portfolio' },
      { title: 'CMS repo', link: 'https://github.com/ArthurNyan/strapi-portfolio' },
      { title: 'Demo', link: 'https://malos.ru' },
    ],
    locales: {
      ru: {
        name: 'Portfolio Platform',
        about:
          'Актуальная версия моего портфолио как двухчастной платформы: Next.js-фронтенд и отдельный Strapi CMS как единый source of truth.\n\nПроект включает локализации ru/en, типизированную интеграцию со Strapi, блог, CV и витрину проектов. Это уже не статический сайт, а production-like контентная платформа с разделённой ответственностью между фронтендом и CMS.',
      },
      en: {
        name: 'Portfolio Platform',
        about:
          'The current version of my portfolio built as a two-part platform: a Next.js frontend and a separate Strapi CMS as the single source of truth.\n\nThe project includes ru/en localization, typed Strapi integration, a blog, CV pages, and a project showcase. It is no longer a static website but a production-like content platform with clear frontend/CMS separation.',
      },
    },
  },
  {
    sourceKey: 'github:ArthurNyan:blog-monorepo',
    slug: 'headless-blog-platform',
    githubUrl: 'https://github.com/ArthurNyan/blog-monorepo',
    demoUrl: 'https://astro.hakyan.ru/',
    link: 'https://astro.hakyan.ru/',
    techStack: ['Astro 6', 'React 19', 'Tailwind 4', 'Strapi 5', 'TypeScript', 'Nx', 'pnpm', 'OpenAPI'],
    featured: true,
    date: '2026-05-18',
    links: [
      { title: 'GitHub', link: 'https://github.com/ArthurNyan/blog-monorepo' },
      { title: 'Legacy frontend repo', link: 'https://github.com/ArthurNyan/blog-astro-front' },
      { title: 'Legacy CMS repo', link: 'https://github.com/ArthurNyan/blog-backend-strapi' },
      { title: 'Demo', link: 'https://astro.hakyan.ru/' },
    ],
    locales: {
      ru: {
        name: 'Headless Blog Platform',
        about:
          'Headless-блог, собранный в Nx-монорепо: Strapi CMS в `apps/cms`, Astro-фронтенд в `apps/front`, единый dev/build pipeline на pnpm.\n\nСильная сторона проекта в архитектуре и tooling: запуск нескольких приложений одной командой, генерация API-клиента из OpenAPI и разделение на CMS + presentation layer без ручной синхронизации контрактов.',
      },
      en: {
        name: 'Headless Blog Platform',
        about:
          'A headless blog built inside an Nx monorepo: Strapi CMS in `apps/cms`, Astro frontend in `apps/front`, and a shared pnpm-based dev/build pipeline.\n\nThe project stands out for architecture and tooling: multi-app orchestration, OpenAPI-based client generation, and a clean CMS plus presentation-layer split without manual contract syncing.',
      },
    },
  },
  {
    sourceKey: 'github:ArthurNyan:voice-transcript',
    slug: 'voice-transcript',
    githubUrl: 'https://github.com/ArthurNyan/voice-transcript',
    demoUrl: 'https://voice-transcript-eight.vercel.app',
    link: 'https://voice-transcript-eight.vercel.app',
    techStack: ['FastAPI', 'Python', 'faster-whisper', 'Uvicorn', 'FFmpeg', 'HTML', 'JavaScript'],
    featured: true,
    date: '2026-03-26',
    links: [
      { title: 'GitHub', link: 'https://github.com/ArthurNyan/voice-transcript' },
      { title: 'Demo', link: 'https://voice-transcript-eight.vercel.app' },
    ],
    locales: {
      ru: {
        name: 'Voice Transcript',
        about:
          'Веб-приложение для транскрибации речи и аудиофайлов на базе `faster-whisper` с поддержкой локального запуска и деплоя в облако.\n\nВ продукте есть запись с микрофона, загрузка файлов, фоновая обработка длинных записей, прогресс по этапам и экспорт результатов в TXT/JSON. Это прикладной AI-сервис, а не просто демонстрация модели.',
      },
      en: {
        name: 'Voice Transcript',
        about:
          'A web application for transcribing speech and audio files with `faster-whisper`, designed to run both locally and in the cloud.\n\nIt supports microphone recording, file uploads, background processing for long recordings, step-based progress tracking, and TXT/JSON export. This makes it a practical AI service rather than a bare model demo.',
      },
    },
  },
  {
    sourceKey: 'github:ArthurNyan:FSDGen',
    slug: 'fsdgen-cli',
    githubUrl: 'https://github.com/ArthurNyan/FSDGen',
    link: 'https://github.com/ArthurNyan/FSDGen',
    techStack: ['Node.js', 'CLI', 'JavaScript', 'Code Generation', 'Feature-Sliced Design'],
    featured: false,
    date: '2025-03-20',
    links: [
      { title: 'GitHub', link: 'https://github.com/ArthurNyan/FSDGen' },
    ],
    locales: {
      ru: {
        name: 'FSDGen CLI',
        about:
          'CLI-инструмент для генерации компонентов и slice-структур по методологии Feature-Sliced Design.\n\nПроект полезен не как очередной шаблон, а как небольшой productivity-tool: он автоматизирует создание файловой структуры и ускоряет старт новых UI-компонентов, features, entities и pages.',
      },
      en: {
        name: 'FSDGen CLI',
        about:
          'A CLI tool for generating components and slice structures according to the Feature-Sliced Design methodology.\n\nIts value comes from productivity rather than presentation: it automates file scaffolding and speeds up creation of new UI components, features, entities, and pages.',
      },
    },
  },
  {
    sourceKey: 'github-org:herzen-health-passport',
    slug: 'herzen-health-passport',
    githubUrl: 'https://github.com/herzen-health-passport',
    link: 'https://github.com/herzen-health-passport',
    techStack: [],
    featured: false,
    date: '2024-03-07',
    links: [
      { title: 'GitHub organization', link: 'https://github.com/herzen-health-passport' },
    ],
    locales: {
      ru: {
        name: 'Herzen Health Passport',
        about:
          'Цифровая программа «Физическая культура и здоровье», разработанная для улучшения качества образовательной деятельности в РГПУ им. А. И. Герцена.\n\nДобавлена в портфолио как отдельный private-case: по приложенному благодарственному письму проект был внедрён в 2024 году, а публичный GitHub-репозиторий у команды сейчас отсутствует. Поэтому карточка сознательно описывает продуктовый контекст и подтверждённый результат без неподтверждённых технических деталей.',
      },
      en: {
        name: 'Herzen Health Passport',
        about:
          'A digital “Physical Culture and Health” program created to improve the quality of educational activities at Herzen University.\n\nIt is included in the portfolio as a private case: the attached certificate confirms the project was delivered in 2024, while the team currently has no public GitHub repository. For that reason, the card focuses on the verified product context and outcome without inventing unsupported technical details.',
      },
    },
  },
];
