/* eslint-disable no-console */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const { compileStrapi, createStrapi } = require('@strapi/strapi');
const curatedProjects = require('./portfolio-projects');

const LEGACY_API_BASE_URL =
  process.env.LEGACY_API_BASE_URL || 'https://3a403fd26ce35e0b.mokky.dev';
const LEGACY_CACHE_DIR = path.join(process.cwd(), '.tmp', 'legacy-cache');

const DEFAULT_LOCALE = 'ru';
const FALLBACK_LOCALE = 'en';

const MONTHS = {
  'январь': 1,
  'января': 1,
  'февраль': 2,
  'февраля': 2,
  'март': 3,
  'марта': 3,
  'апрель': 4,
  'апреля': 4,
  'май': 5,
  'мая': 5,
  'июнь': 6,
  'июня': 6,
  'июль': 7,
  'июля': 7,
  'август': 8,
  'августа': 8,
  'сентябрь': 9,
  'сентября': 9,
  'октябрь': 10,
  'октября': 10,
  'ноябрь': 11,
  'ноября': 11,
  'декабрь': 12,
  'декабря': 12,
};

const TRANSLITERATION_MAP = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

const decodeEntities = (value = '') =>
  value
    .replaceAll('&gt;', '>')
    .replaceAll('&lt;', '<')
    .replaceAll('&amp;', '&')
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"');

const normalizeUrl = (value) => {
  if (!value) {
    return undefined;
  }

  if (value.startsWith('mailto:') || value.startsWith('tel:')) {
    return value;
  }

  if (value.includes('@') && !value.startsWith('http')) {
    return `mailto:${value}`;
  }

  if (value.startsWith('+')) {
    return `tel:${value.replaceAll(' ', '')}`;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://${value}`;
};

const createParagraph = (text) => ({
  type: 'paragraph',
  children: [{ type: 'text', text }],
});

const createHeading = (level, text) => ({
  type: 'heading',
  level,
  children: [{ type: 'text', text }],
});

const createList = (items) => ({
  type: 'list',
  format: 'unordered',
  children: items
    .filter(Boolean)
    .map((item) => ({
      type: 'list-item',
      children: [{ type: 'text', text: item }],
    })),
});

const createBlocksFromText = (text) => {
  const normalized = decodeEntities((text || '').trim());

  if (!normalized) {
    return [createParagraph('')];
  }

  return normalized
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => createParagraph(chunk.replaceAll('\n', ' ')));
};

const createExperienceBlocks = (duties) => {
  const lines = (duties || []).map((item) => item.trim()).filter(Boolean);

  if (lines.length === 0) {
    return [createParagraph('')];
  }

  return [createList(lines)];
};

const slugify = (value) => {
  const transliterated = value
    .trim()
    .toLowerCase()
    .split('')
    .map((char) => TRANSLITERATION_MAP[char] ?? char)
    .join('');

  return transliterated
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
};

const toIsoDate = (year, month = 1, day = 1) =>
  new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10);

const normalizeDate = (value) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
};

const parseYearRange = (value) => {
  const years = value.match(/\d{4}/g);

  if (!years || years.length === 0) {
    return {};
  }

  return {
    startDate: toIsoDate(Number(years[0])),
    endDate: years[1] ? toIsoDate(Number(years[1]), 12, 31) : undefined,
  };
};

const parseLegacyExperienceDate = (value) => {
  if (!value) {
    return {};
  }

  const normalized = value.toLowerCase().replace(/\s+/g, ' ').trim();
  const parts = normalized.split(/\s*-\s*/);

  if (parts.length !== 2) {
    return {};
  }

  const [startPart, endPart] = parts;
  const endIsOpen = endPart.includes('to date');
  const startTokens = startPart.split(' ');
  const endTokens = endPart.split(' ');

  const startMonth = MONTHS[startTokens[0]];
  const endMonth = endIsOpen ? undefined : MONTHS[endTokens[0]];
  const startYearExplicit = Number(startTokens[1]);
  const endYear = endIsOpen ? undefined : Number(endTokens[endTokens.length - 1]);

  let startYear = Number.isFinite(startYearExplicit) ? startYearExplicit : endYear;

  if (!Number.isFinite(startYear) && Number.isFinite(endYear)) {
    startYear = endYear;
  }

  if (
    !Number.isFinite(startYearExplicit) &&
    Number.isFinite(endYear) &&
    startMonth &&
    endMonth &&
    startMonth > endMonth
  ) {
    startYear = endYear - 1;
  }

  return {
    startDate: startMonth && Number.isFinite(startYear) ? toIsoDate(startYear, startMonth) : undefined,
    endDate:
      endIsOpen || !endMonth || !Number.isFinite(endYear)
        ? undefined
        : toIsoDate(endYear, endMonth, 1),
  };
};

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const requestJsonWithCurl = (url) => {
  const output = execFileSync('curl', ['-ksS', '--http1.1', url], {
    encoding: 'utf8',
  });

  return JSON.parse(output);
};

