import type { Schema, Struct } from '@strapi/strapi';

export interface SharedEducation extends Struct.ComponentSchema {
  collectionName: 'components_shared_educations';
  info: {
    displayName: 'Education';
    icon: 'briefcase';
  };
  attributes: {
    about: Schema.Attribute.Blocks & Schema.Attribute.Required;
    endDate: Schema.Attribute.Date;
    link: Schema.Attribute.String;
    name: Schema.Attribute.String;
    startDate: Schema.Attribute.Date;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.education': SharedEducation;
    }
  }
}
