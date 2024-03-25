import { PostHeader } from './components/PostHeader';
import { usePostPage } from './hooks/usePostPage';
import { FieldType, PostBlockActionType } from '../../shared/types';
import { TextEditor } from '../../components/TextEditor';
import './PostPage.scss';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { PlusIcon, TrashIcon } from '../../assets/icons';
import { MediaBlock } from './components/MediaBlock';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDeletePost } from './hooks/useDeletePost';

export const PostPage = () => {
  const {
    post,
    tags,
    errors,
    postBlocks,
    isLoading,
    onAddBlock,
    onDeleteBlock,
    onPostChange,
    onDrop,
    clearMainMedia,
    onSelectChange,
    handleBlockMediaChange,
    onDragEnd,
    clearBlockMedia,
    onSubmitHandler,
    handleBlockContentChange,
  } = usePostPage();

  const {
    handleArchivePost,
    handleDeletePost,
    isLoading: isDeletePostLoading,
  } = useDeletePost(post);

  return (
    <div className="post__wrapper">
      <PostHeader
        post={post}
        errors={errors}
        onPostChange={onPostChange}
        onDrop={onDrop}
        media={typeof post.media === 'string' ? post.media : ''}
        clearMedia={clearMainMedia}
        onSelectChange={onSelectChange}
        tags={tags ?? []}
        isLoading={isLoading || isDeletePostLoading}
      />
      <div className="post__wrapper__toolbar drop-shadow-lg">
        <Dropdown isDisabled={isLoading || isDeletePostLoading}>
          <DropdownTrigger>
            <Button color="primary" endContent={<PlusIcon />}>
              Add Block
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              key="text"
              onPress={onAddBlock(FieldType.RICH_TEXT, postBlocks.length + 1)}
            >
              Text block
            </DropdownItem>
            <DropdownItem
              key="media"
              onPress={onAddBlock(FieldType.MEDIA, postBlocks.length + 1)}
            >
              Media block
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {post.type === 'created' && (
          <Dropdown isDisabled={isLoading || isDeletePostLoading}>
            <DropdownTrigger>
              <Button color="danger" endContent={<TrashIcon />}>
                Post
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="text"
                variant="shadow"
                onPress={handleArchivePost}
              >
                {post?.deletedAt === null ? 'Archive' : 'Unarchive'}
              </DropdownItem>
              <DropdownItem
                key="media"
                variant="shadow"
                onPress={handleDeletePost}
              >
                Delete permanently
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
        <Button
          onPress={onSubmitHandler}
          color="secondary"
          disabled={isLoading}
        >
          {post.type === 'new' ? 'Create' : 'Save'}
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="w-full blocks">
          <Droppable droppableId="dnd_items">
            {(dropable) => (
              <div
                {...dropable.droppableProps}
                ref={dropable.innerRef}
                className="dropable w-full dnd_items drop-shadow-lg"
              >
                {dropable.placeholder}
                {postBlocks
                  .filter(
                    ({ actionType }) =>
                      actionType !== PostBlockActionType.DELETE,
                  )
                  .map((block, index) =>
                    block.type === FieldType.RICH_TEXT ? (
                      <Draggable
                        draggableId={block.id}
                        index={index}
                        key={block.id}
                        isDragDisabled={isLoading}
                      >
                        {(provided) => (
                          <div
                            className="editror__wrapper"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TextEditor
                              key={block.id}
                              content={block.content ?? ''}
                              onDelete={onDeleteBlock(block.id)}
                              onEditorChange={handleBlockContentChange(
                                block.id,
                              )}
                            />
                          </div>
                        )}
                      </Draggable>
                    ) : (
                      <Draggable
                        draggableId={block.id}
                        index={index}
                        key={block.id}
                        isDragDisabled={isLoading}
                      >
                        {(provided) => (
                          <div
                            className="block__wrapper drop-shadow-lg"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <MediaBlock
                              onDeleteBlock={onDeleteBlock(block.id)}
                              isLoading={isLoading || isDeletePostLoading}
                              clearMedia={clearBlockMedia(block.id)}
                              handleMediaChange={handleBlockMediaChange}
                              id={block.id}
                              media={block.media}
                            />
                          </div>
                        )}
                      </Draggable>
                    ),
                  )}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};
