import React from 'react';
import { noop } from 'lodash';
import { render, renderWithUser, screen } from 'testUtils';
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

test('button click should call onClick', async () => {
  const onClick = jest.fn();
  const { user } = renderWithUser(
    <AccordionHeader
      isOpen={false}
      onClick={onClick}
      ariaId="button-01"
      ariaControls="panel-01"
      text={MOCK_TEXT}
    />,
  );
  await user.click(screen.getByRole('button'));
  expect(onClick).toHaveBeenCalled();
});
