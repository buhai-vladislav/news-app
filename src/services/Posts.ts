import { removeUndefined } from './../shared/utils/utils';
import { ResponseWrapper } from '../shared/utils/response';
import { PrismaService } from './Prisma';
import { HttpStatus, Injectable, Res } from '@nestjs/common';
import {
  CreatePostDto,
  PostBlockActionType,
  UpdatePostBlockDto,
  UpdatePostDto,
} from '../dtos';
import { Response } from 'express';
import {
  AffectedResult,
  CustomRequest,
  IBufferedFile,
  ItemsPaginated,
  PaginationMeta,
  Post,
  PostSearch,
  PostsFindOptions,
  ResponseBody,
} from '../shared/types';
import { FilesService } from './Files';
import { PostStatus, Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  private readonly responseWrapper: ResponseWrapper;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FilesService,
  ) {
    this.responseWrapper = new ResponseWrapper(PostsService.name);
  }

  /**
   * Create a new post.
   *
   * @param {CreatePostDto} createPostDto - The data to create the post
   * @param {Response} response - The HTTP response object
   * @param {CustomRequest} request - The custom request object
   * @param {IBufferedFile[]} [files] - Optional array of buffered files
   * @return {Promise<Response<ResponseBody<Post>>} The response containing the created post
   */
  public async createPost(
    createPostDto: CreatePostDto,
    response: Response,
    request: CustomRequest,
    files?: IBufferedFile[],
  ): Promise<Response<ResponseBody<Post>>> {
    try {
      const { title, shortDescription, status, tags, postBlocks, mediaName } =
        createPostDto;
      const { id } = request.user;

      let post = await this.prismaService.posts.create({
        data: {
          title,
          shortDescription,
          creator: { connect: { id } },
          status,
          tags: {
            create: tags.map((tagId) => ({ tag: { connect: { id: tagId } } })),
          },
        },
        include: { tags: true, postBlocks: true },
      });

      const data = {
        postBlocks: {
          createMany: {
            data: postBlocks,
          },
        },
      };

      if (files) {
        const uploadedFiles = await this.fileService.uploadMany(files);

        data.postBlocks.createMany.data = postBlocks.map((block) => ({
          ...block,
          media: {
            connect: {
              id: uploadedFiles.find((file) => file.name === block?.fileName)
                .id,
            },
          },
          post: { connect: { id: post.id } },
        }));

        if (mediaName) {
          data['media'] = {
            connect: {
              id: uploadedFiles.find((file) => file.name === mediaName).id,
            },
          };
        }
      }

      post = await this.prismaService.posts.update({
        where: { id: post.id },
        data,
        include: { tags: true, postBlocks: true },
      });

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.CREATED,
        'Post created',
        post,
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * Update a post with the given postId and updatePostDto, and return the updated post.
   *
   * @param {string} postId - The ID of the post to be updated
   * @param {UpdatePostDto} updatePostDto - The data to update the post with
   * @param {Response} response - The HTTP response object
   * @param {IBufferedFile[]} [files] - Optional array of files to be updated
   * @return {Promise<Response<ResponseBody<Post>>} The updated post response
   */
  public async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
    response: Response,
    files?: IBufferedFile[],
  ): Promise<Response<ResponseBody<Post>>> {
    try {
      const { title, shortDescription, status, tags, postBlocks } =
        updatePostDto;

      let post = await this.prismaService.posts.update({
        where: { id: postId },
        data: {
          title,
          shortDescription,
          status,
          tags: {
            deleteMany: {},
            create: tags.map((tagId) => ({ tag: { connect: { id: tagId } } })),
          },
        },
        include: { tags: true, postBlocks: { include: { media: true } } },
      });

      if (!post) {
        return this.responseWrapper.sendError(
          response,
          HttpStatus.NOT_FOUND,
          'Post not found',
        );
      }

      if (postBlocks) {
        await Promise.all(
          postBlocks.map(async (block) => {
            if (block.actionType === PostBlockActionType.CREATE) {
              await this.createPostBlock(block, postId, files);
            }
            if (block.actionType === PostBlockActionType.UPDATE) {
              const data = removeUndefined({
                order: block?.order,
                type: block?.type,
                content: block?.content,
              }) as Prisma.PostsBlocksUpdateInput;

              await this.prismaService.postsBlocks.update({
                where: {
                  id: block.postBlockId,
                },
                data,
              });
            }
            if (block.actionType === PostBlockActionType.DELETE) {
              await this.prismaService.postsBlocks.delete({
                where: {
                  id: block.postBlockId,
                },
              });
            }
          }),
        );
      }

      post = await this.prismaService.posts.findUnique({
        where: { id: postId },
        include: { tags: true, postBlocks: { include: { media: true } } },
      });

      if (post.postBlocks.some((block) => block?.media)) {
        post.postBlocks = await Promise.all(
          post.postBlocks.map(async (block) =>
            block?.media
              ? {
                  ...block,
                  media: {
                    ...block.media,
                    fileSrc: await this.fileService.getObjectUrl(
                      block.media.fileSrc,
                    ),
                  },
                }
              : block,
          ),
        );
      }

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Post updated',
        post,
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * A function to change the media of a post.
   *
   * @param {string} postId - The ID of the post
   * @param {IBufferedFile | null} file - The new media file to be uploaded, or null if the media is to be disconnected
   * @param {Response} response - The HTTP response object
   * @return {Promise<Response<ResponseBody<AffectedResult>>>} A promise that resolves to the updated HTTP response with affected result
   */
  public async changePostMedia(
    postId: string,
    file: IBufferedFile | null,
    response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    try {
      const post = await this.prismaService.posts.findUnique({
        where: { id: postId },
        include: { media: true },
      });

      if (!post) {
        return this.responseWrapper.sendError(
          response,
          HttpStatus.NOT_FOUND,
          'Post not found',
        );
      }

      if (file === null) {
        await Promise.all([
          this.prismaService.posts.update({
            where: { id: postId },
            data: {
              media: {
                disconnect: true,
              },
            },
          }),
          this.fileService.deleteSingle(post.media.fileSrc),
        ]);
      } else {
        const uploadedFile = await this.fileService.uploadSingle(file);

        await this.prismaService.posts.update({
          where: { id: postId },
          data: {
            media: {
              connect: {
                id: uploadedFile.id,
              },
            },
          },
        });
      }

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Post media updated',
        { isAffected: true },
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * A description of the entire function.
   *
   * @param {UpdatePostBlockDto} block - description of parameter
   * @param {string} postId - description of parameter
   * @param {IBufferedFile[]} [files] - description of parameter
   * @return {Promise<void>} description of return value
   */
  private async createPostBlock(
    block: UpdatePostBlockDto,
    postId: string,
    files?: IBufferedFile[],
  ): Promise<void> {
    const postBlocks = {
      create: {
        order: block.order,
        type: block.type,
        content: block.content,
      },
    };

    if (block?.fileName) {
      const file = files.find((file) => file.originalname === block.fileName);

      if (file) {
        const uploadedFile = await this.fileService.uploadSingle(file);

        postBlocks.create['media'] = {
          connect: {
            id: uploadedFile.id,
          },
        };
      }
    }

    await this.prismaService.posts.update({
      where: { id: postId },
      data: {
        postBlocks,
      },
    });
  }

  /**
   * Delete a post and its associated media files from the database.
   *
   * @param {string} postId - The ID of the post to be deleted
   * @param {Response} response - The HTTP response object
   * @return {Promise<Response<ResponseBody<AffectedResult>>>} The response indicating the success or failure of the post deletion
   */
  public async deletePost(
    postId: string,
    response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    try {
      const post = await this.prismaService.posts.delete({
        where: { id: postId },
        include: { postBlocks: { include: { media: true } } },
      });

      if (!post) {
        return this.responseWrapper.sendError(
          response,
          HttpStatus.NOT_FOUND,
          'Post not found',
        );
      }

      post.postBlocks.map(async (block) => {
        if (block.media) {
          await this.fileService.deleteSingle(block.media.fileSrc);
        }
      });

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Post deleted',
        { isAffected: !!post },
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * Retrieves a post by its ID and sends the corresponding response.
   *
   * @param {string} postId - The ID of the post to retrieve
   * @param {Response} response - The response object to send the result to
   * @return {Promise<Response<ResponseBody<Post>>>} Promise that resolves when the operation is complete
   */
  public async getPostById(
    postId: string,
    response: Response,
  ): Promise<Response<ResponseBody<Post>>> {
    try {
      const post = await this.prismaService.posts.findUnique({
        where: { id: postId },
        include: { tags: true, postBlocks: { include: { media: true } } },
      });

      if (!post) {
        return this.responseWrapper.sendError(
          response,
          HttpStatus.NOT_FOUND,
          'Post not found',
        );
      }

      if (post.postBlocks.some((block) => block?.media)) {
        post.postBlocks = await Promise.all(
          post.postBlocks.map(async (block) =>
            block?.media
              ? {
                  ...block,
                  media: {
                    ...block.media,
                    fileSrc: await this.fileService.getObjectUrl(
                      block.media.fileSrc,
                    ),
                  },
                }
              : block,
          ),
        );
      }

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Post retrieved',
        post,
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * Search posts based on the provided query.
   *
   * @param {string} query - the search query
   * @param {Response} response - the HTTP response object
   * @return {Promise<Response<ResponseBody<Array<PostSearch>>>>} a promise that resolves when the function completes
   */
  public async searchPosts(
    query: string,
    response: Response,
  ): Promise<Response<ResponseBody<Array<PostSearch>>>> {
    try {
      const posts = await this.prismaService.posts.findMany({
        where: {
          OR: [{ title: { contains: query } }],
          AND: [{ status: { equals: PostStatus.PUBLISHED } }],
        },
        select: {
          id: true,
          title: true,
        },
      });

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Posts retrieved',
        posts,
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * Retrieves posts based on the provided options and sends a success or error response.
   *
   * @param {PostsFindOptions} options - options for finding posts
   * @param {Response} response - the HTTP response object
   * @return {Promise<Response<ResponseBody<ItemsPaginated<Post>>>>} a Promise that resolves to a success or error response
   */
  public async getPosts(
    options: PostsFindOptions,
    response: Response,
  ): Promise<Response<ResponseBody<ItemsPaginated<Post>>>> {
    try {
      const { limit, page, sortBy, sortOrder } = options;
      const skip = (page - 1) * limit;
      const where: Prisma.PostsWhereInput =
        this.createGetPostsWhereOptions(options);

      const [posts, count] = await Promise.all([
        this.prismaService.posts.findMany({
          skip,
          take: limit,
          where,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            tags: true,
            creator: true,
            media: true,
            postBlocks: false,
          },
        }),
        this.prismaService.posts.count({ where }),
      ]);

      const totalPages = Math.ceil(count / limit);
      const pagination: PaginationMeta = {
        count,
        limit,
        page,
        totalPages,
      };

      const postsWithMedia = await Promise.all(
        posts.map(async (post) =>
          post?.media
            ? {
                ...post,
                media: {
                  ...post?.media,
                  fileSrc: await this.fileService.getObjectUrl(
                    post.media.fileSrc,
                  ),
                },
              }
            : post,
        ),
      );

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Posts retrieved',
        { items: postsWithMedia, pagination },
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * Create options for filtering posts.
   *
   * @param {PostsFindOptions} options - the options for finding posts
   * @return {Prisma.PostsWhereInput} the options for filtering posts
   */
  private createGetPostsWhereOptions(
    options: PostsFindOptions,
  ): Prisma.PostsWhereInput {
    const where: Prisma.PostsWhereInput = {};

    if (options.creatorId) {
      where.creatorId = { equals: options.creatorId };
    }

    if (options.tags) {
      where.tags = { some: { tagId: { in: options.tags } } };
    }

    if (options.status) {
      where.status = { equals: options.status };
    }

    if (options.search) {
      where.OR = [{ title: { contains: options.search } }];
    }

    return where;
  }
}
