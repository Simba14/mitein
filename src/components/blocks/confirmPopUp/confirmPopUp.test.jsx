import React from 'react';
import { render, screen, userEvent } from 'testUtils';
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

test('ConfirmPopUp renders correctly when open', () => {
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

test('ConfirmPopUp user clicks calls the appropriate callbacks', () => {
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

  // click confirm
  const [, cta] = screen.getAllByRole('button');
  userEvent.click(cta);
  expect(onConfirm).toHaveBeenCalled();
  // close modal
  const backdrop = screen.getByLabelText(BACKDROP_LABEL);
  userEvent.click(backdrop);
  expect(setModalOpenMock).toHaveBeenCalled();
});
