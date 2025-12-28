/**
 * article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    let entity;

    // Проверяем, является ли id числом (обычный поиск по ID)
    if (!isNaN(Number(id))) {
      entity = await strapi.entityService.findOne('api::article.article', Number(id), {
        ...query,
      });
    } else {
      // Если id не число, ищем по slug
      const entities = await strapi.entityService.findMany('api::article.article', {
        filters: { slug: id },
        ...query,
      });

      if (!entities || entities.length === 0) {
        return ctx.notFound('Article not found');
      }

      entity = entities[0];
    }

    if (!entity) {
      return ctx.notFound('Article not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },
}));
