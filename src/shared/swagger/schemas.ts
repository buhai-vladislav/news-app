import {
  FieldType,
  MixinConcatType,
  MixinStatus,
  MixinType,
  PostStatus,
  UserRole,
} from '@prisma/client';

export const CreateUserFormSchema = {
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
      fullname: {
        type: 'string',
        example: 'John Doe',
      },
      email: {
        type: 'string',
        example: 'X5qFP@example.com',
      },
      password: {
        type: 'string',
        example: 'password123',
      },
      role: {
        type: 'string',
        example: 'admin',
        enum: Object.values(UserRole),
      },
    },
  },
};

export const UpdateUserFormSchema = {
  schema: {
    type: 'object',
    properties: {
      file: {
        require: false,
        type: 'string',
        format: 'binary',
      },
      fullname: {
        require: false,
        type: 'string',
        example: 'John Doe',
      },
      email: {
        require: false,
        type: 'string',
        example: 'X5qFP@example.com',
      },
      password: {
        require: false,
        type: 'string',
        example: 'password123',
      },
      role: {
        require: false,
        type: 'string',
        example: 'admin',
        enum: Object.values(UserRole),
      },
    },
  },
};

export const CreatePostSchema = {
  schema: {
    type: 'object',
    required: ['title', 'shortDescription', 'status', 'tags', 'postBlocks'],
    properties: {
      files: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
      title: {
        type: 'string',
        example: 'My post title',
      },
      shortDescription: {
        type: 'string',
        example: 'My post content',
      },
      status: {
        type: 'string',
        example: 'DRAFT',
        enum: Object.values(PostStatus),
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      postBlocks: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              example: 'TEXT',
              enum: Object.values(FieldType),
            },
            content: {
              type: 'string',
              example: 'My post content',
            },
            order: {
              type: 'number',
              example: 1,
            },
            postId: {
              type: 'string',
              example: 'My post content',
            },
            fileName: {
              type: 'string',
              example: 'My post content',
            },
          },
        },
      },
    },
  },
};

export const UpdatePostSchema = {
  schema: {
    type: 'object',
    properties: {
      files: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
      title: {
        type: 'string',
        example: 'My post title',
      },
      shortDescription: {
        type: 'string',
        example: 'My post content',
      },
      status: {
        type: 'string',
        example: 'DRAFT',
        enum: Object.values(PostStatus),
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      postBlocks: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              example: 'TEXT',
              enum: Object.values(FieldType),
            },
            content: {
              type: 'string',
              example: 'My post content',
            },
            order: {
              type: 'number',
              example: 1,
            },
            postId: {
              type: 'string',
              example: 'My post content',
            },
            fileName: {
              type: 'string',
              example: 'My post content',
            },
          },
        },
      },
    },
  },
};

export const UpdatePostMediaSchema = {
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

export const CreateMixinSchema = {
  schema: {
    type: 'object',
    required: ['concatTypes', 'status', 'orderPercentage', 'type'],
    properties: {
      concatTypes: {
        type: 'array',
        items: {
          type: 'string',
          enum: Object.values(MixinConcatType),
          example: MixinConcatType.PAGINATION,
        },
      },
      status: {
        type: 'string',
        enum: Object.values(MixinStatus),
        example: MixinStatus.HIDDEN,
      },
      orderPercentage: {
        type: 'number',
        example: 100,
      },
      type: {
        type: 'string',
        enum: Object.values(MixinType),
        example: MixinType.TEXT,
      },
      text: {
        type: 'string',
        example: 'My post content',
      },
      linkUrl: {
        type: 'string',
        example: 'https://example.com',
      },
      linkText: {
        type: 'string',
        example: 'Read more',
      },
      postId: {
        type: 'string',
        example: '12e1234124erd1234r124e',
      },
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

export const UpdateMixinSchema = {
  schema: {
    type: 'object',
    properties: {
      concatTypes: {
        type: 'array',
        items: {
          type: 'string',
          enum: Object.values(MixinConcatType),
          example: MixinConcatType.PAGINATION,
        },
      },
      status: {
        type: 'string',
        enum: Object.values(MixinStatus),
        example: MixinStatus.HIDDEN,
      },
      orderPercentage: {
        type: 'number',
        example: 100,
      },
      type: {
        type: 'string',
        enum: Object.values(MixinType),
        example: MixinType.TEXT,
      },
      text: {
        type: 'string',
        example: 'My post content',
      },
      linkUrl: {
        type: 'string',
        example: 'https://example.com',
      },
      linkText: {
        type: 'string',
        example: 'Read more',
      },
      postId: {
        type: 'string',
        example: '12e1234124erd1234r124e',
      },
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};
