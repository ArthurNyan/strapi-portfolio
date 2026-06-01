/**
 * project controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::project.project', ({ strapi }) => ({
  async find(ctx) {
    const currentFilters =
      ctx.query && typeof ctx.query.filters === 'object' && !Array.isArray(ctx.query.filters)
        ? ctx.query.filters
        : {};

    ctx.query = {
      ...ctx.query,
      filters: {
        ...currentFilters,
        hidden: false,
      },
    };

    return await super.find(ctx);
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;
    const locale = typeof query.locale === 'string' ? query.locale : undefined;

    let entity;

    if (!isNaN(Number(id))) {
      entity = await strapi.entityService.findOne('api::project.project', Number(id), {
        ...query,
      });
    } else {
      entity = await strapi.documents('api::project.project').findFirst({
        filters: {
          slug: id,
          hidden: false,
        },
        locale,
        status: 'published',
        populate: query.populate ?? '*',
      });
    }

    if (!entity || entity.hidden) {
      return ctx.notFound('Project not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },
}));
