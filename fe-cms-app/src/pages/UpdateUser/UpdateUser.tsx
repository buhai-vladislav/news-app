import { Button, ButtonGroup, Tab, Tabs } from '@nextui-org/react';
import { ImageEditor } from '../../components/ImageEditor';
import { useUpdateUser } from './hooks/useUpdateUser';
import { FormStep } from '../../components/SignUp/SignUp.props';
import { UserForm } from '../../components/SignUp/components/UserForm';
import './UpdateUser.scss';

export const UpdateUserPage = () => {
  const { formik, handleStep, image, imageRef, selected, setImage, tabs } =
    useUpdateUser();
  return (
    <div className="signup__wrapper drop-shadow-lg">
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        radius="full"
        className="tabs__wrapper"
      >
        {tabs.map((tab) => (
          <Tab key={tab.key} title={tab.title} />
        ))}
      </Tabs>
      <div>
        {selected === FormStep.FORM && <UserForm formik={formik} />}
        {selected === FormStep.AVATAR && (
          <ImageEditor image={image} setImage={setImage} imageRef={imageRef} />
        )}
        <div className="button__wrapper">
          {selected !== FormStep.FORM ? (
            <ButtonGroup className="w-full">
              <Button color="primary" className="w-full" onClick={handleStep}>
                Prev
              </Button>
              <Button
                color="primary"
                className="w-full"
                onClick={formik.submitForm}
              >
                Save
              </Button>
            </ButtonGroup>
          ) : (
            <Button color="primary" className="w-full" onClick={handleStep}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
