import '@mdxeditor/editor/style.css';
import './TextEditor.scss';
import {
  BoldItalicUnderlineToggles,
  MDXEditor,
  UndoRedo,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  CreateLink,
  ListsToggle,
  BlockTypeSelect,
  linkPlugin,
  linkDialogPlugin,
} from '@mdxeditor/editor';
import { Button } from '@nextui-org/react';
import { TrashIcon } from '../../assets/icons';
import { FC } from 'react';
import { TextEditorProps } from './TextEditor.props';

export const TextEditor: FC<TextEditorProps> = ({
  content = '',
  onDelete,
  onEditorChange,
}) => {
  return (
    <div className="text-editor">
      <MDXEditor
        className="editor"
        markdown={content}
        onChange={onEditorChange}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <CreateLink />
                <ListsToggle />
                <BlockTypeSelect />
              </>
            ),
          }),
        ]}
      />
      <Button
        className="delete__button drop-shadow-lg"
        isIconOnly
        color="danger"
        onPress={onDelete}
      >
        <TrashIcon />
      </Button>
    </div>
  );
};