const requestBufferWithCurl = (url) =>
  execFileSync('curl', ['-ksS', '--http1.1', url], {
    encoding: 'buffer',
    maxBuffer: 1024 * 1024 * 50,
  });

const fetchJson = async (resource) => {
  const url = `${LEGACY_API_BASE_URL.replace(/\/$/, '')}/${resource.replace(/^\//, '')}`;
  const cacheFilePath = path.join(
    LEGACY_CACHE_DIR,
    `${resource.replace(/[^a-z0-9-]/gi, '_').toLowerCase()}.json`
  );

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      await fs.promises.mkdir(LEGACY_CACHE_DIR, { recursive: true });
      await fs.promises.writeFile(cacheFilePath, JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      if (attempt === 3) {
        try {
          const data = requestJsonWithCurl(url);
          await fs.promises.mkdir(LEGACY_CACHE_DIR, { recursive: true });
          await fs.promises.writeFile(cacheFilePath, JSON.stringify(data, null, 2));
          return data;
        } catch (curlError) {
          if (fs.existsSync(cacheFilePath)) {
            const cached = await fs.promises.readFile(cacheFilePath, 'utf8');
            return JSON.parse(cached);
          }

          throw curlError;
        }
      }

      await sleep(500 * attempt);
    }
  }
};

const bootstrapStrapi = async () => {
  const dirs = await compileStrapi({ appDir: process.cwd() });
  const strapi = createStrapi(dirs);
  await strapi.load();
  return strapi;
};

const publishDocument = async (strapi, uid, documentId, locale) => {
  await strapi.documents(uid).publish({ documentId, locale });
};

const upsertLocalizedDocument = async (strapi, uid, { documentId, locale, data }) => {
  const service = strapi.documents(uid);
  const result = documentId
    ? await service.update({ documentId, locale, data })
    : await service.create({ locale, data });

  await publishDocument(strapi, uid, result.documentId, locale);

  return result;
};

const findDocumentByField = async (strapi, uid, field, value) => {
  if (!value) {
    return null;
  }

  return strapi.db.query(uid).findOne({
    where: {
      [field]: value,
    },
  });
};

const getLocalizedDocument = async (strapi, uid, locale, filters = {}, populate = '*') =>
  strapi.documents(uid).findFirst({
    locale,
    status: 'draft',
    filters,
    populate,
  });

const getUploadFileByName = async (strapi, name) =>
  strapi.db.query('plugin::upload.file').findOne({
    where: { name },
  });

