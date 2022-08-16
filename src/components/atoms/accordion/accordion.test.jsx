import React from 'react';
import { render, renderWithUser, screen } from 'testUtils';
import { noop } from 'lodash';
import { MOCK_TEXT, MOCK_TITLE } from 'unitTests/sharedMocks';
import Accordion from './accordion';

test('Accordion renders correct options', () => {
  render(
    <Accordion
      headerText={MOCK_TITLE}
      content={MOCK_TEXT}
      onSelected={noop}
      ariaId="component-01"
    />,
  );

  const header = screen.getByRole('heading');
  const content = screen.getByRole('region');
  expect(header.textContent).toEqual(MOCK_TITLE);
  expect(content.textContent).toEqual(MOCK_TEXT);
});

test('Clicking on closed Accordion should "open" it', async () => {
  const onClickMock = jest.fn();
  const { user } = renderWithUser(
    <Accordion
      headerText={MOCK_TITLE}
      content={MOCK_TEXT}
      onClick={onClickMock}
      ariaId="component-01"
    />,
  );

  const btn = screen.getByRole('button');
  expect(btn.classList.contains('isOpen')).toBe(false);
  await user.click(btn);
  expect(onClickMock).toHaveBeenCalled();
  expect(btn.classList.contains('isOpen')).toBe(true);
});

test('Clicking on open Accordion should "close" it', async () => {
  const onClickMock = jest.fn();
  const { user } = renderWithUser(
    <Accordion
      headerText={MOCK_TITLE}
      content={MOCK_TEXT}
      onClick={onClickMock}
      open
      ariaId="component-01"
    />,
  );

  const btn = screen.getByRole('button');
  expect(btn.classList.contains('isOpen')).toBe(true);
  await user.click(btn);
  expect(onClickMock).toHaveBeenCalled();
  expect(btn.classList.contains('isOpen')).toBe(false);
});
