import React from 'react';
import { render, renderWithUser, screen } from 'testUtils';
import { MOCK_TEXT, MOCK_SLUG } from 'unitTests/sharedMocks';
import Cta from './cta';

test('Cta renders link if "to" provided and handles onClick', async () => {
  const onClickMock = jest.fn();
  const { user } = renderWithUser(
    <Cta to={MOCK_SLUG} text={MOCK_TEXT} onClick={onClickMock} />,
  );
  const link = screen.getByRole('link');
  expect(link.textContent).toEqual(MOCK_TEXT);
  expect(link).toHaveAttribute('href', MOCK_SLUG);
  expect(link).not.toHaveClass('fullWidth');
  await user.click(link);
  expect(onClickMock).toHaveBeenCalled();
});

test('Cta renders button by default and handles onClick', async () => {
  const onClickMock = jest.fn();
  const { user } = renderWithUser(
    <Cta text={MOCK_TEXT} onClick={onClickMock} />,
  );
  const button = screen.getByRole('button');
  expect(button.textContent).toEqual(MOCK_TEXT);
  expect(button).not.toHaveClass('fullWidth');
  await user.click(button);
  expect(onClickMock).toHaveBeenCalled();
});

test('Cta button not clickable when disabled', async () => {
  const onClickMock = jest.fn();
  const { user } = renderWithUser(
    <Cta text={MOCK_TEXT} onClick={onClickMock} disabled />,
  );
  const button = screen.getByRole('button');
  await user.click(button);
  expect(onClickMock).not.toHaveBeenCalled();
});

test('Cta button gets correct classNames', () => {
  const onClickMock = jest.fn();
  render(<Cta text={MOCK_TEXT} onClick={onClickMock} fullWidth outline />);
  const button = screen.getByRole('button');
  expect(button).toHaveClass('fullWidth');
  expect(button).toHaveClass('outline');
});

test('Cta button does not have related classNames when outline / fullwidth are false', () => {
  const onClickMock = jest.fn();
  render(
    <Cta
      text={MOCK_TEXT}
      onClick={onClickMock}
      fullWidth={false}
      outline={false}
    />,
  );
  const button = screen.getByRole('button');
  expect(button).not.toHaveClass('fullWidth');
  expect(button).not.toHaveClass('outline');
});

test('Cta link does not have related classNames when outline / fullwidth are false', () => {
  const onClickMock = jest.fn();
  render(
    <Cta
      text={MOCK_TEXT}
      to={MOCK_SLUG}
      onClick={onClickMock}
      fullWidth={false}
      outline={false}
    />,
  );
  const link = screen.getByRole('link');
  expect(link).not.toHaveClass('fullWidth');
  expect(link).not.toHaveClass('outline');
});

test('Cta link gets correct classNames', () => {
  const onClickMock = jest.fn();
  render(
    <Cta
      to={MOCK_SLUG}
      text={MOCK_TEXT}
      onClick={onClickMock}
      fullWidth
      outline
    />,
  );
  const link = screen.getByRole('link');
  expect(link).toHaveClass('fullWidth');
  expect(link).toHaveClass('outline');
});