const uploadRemoteFile = async (strapi, url, sourceKey) => {
  if (!url) {
    return null;
  }

  const normalizedUrl = normalizeUrl(url);
  const parsedUrl = new URL(normalizedUrl);
  const rawName = path.basename(parsedUrl.pathname) || 'file';
  const safeName = `${sourceKey}-${rawName}`.replace(/[^a-zA-Z0-9._-]/g, '-');

  const existing = await getUploadFileByName(strapi, safeName);

  if (existing) {
    return existing;
  }

  let response;
  let buffer;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(normalizedUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch media ${normalizedUrl}: ${response.status}`);
      }

      buffer = Buffer.from(await response.arrayBuffer());
      break;
    } catch (error) {
      if (attempt === 3) {
        buffer = Buffer.from(requestBufferWithCurl(normalizedUrl));
        break;
      }

      await sleep(500 * attempt);
    }
  }

  const tmpPath = path.join(os.tmpdir(), `${Date.now()}-${safeName}`);

  await fs.promises.writeFile(tmpPath, buffer);

  try {
    const [uploadedFile] = await strapi.plugin('upload').service('upload').upload({
      data: {
        fileInfo: {
          name: safeName,
          alternativeText: sourceKey,
          caption: sourceKey,
        },
      },
      files: {
        filepath: tmpPath,
        originalFilename: safeName,
        mimetype: response?.headers.get('content-type') || 'application/octet-stream',
        size: buffer.length,
      },
    });

    return uploadedFile;
  } finally {
    await fs.promises.rm(tmpPath, { force: true });
  }
};

const syncProject = async (strapi, project) => {
  const uid = 'api::project.project';
  const legacyId = String(project.id);
  const slug = slugify(project.name);
  const banner = await uploadRemoteFile(strapi, project.image, `project-${legacyId}`);
  const ruData = {
    legacyId,
    name: project.name,
    slug,
    about: createBlocksFromText(project.description),
    date: normalizeDate(project.date),
    link: normalizeUrl(project.link),
    links: (project.links || []).map((item) => ({
      title: item.title,
      link: normalizeUrl(item.link),
    })),
    banner: banner ? banner.id : null,
  };

  const matchedDocument =
    (await findDocumentByField(strapi, uid, 'legacyId', legacyId)) ||
    (await findDocumentByField(strapi, uid, 'slug', slug));
  const matchedEn = matchedDocument
    ? await getLocalizedDocument(strapi, uid, FALLBACK_LOCALE, { legacyId })
    : await getLocalizedDocument(strapi, uid, FALLBACK_LOCALE, { slug });

  if (matchedEn) {
    await upsertLocalizedDocument(strapi, uid, {
      documentId: matchedEn.documentId,
      locale: FALLBACK_LOCALE,
      data: { legacyId },
    });

    return upsertLocalizedDocument(strapi, uid, {
      documentId: matchedEn.documentId,
      locale: DEFAULT_LOCALE,
      data: ruData,
    });
  }

  const ruDocument = await upsertLocalizedDocument(strapi, uid, {
    documentId: matchedDocument?.documentId,
    locale: DEFAULT_LOCALE,
    data: ruData,
  });

  await upsertLocalizedDocument(strapi, uid, {
    documentId: ruDocument.documentId,
    locale: FALLBACK_LOCALE,
    data: {
      ...ruData,
      legacyId,
    },
  });

  return ruDocument;
};

const buildCuratedProjectData = (project, locale, bannerId) => {
  const localized = project.locales?.[locale];

  if (!localized) {
    return null;
  }

  const data = {
    name: localized.name,
    slug: project.slug || slugify(localized.name),
    about: createBlocksFromText(localized.about),
    date: normalizeDate(project.date),
    link: normalizeUrl(project.link || project.demoUrl || project.githubUrl),
    links: (project.links || []).map((item) => ({
      title: item.title,
      link: normalizeUrl(item.link),
    })),
    featured: Boolean(project.featured),
    techStack: project.techStack || [],
    sourceKey: project.sourceKey,
    githubUrl: normalizeUrl(project.githubUrl),
    demoUrl: normalizeUrl(project.demoUrl),
  };

  if (project.legacyId) {
    data.legacyId = String(project.legacyId);
  }

  if (bannerId) {
    data.banner = bannerId;
  }

  return data;
};

const syncCuratedProject = async (strapi, project) => {
  const uid = 'api::project.project';
  const legacyId = project.legacyId ? String(project.legacyId) : undefined;
  const banner = await uploadRemoteFile(strapi, project.bannerUrl, project.sourceKey);
  const bannerId = banner?.id;
  const matchers = [
    project.sourceKey ? ['sourceKey', project.sourceKey] : null,
    legacyId ? ['legacyId', legacyId] : null,
    project.slug ? ['slug', project.slug] : null,
  ].filter(Boolean);

  let matchedDocument = null;

  for (const [field, value] of matchers) {
    matchedDocument = await findDocumentByField(strapi, uid, field, value);

    if (matchedDocument) {
      break;
    }
  }

  const ruData = buildCuratedProjectData(project, DEFAULT_LOCALE, bannerId);
  const enData = buildCuratedProjectData(project, FALLBACK_LOCALE, bannerId);

  if (!ruData || !enData) {
    throw new Error(`Curated project ${project.sourceKey} is missing ru/en locale data`);
  }

  const ruDocument = await upsertLocalizedDocument(strapi, uid, {
    documentId: matchedDocument?.documentId,
    locale: DEFAULT_LOCALE,
    data: ruData,
  });

  await upsertLocalizedDocument(strapi, uid, {
    documentId: ruDocument.documentId,
    locale: FALLBACK_LOCALE,
    data: enData,
  });

  return ruDocument;
};

const syncArticleFallbacks = async (strapi) => {
  const uid = 'api::article.article';
  const enArticles = await strapi.documents(uid).findMany({
    locale: FALLBACK_LOCALE,
    status: 'draft',
  });

  for (const article of enArticles) {
    await upsertLocalizedDocument(strapi, uid, {
      documentId: article.documentId,
      locale: FALLBACK_LOCALE,
      data: {
        legacyId: article.legacyId || article.slug,
      },
    });

    await upsertLocalizedDocument(strapi, uid, {
      documentId: article.documentId,
      locale: DEFAULT_LOCALE,
      data: {
        legacyId: article.legacyId || article.slug,
        title: article.title,
        slug: article.slug,
        article: article.article,
        date: article.date,
      },
    });
  }
};

const syncSocialLink = async (strapi, item) => {
  const uid = 'api::social-link.social-link';
  const legacyId = String(item.id);
  const matchedDocument = await findDocumentByField(strapi, uid, 'legacyId', legacyId);

  const ruDocument = await upsertLocalizedDocument(strapi, uid, {
    documentId: matchedDocument?.documentId,
    locale: DEFAULT_LOCALE,
    data: {
      legacyId,
      label: item.nameRu,
      url: normalizeUrl(item.link),
      type: item.type,
    },
  });

  await upsertLocalizedDocument(strapi, uid, {
    documentId: ruDocument.documentId,
    locale: FALLBACK_LOCALE,
    data: {
      legacyId,
      label: item.nameEn || item.nameRu,
      url: normalizeUrl(item.link),
      type: item.type,
    },
  });
};

const syncExperience = async (strapi, item) => {
  const uid = 'api::experience.experience';
  const legacyId = String(item.id);
  const matchedDocument = await findDocumentByField(strapi, uid, 'legacyId', legacyId);
  const { startDate, endDate } = parseLegacyExperienceDate(item.date);
  const payload = {
    legacyId,
    name: item.title,
    about: createExperienceBlocks(item.duties),
    link: normalizeUrl(item.link),
    startDate,
    endDate,
  };

  const ruDocument = await upsertLocalizedDocument(strapi, uid, {
    documentId: matchedDocument?.documentId,
    locale: DEFAULT_LOCALE,
    data: payload,
  });

  await upsertLocalizedDocument(strapi, uid, {
    documentId: ruDocument.documentId,
    locale: FALLBACK_LOCALE,
    data: payload,
  });

  return ruDocument;
};

const syncEducation = async (strapi, legacyCv, existingEducation) => {
  const uid = 'api::education.education';
  const educationSource = legacyCv.find((item) => item.university);
  const legacyId = 'legacy-herzen-university';
  const matchedDocument =
    (await findDocumentByField(strapi, uid, 'legacyId', legacyId)) ||
    (existingEducation ? { documentId: existingEducation.documentId } : null);
  const logoId = existingEducation?.logo?.id ?? null;
  const { startDate, endDate } = parseYearRange(educationSource?.date || '');
  const payload = {
    legacyId,
    name: decodeEntities(educationSource?.university || existingEducation?.name || 'Herzen University'),
    type: existingEducation?.type || 'school',
    degree: decodeEntities(educationSource?.course || existingEducation?.degree || ''),
    about: createBlocksFromText(
      educationSource?.department || existingEducation?.about?.map((block) => block.children?.[0]?.text).join(' ')
    ),
    startDate,
    endDate,
    logo: logoId,
  };

  const ruDocument = await upsertLocalizedDocument(strapi, uid, {
    documentId: matchedDocument?.documentId,
    locale: DEFAULT_LOCALE,
    data: payload,
  });

  const enData = existingEducation
    ? {
        legacyId,
      }
    : payload;

  await upsertLocalizedDocument(strapi, uid, {
    documentId: ruDocument.documentId,
    locale: FALLBACK_LOCALE,
    data: enData,
  });

  const ruEducation = await getLocalizedDocument(strapi, uid, DEFAULT_LOCALE, { legacyId }, '*');
  const enEducation = await getLocalizedDocument(strapi, uid, FALLBACK_LOCALE, { legacyId }, '*');

  return { ruEducation, enEducation };
};

const syncAbout = async (strapi, imageUrls) => {
  const uid = 'api::about.about';
  const enAbout = await getLocalizedDocument(strapi, uid, FALLBACK_LOCALE, {}, '*');
  const mediaIds = [];

  for (const [index, image] of imageUrls.entries()) {
    const uploaded = await uploadRemoteFile(strapi, image.image, `about-gallery-${index + 1}`);

    if (uploaded) {
      mediaIds.push(uploaded.id);
    }
  }

  const fallbackDescription = enAbout?.description || [createParagraph('Arthur Nakhatakyan portfolio')];
  const fallbackTitle = enAbout?.title || 'Arthur portfolio';
  const documentId = enAbout?.documentId;

  if (documentId) {
    await upsertLocalizedDocument(strapi, uid, {
      documentId,
      locale: FALLBACK_LOCALE,
      data: {
        media: mediaIds,
      },
    });
  }

  const ruAbout = await upsertLocalizedDocument(strapi, uid, {
    documentId,
    locale: DEFAULT_LOCALE,
    data: {
      title: fallbackTitle,
      description: fallbackDescription,
      media: mediaIds,
    },
  });

  if (!documentId) {
    await upsertLocalizedDocument(strapi, uid, {
      documentId: ruAbout.documentId,
      locale: FALLBACK_LOCALE,
      data: {
        title: fallbackTitle,
        description: fallbackDescription,
        media: mediaIds,
      },
    });
  }

  return ruAbout;
};

const syncCv = async (strapi, legacyCv, ruExperiences, educationPair) => {
  const uid = 'api::cv.cv';
  const enCv = await getLocalizedDocument(strapi, uid, FALLBACK_LOCALE, {}, '*');
  const legacyAbout = legacyCv.find((item) => typeof item.about === 'string')?.about;
  const ruExperienceIds = ruExperiences.map((item) => item.id);
  const enExperienceIds =
    enCv?.experiences?.map((item) => item.id) ||
    (await strapi.documents('api::experience.experience').findMany({
      locale: FALLBACK_LOCALE,
      status: 'draft',
    })).map((item) => item.id);

  const ruEducationIds = educationPair.ruEducation ? [educationPair.ruEducation.id] : [];
  const enEducationIds =
    educationPair.enEducation?.id
      ? [educationPair.enEducation.id]
      : enCv?.educations?.map((item) => item.id) || [];
  const fallbackBaseInfo =
    enCv?.baseInfo ||
    [
      createHeading(1, 'frontend developer'),
      createHeading(2, 'Arthur Nakhatakyan — St. Petersburg, Russia'),
    ];
  const documentId = enCv?.documentId;

  if (documentId) {
    await upsertLocalizedDocument(strapi, uid, {
      documentId,
      locale: FALLBACK_LOCALE,
      data: {
        experiences: enExperienceIds,
        educations: enEducationIds,
      },
    });
  }

  const ruCv = await upsertLocalizedDocument(strapi, uid, {
    documentId,
    locale: DEFAULT_LOCALE,
    data: {
      baseInfo: fallbackBaseInfo,
      about: legacyAbout || enCv?.about || '',
      experiences: ruExperienceIds,
      educations: ruEducationIds,
    },
  });

  if (!documentId) {
    await upsertLocalizedDocument(strapi, uid, {
      documentId: ruCv.documentId,
      locale: FALLBACK_LOCALE,
      data: {
        baseInfo: fallbackBaseInfo,
        about: enCv?.about || legacyAbout || '',
        experiences: enExperienceIds,
        educations: enEducationIds,
      },
    });
  }
};

const main = async () => {
  console.log(`Using legacy API: ${LEGACY_API_BASE_URL}`);

  const [legacyProjects, legacyCv, legacyExperience, legacySocialLinks, legacyImages] =
    await Promise.all([
      fetchJson('projects'),
      fetchJson('cv'),
      fetchJson('experience'),
      fetchJson('social-links'),
      fetchJson('images'),
    ]);

  const strapi = await bootstrapStrapi();

  try {
    const existingEducation = await getLocalizedDocument(
      strapi,
      'api::education.education',
      FALLBACK_LOCALE,
      {},
      '*'
    );

    console.log(`Importing ${legacyProjects.length} projects`);
    for (const project of legacyProjects) {
      await syncProject(strapi, project);
    }

    console.log(`Syncing ${curatedProjects.length} curated portfolio projects`);
    for (const project of curatedProjects) {
      await syncCuratedProject(strapi, project);
    }

    console.log(`Importing ${legacySocialLinks.length} social links`);
    for (const socialLink of legacySocialLinks) {
      await syncSocialLink(strapi, socialLink);
    }

    console.log(`Importing ${legacyExperience.length} experiences`);
    const ruExperiences = [];

    for (const experience of legacyExperience) {
      const document = await syncExperience(strapi, experience);
      ruExperiences.push(document);
    }

    console.log('Syncing education, about and CV');
    const educationPair = await syncEducation(strapi, legacyCv, existingEducation);
    await syncAbout(strapi, legacyImages);
    await syncCv(strapi, legacyCv, ruExperiences, educationPair);
    await syncArticleFallbacks(strapi);

    console.log('Legacy import finished successfully');
  } finally {
    await strapi.destroy();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
