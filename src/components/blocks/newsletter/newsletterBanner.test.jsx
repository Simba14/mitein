import React from 'react';
import { render, renderWithUser, screen, waitFor } from 'testUtils';
import { GraphQLError } from 'graphql';
import NewsletterBanner from './newsletterBanner';
import {
  MOCK_EMAIL,
  MOCK_ERROR,
  MOCK_TITLE,
  MOCK_TEXT,
} from 'unitTests/sharedMocks';
import NEWSLETTER_SIGN_UP from '@graphql/mutations/newsletterSignUp.graphql';

const VALID_EMAIL_MOCK = {
  request: {
    query: NEWSLETTER_SIGN_UP,
    variables: {
      email: MOCK_EMAIL,
    },
  },
  result: {
    data: {
      newsletterSignUp: 'success',
    },
  },
};

const INVALID_EMAIL_MOCK = {
  request: {
    query: NEWSLETTER_SIGN_UP,
    variables: {
      email: MOCK_EMAIL,
    },
  },
  result: {
    errors: [new GraphQLError(MOCK_ERROR)],
  },
};

const NETWORK_ERROR_MOCK = {
  request: {
    query: NEWSLETTER_SIGN_UP,
    variables: {
      email: MOCK_EMAIL,
    },
  },
  error: new Error('An error occurred'),
};

test('NewsletterBanner renders correctly', () => {
  const { container } = render(
    <NewsletterBanner heading={MOCK_TITLE} description={MOCK_TEXT} />,
  );
  const submit = screen.getByRole('button');
  const heading = screen.getByRole('heading');
  const textInput = screen.getByRole('textbox');
  const formMessage = screen.getByRole('alert');

  expect(heading).toHaveTextContent(MOCK_TITLE);
  expect(container).toHaveTextContent(MOCK_TEXT);
  expect(textInput).toHaveAttribute('type', 'email');
  expect(textInput).toHaveAttribute('placeholder', 'newsletter:placeholder');
  expect(submit).toHaveTextContent('newsletter:cta');
  expect(submit).toBeEnabled();
  expect(formMessage).toBeEmptyDOMElement();
});

test('NewsletterBanner when subscribing successfully', async () => {
  const { user } = renderWithUser(
    <NewsletterBanner heading={MOCK_TITLE} description={MOCK_TEXT} />,
    {
      mocks: [VALID_EMAIL_MOCK],
    },
  );
  const submit = screen.getByRole('button');
  const textInput = screen.getByRole('textbox');
  const formMessage = screen.getByRole('alert');

  expect(textInput).not.toHaveValue();
  // input email address
  await user.type(textInput, MOCK_EMAIL);
  expect(textInput).toHaveValue(MOCK_EMAIL);
  // submit
  await user.click(submit);
  await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
  expect(formMessage).toHaveTextContent('newsletter:successMessage');
});

test('NewsletterBanner submitting with invalid email should prevent submit', async () => {
  const { user } = renderWithUser(
    <NewsletterBanner heading={MOCK_TITLE} description={MOCK_TEXT} />,
    {
      mocks: [VALID_EMAIL_MOCK],
    },
  );
  const submit = screen.getByRole('button');
  const textInput = screen.getByRole('textbox');
  const formMessage = screen.getByRole('alert');

  expect(textInput).not.toHaveValue();
  expect(textInput).not.toHaveFocus();
  await user.click(submit);
  await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
  expect(textInput).toHaveFocus();
  expect(formMessage).toBeEmptyDOMElement();
  // TODO add email validation (currently relying on browser)
  // type invalid email
  //   user.type(textInput, 'notAnEmail');
  //   user.click(submit);
  //   await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
  //   expect(textInput).toHaveFocus();
  //   expect(formMessage).toBeEmptyDOMElement();
});

test('NewsletterBanner unsuccessful subscription should display the error', async () => {
  const { user } = renderWithUser(
    <NewsletterBanner heading={MOCK_TITLE} description={MOCK_TEXT} />,
    {
      mocks: [INVALID_EMAIL_MOCK],
    },
  );
  const submit = screen.getByRole('button');
  const textInput = screen.getByRole('textbox');
  const formMessage = screen.getByRole('alert');

  await user.type(textInput, MOCK_EMAIL);
  await user.click(submit);
  await waitFor(() => new Promise(resolve => setTimeout(resolve, 100)));
  expect(formMessage).toHaveTextContent(MOCK_ERROR);
});

test('NewsletterBanner subscription with network error should display the error', async () => {
  const { user } = renderWithUser(
    <NewsletterBanner heading={MOCK_TITLE} description={MOCK_TEXT} />,
    {
      mocks: [NETWORK_ERROR_MOCK],
    },
  );
  const submit = screen.getByRole('button');
  const textInput = screen.getByRole('textbox');
  const formMessage = screen.getByRole('alert');

  await user.type(textInput, MOCK_EMAIL);
  await user.click(submit);
  await waitFor(() => new Promise(resolve => setTimeout(resolve, 100)));
  expect(formMessage).toHaveTextContent('Network error');
});
