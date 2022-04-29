import React from 'react';
import { render, screen } from 'testUtils';
import { MOCK_TEXT } from 'unitTests/sharedMocks';
import AccordionContent from './accordionContent';

test('AccordionContent renders correctly when it is open', () => {
  render(
    <AccordionContent isOpen ariaId="panel-01" ariaLabelledBy="button-01">
      <div>{MOCK_TEXT}</div>
    </AccordionContent>,
  );

  const content = screen.getByRole('region');
  expect(content.textContent).toEqual(MOCK_TEXT);
  expect(content.classList.contains('isOpen')).toBe(true);
});

test('AccordionContent renders correctly when it is open', () => {
  render(
    <AccordionContent
      isOpen={false}
      ariaId="panel-01"
      ariaLabelledBy="button-01"
    >
      <div>{MOCK_TEXT}</div>
    </AccordionContent>,
  );

  const content = screen.getByRole('region');
  expect(content.textContent).toEqual(MOCK_TEXT);
  expect(content.classList.contains('isOpen')).toBe(false);
});
