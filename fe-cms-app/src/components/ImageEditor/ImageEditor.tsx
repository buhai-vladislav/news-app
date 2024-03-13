import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import { FC, useCallback, useState } from 'react';
import type { ImageEditorProps } from './ImageEditor.props.ts';
import { Button, Image, Slider } from '@nextui-org/react';
import './ImageEditor.scss';

export const ImageEditor: FC<ImageEditorProps> = ({
  image,
  setImage,
  height = 250,
  width = 250,
  imageRef,
  buttons,
  borderRadius = 140,
  disabled,
}) => {
  const [scale, setScale] = useState(1);

  const handleDrop = useCallback((dropped: File[]) => {
    setImage(dropped[0]);
  }, []);

  const resetImage = useCallback(() => {
    setImage('');
  }, []);

  const handleSliderChange = useCallback((value: number | number[]) => {
    if (typeof value === 'number') {
      setScale(value);
    } else {
      setScale(value[1]);
    }
  }, []);

  return disabled ? (
    <Image
      src={typeof image === 'string' ? image : ''}
      width="650px"
      style={{ borderRadius: '25px' }}
    />
  ) : (
    <div className="editor__wrapper">
      <Dropzone onDrop={handleDrop} noClick={!!image} noKeyboard>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <AvatarEditor
              ref={imageRef}
              width={width}
              height={height}
              image={image}
              borderRadius={borderRadius}
              scale={scale}
            />
            <input {...getInputProps()} />

            <Button
              color="primary"
              className="w-full"
              variant="bordered"
              onClick={resetImage}
            >
              Reset
            </Button>
          </div>
        )}
      </Dropzone>
      <Slider
        step={0.01}
        maxValue={4}
        minValue={1}
        defaultValue={0.01}
        className="max-w-md"
        onChange={handleSliderChange}
      />
      {buttons}
    </div>
  );
};
