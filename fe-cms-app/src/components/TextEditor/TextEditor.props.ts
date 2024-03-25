export type TextEditorProps = {
  content: string;
  onEditorChange: (content: string) => void;
  onDelete: () => void;
}