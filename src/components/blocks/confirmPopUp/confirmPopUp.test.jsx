import React from 'react';
import { render, renderWithUser, screen } from 'testUtils';
import ConfirmPopUp from './confirmPopUp';
import { BACKDROP_LABEL } from 'components/atoms/modal';

test('ConfirmPopUp renders null when not open', () => {
  const onConfirm = jest.fn();
  const setModalOpenMock = jest.fn();
  render(
    <ConfirmPopUp
      modalOpen={false}
      handleConfirmClick={onConfirm}
      namespace={'default'}
      setModalOpen={setModalOpenMock}
    />,
  );

  const dialog = screen.queryByRole('dialog');
  expect(dialog).not.toBeInTheDocument();
});

test('ConfirmPopUp renders correctly when open with no error', () => {
  const onConfirm = jest.fn();
  const setModalOpenMock = jest.fn();
  render(
    <ConfirmPopUp
      modalOpen
      handleConfirmClick={onConfirm}
      namespace={'default'}
      setModalOpen={setModalOpenMock}
    />,
  );

  const dialog = screen.getByRole('dialog');
  const heading = screen.getByRole('heading');
  const [, cta] = screen.getAllByRole('button');
  const error = screen.queryByRole('alert');
  expect(dialog).toBeInTheDocument();
  expect(heading).toBeInTheDocument();
  expect(cta).toBeInTheDocument();
  expect(cta).toBeEnabled();
  expect(error).not.toBeInTheDocument();
});

test('ConfirmPopUp renders correctly when open with error', () => {
  const ERROR_MOCK = 'error';
  const onConfirm = jest.fn();
  const setModalOpenMock = jest.fn();
  render(
    <ConfirmPopUp
      modalOpen
      error={ERROR_MOCK}
      handleConfirmClick={onConfirm}
      namespace={'default'}
      setModalOpen={setModalOpenMock}
    />,
  );

  const dialog = screen.getByRole('dialog');
  const heading = screen.getByRole('heading');
  const [, cta] = screen.getAllByRole('button');
  const error = screen.getByRole('alert');
  expect(dialog).toBeInTheDocument();
  expect(heading).toBeInTheDocument();
  expect(cta).toBeInTheDocument();
  expect(cta).toBeDisabled();
  expect(error).toBeInTheDocument();
  expect(error).toHaveTextContent(ERROR_MOCK);
});

test('ConfirmPopUp user clicks calls the appropriate callbacks', async () => {
  const onConfirm = jest.fn();
  const setModalOpenMock = jest.fn();
  const { user } = renderWithUser(
    <ConfirmPopUp
      modalOpen
      handleConfirmClick={onConfirm}
      namespace={'default'}
      setModalOpen={setModalOpenMock}
    />,
  );

  // click confirm
  const [, cta] = screen.getAllByRole('button');
  await user.click(cta);
  expect(onConfirm).toHaveBeenCalled();
  // close modal
  const backdrop = screen.getByLabelText(BACKDROP_LABEL);
  await user.click(backdrop);
  expect(setModalOpenMock).toHaveBeenCalled();
});

test('ConfirmPopUp renders correctly when ctaLoading is true', () => {
  const onConfirm = jest.fn();
  const setModalOpenMock = jest.fn();
  render(
    <ConfirmPopUp
      ctaLoading
      modalOpen
      handleConfirmClick={onConfirm}
      namespace={'default'}
      setModalOpen={setModalOpenMock}
    />,
  );

  const [, cta] = screen.getAllByRole('button');
  expect(cta).toBeInTheDocument();
  expect(cta).toBeDisabled();
});
