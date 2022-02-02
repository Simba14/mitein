import React from 'react';
import { noop } from 'lodash';
import { render, screen, userEvent } from 'testUtils';
import AccordionHeader from './accordionHeader';
import { MOCK_TEXT } from 'unitTests/sharedMocks';

test('AccordionHeader renders correctly when isOpen', () => {
  render(
    <AccordionHeader
      isOpen
      onClick={noop}
      ariaId="button-01"
      ariaControls="panel-01"
      text={MOCK_TEXT}
    />,
  );

  const btn = screen.getByRole('button');
  expect(btn.textContent).toEqual(MOCK_TEXT);
  expect(btn.classList.contains('isOpen')).toBe(true);
  expect(screen.getByTestId('svg')).toBeTruthy();
});

test('AccordionHeader renders correctly when isOpen is false', () => {
  render(
    <AccordionHeader
      isOpen={false}
      onClick={noop}
      ariaId="button-01"
      ariaControls="panel-01"
      text={MOCK_TEXT}
    />,
  );

  const btn = screen.getByRole('button');
  expect(btn.textContent).toEqual(MOCK_TEXT);
  expect(btn.classList.contains('isOpen')).toBe(false);
  expect(screen.getByTestId('svg')).toBeTruthy();
});

test('button click should call onClick', () => {
  const onClick = jest.fn();
  render(
    <AccordionHeader
      isOpen={false}
      onClick={onClick}
      ariaId="button-01"
      ariaControls="panel-01"
      text={MOCK_TEXT}
    />,
  );

  userEvent.click(screen.getByRole('button'));
  expect(onClick).toHaveBeenCalled();
});
