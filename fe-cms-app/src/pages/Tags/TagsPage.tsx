import { Button, Chip, Input, Spinner } from '@nextui-org/react';
import { useTagsPage } from './hooks/useTags';
import './TagsPage.scss';

export const TagsPage = () => {
  const {
    formik,
    handleChange,
    isLoading,
    moveToCreateTags,
    moveToDeleteTags,
    onSave,
    tags,
    onEnterPress,
    tagsToRemove,
  } = useTagsPage();
  return (
    <div className="tags__wrapper">
      <div className="tags__wrapper__form">
        <Input
          size="sm"
          onChange={handleChange}
          value={formik.values.name}
          label="Name"
          name="name"
          errorMessage={formik.errors.name}
          isInvalid={!!formik.errors.name}
          onKeyDown={onEnterPress}
        />
        <Button size="lg" onPress={formik.submitForm} color="primary">
          Add
        </Button>
        <Button size="lg" onPress={onSave} color="secondary">
          Save
        </Button>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="tags__wrapper__table">
          <div className="tags__wrapper__table__tags">
            {tags.map((tag) => (
              <Chip
                key={tag.name}
                color="primary"
                onClose={moveToDeleteTags(tag)}
              >
                {tag.name}
              </Chip>
            ))}
          </div>
          <div className="tags__wrapper__table__tags">
            {tagsToRemove.map((tag) => (
              <Chip
                key={tag.name}
                color="secondary"
                onClose={moveToCreateTags(tag)}
              >
                {tag.name}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
