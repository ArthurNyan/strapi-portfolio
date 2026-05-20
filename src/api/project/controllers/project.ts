/**
 * project controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::project.project', ({ strapi }) => ({
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
        filters: { slug: id },
        locale,
        status: 'published',
        populate: query.populate ?? '*',
      });
    }

    if (!entity) {
      return ctx.notFound('Project not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },
}));
