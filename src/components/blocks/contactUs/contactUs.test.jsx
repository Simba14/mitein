import React from 'react';
import { render, screen } from 'testUtils';
import ContactUs from './contactUs';

const translation = 'contactUs';
const emailKey = `${translation}.email`;
const textKey = `${translation}.text`;
const descriptorKey = `${translation}.descriptor`;

test('ContactUs renders correctly', () => {
  const { container } = render(<ContactUs translation={translation} />);
  const link = screen.getByRole('link');
  expect(container).toHaveTextContent(textKey);
  expect(container).toHaveTextContent(descriptorKey);
  expect(link).toHaveTextContent(emailKey);
  expect(link).toHaveAttribute('href', `mailto: ${emailKey}`);
});
