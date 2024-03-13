import { Button, ButtonGroup, Tab, Tabs } from '@nextui-org/react';
import { FormStep } from './SignUp.props';
import { UserForm } from './components/UserForm';
import { ImageEditor } from '../ImageEditor';
import { useSignUp } from './hooks/useSignUp';
import './SignUp.scss';
import { Link } from 'react-router-dom';

export const SignUp = () => {
  const { selected, handleStep, tabs, formik, imageRef, image, setImage } =
    useSignUp();

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
                Sign Up
              </Button>
            </ButtonGroup>
          ) : (
            <Button color="primary" className="w-full" onClick={handleStep}>
              Next
            </Button>
          )}
        </div>
        <Link to="/login">Already have an account?</Link>
      </div>
    </div>
  );
};
