/**
 * article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;
    const locale = typeof query.locale === 'string' ? query.locale : undefined;

    let entity;

    if (!isNaN(Number(id))) {
      entity = await strapi.entityService.findOne('api::article.article', Number(id), {
        ...query,
      });
    } else {
      entity = await strapi.documents('api::article.article').findFirst({
        filters: { slug: id },
        locale,
        status: 'published',
        populate: query.populate ?? '*',
      });
    }

    if (!entity) {
      return ctx.notFound('Article not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },
}));
