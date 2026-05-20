# Strapi Portfolio - Сводка проекта

## Общая информация

**Название:** strapi-portfolio  
**Версия:** 0.1.0  
**Тип:** Backend API для портфолио  
**Технологии:** Strapi 5.33.0, TypeScript, Better-SQLite3  

## Технический стек

- **Framework:** Strapi 5.33.0 (Headless CMS)
- **БД:** Better-SQLite3 12.4.1
- **Runtime:** Node.js >=20.0.0 <=24.x.x
- **Язык:** TypeScript 5
- **Плагины:**
  - @strapi/plugin-cloud
  - @strapi/plugin-users-permissions
  - i18n (интернационализация)

## Структура данных (Content Types)

### 1. About (Single Type)
**Тип:** Single Type (одна запись)  
**i18n:** Да  
**Публикация:** Draft & Publish

**Поля:**
- `title` - Text (обязательное, локализованное)
- `description` - Blocks (обязательное, локализованное)
- `media` - Media (множественное, images/videos, локализованное)

### 2. Article (Collection Type)
**Тип:** Collection Type (множественные записи)  
**i18n:** Да  
**Публикация:** Draft & Publish

**Поля:**
- `title` - Text (обязательное, локализованное)
- `slug` - UID (обязательное, локализованное, генерируется из title)
- `date` - Date (локализованное)
- `article` - RichText (обязательное, локализованное)

### 3. CV (Single Type)
**Тип:** Single Type (одна запись)  
**i18n:** Да  
**Публикация:** Draft & Publish

**Поля:**
- `baseInfo` - Blocks (обязательное, локализованное)
- `about` - Text (обязательное, локализованное)
- `experiences` - Relation (oneToMany → Experience)
- `educations` - Relation (oneToMany → Education)

### 4. Education (Collection Type)
**Тип:** Collection Type (множественные записи)  
**i18n:** Да  
**Публикация:** Draft & Publish

**Поля:**
- `name` - String (обязательное, локализованное)
- `type` - Enumeration ['school', 'curse'] (обязательное, по умолчанию 'school', локализованное)
- `degree` - String (локализованное)
- `about` - Blocks (обязательное, локализованное)
- `link` - String (локализованное)
- `startDate` - Date (локализованное)
- `endDate` - Date (локализованное)
- `logo` - Media (одиночное, images/videos, локализованное)

### 5. Experience (Collection Type)
**Тип:** Collection Type (множественные записи)  
**i18n:** Нет  
**Публикация:** Draft & Publish

**Поля:**
- `name` - String (обязательное)
- `about` - Blocks (обязательное)
- `link` - String
- `startDate` - Date
- `endDate` - Date

### 6. Project (Collection Type)
**Тип:** Collection Type (множественные записи)  
**i18n:** Да  
**Публикация:** Draft & Publish

**Поля:**
- `name` - String (обязательное, уникальное, локализованное)
- `banner` - Media (одиночное, images/videos, локализованное)
- `about` - Blocks (локализованное)
- `slug` - UID (обязательное, локализованное, генерируется из name)
- `date` - Date (локализованное)

## API Endpoints

Strapi автоматически генерирует следующие endpoints:

### Single Types:
- `GET /api/about` - Получить информацию About
- `PUT /api/about` - Обновить информацию About
- `GET /api/cv` - Получить CV
- `PUT /api/cv` - Обновить CV

### Collection Types:
- `GET /api/articles` - Список статей
- `GET /api/articles/:id` - Получить статью
- `POST /api/articles` - Создать статью
- `PUT /api/articles/:id` - Обновить статью
- `DELETE /api/articles/:id` - Удалить статью

- `GET /api/educations` - Список образований
- `GET /api/educations/:id` - Получить образование
- `POST /api/educations` - Создать образование
- `PUT /api/educations/:id` - Обновить образование
- `DELETE /api/educations/:id` - Удалить образование

- `GET /api/experiences` - Список опыта работы
- `GET /api/experiences/:id` - Получить опыт работы
- `POST /api/experiences` - Создать опыт работы
- `PUT /api/experiences/:id` - Обновить опыт работы
- `DELETE /api/experiences/:id` - Удалить опыт работы

- `GET /api/projects` - Список проектов
- `GET /api/projects/:id` - Получить проект
- `POST /api/projects` - Создать проект
- `PUT /api/projects/:id` - Обновить проект
- `DELETE /api/projects/:id` - Удалить проект

## Типы полей

### Blocks
Блочный редактор для создания форматированного контента (заголовки, параграфы, списки и т.д.)

### RichText
Текстовый редактор с HTML разметкой

### Text
Простое текстовое поле (многострочное)

### String
Простое текстовое поле (однострочное)

### Date
Поле для даты

### UID
Уникальный идентификатор (используется для URL slug)

### Media
Файлы (изображения/видео)

### Relation
Связь между content types

## Особенности

1. **Интернационализация (i18n):** Большинство контент-типов поддерживают локализацию
2. **Draft & Publish:** Все контент-типы имеют систему черновиков и публикаций
3. **Relations:** CV связан с Education и Experience через отношения oneToMany
4. **Media Library:** Поддержка загрузки изображений и видео
5. **TypeScript:** Полная типизация для всех контент-типов

## Структура проекта

```
strapi-portfolio/
├── config/              # Конфигурация Strapi
│   ├── admin.ts
│   ├── api.ts
│   ├── database.ts
│   ├── middlewares.ts
│   ├── plugins.ts
│   └── server.ts
├── src/
│   ├── api/            # API endpoints
│   │   ├── about/
│   │   ├── article/
│   │   ├── cv/
│   │   ├── education/
│   │   ├── experience/
│   │   └── project/
│   ├── components/     # Переиспользуемые компоненты
│   │   └── shared/
│   └── index.ts
├── types/              # TypeScript типы
│   └── generated/
├── public/             # Публичные файлы и загрузки
└── database/           # База данных SQLite
```

## Команды

- `npm run dev` / `npm run develop` - Запуск в режиме разработки
- `npm run start` - Запуск в продакшене
- `npm run build` - Сборка проекта
- `npm run strapi` - CLI Strapi

## Важные замечания

- Используется SQLite БД (better-sqlite3)
- Проект использует TypeScript
- Все API автоматически защищены системой прав доступа Strapi
- Загруженные файлы хранятся в `/public/uploads/`
- Автоматическая генерация типов в `/types/generated/`
