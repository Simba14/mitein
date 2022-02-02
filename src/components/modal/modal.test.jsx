import React from 'react';
import { render, screen, userEvent } from 'testUtils';
import Modal from './modal';
import { BACKDROP_LABEL } from 'components/modal';

const CHILDREN_TEST_ID = 'children';
const PARENT_TEST_ID = 'parent';

test('Modal renders null when not open or active', () => {
  const onCloseMock = jest.fn();
  render(
    <Modal open={false} onClose={onCloseMock}>
      <div data-testid={CHILDREN_TEST_ID} />
    </Modal>,
  );

  const backdrop = screen.queryByLabelText(BACKDROP_LABEL);
  const children = screen.queryByTestId(CHILDREN_TEST_ID);
  expect(children).not.toBeInTheDocument();
  expect(backdrop).not.toBeInTheDocument();
});

test('Modal renders correctly when open', () => {
  const onCloseMock = jest.fn();
  render(
    <Modal open onClose={onCloseMock}>
      <div data-testid={CHILDREN_TEST_ID} />
    </Modal>,
  );

  const backdrop = screen.getByLabelText(BACKDROP_LABEL);
  const children = screen.getByTestId(CHILDREN_TEST_ID);
  expect(children).toBeInTheDocument();
  expect(backdrop).toBeInTheDocument();
});

test('Modal is correctly appended to parent element if provided', () => {
  const onCloseMock = jest.fn();
  const parentEl = document.createElement('div');
  parentEl.setAttribute('data-testid', PARENT_TEST_ID);
  document.body.appendChild(parentEl);
  render(
    <Modal open onClose={onCloseMock} parent={parentEl}>
      <div data-testid={CHILDREN_TEST_ID} />
    </Modal>,
  );

  const backdrop = screen.getByLabelText(BACKDROP_LABEL);
  const parent = screen.getByTestId(PARENT_TEST_ID);

  expect(parent).toBeInTheDocument();
  // content gets appended to div
  expect(parent.firstChild.firstChild).toEqual(backdrop);
});

test('Modal can be closed by clicking on backdrop', () => {
  const onCloseMock = jest.fn();
  render(
    <Modal open onClose={onCloseMock}>
      <div data-testid={CHILDREN_TEST_ID} />
    </Modal>,
  );

  const backdrop = screen.getByLabelText(BACKDROP_LABEL);
  userEvent.click(backdrop);
  expect(onCloseMock).toHaveBeenCalled();
});

test('Modal cannot be closed by clicking on backdrop when locked', () => {
  const onCloseMock = jest.fn();
  render(
    <Modal locked open onClose={onCloseMock}>
      <div data-testid={CHILDREN_TEST_ID} />
    </Modal>,
  );

  const backdrop = screen.getByLabelText(BACKDROP_LABEL);
  userEvent.click(backdrop);
  expect(onCloseMock).not.toHaveBeenCalled();
});
