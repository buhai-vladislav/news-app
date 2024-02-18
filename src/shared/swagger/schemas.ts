import { UserRole } from '@prisma/client';

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
