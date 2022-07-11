import React from 'react';
import { render, screen, userEvent } from 'testUtils';
import ChatCard from './chatCard';
// import GET_AVAILABILITY from '@graphql/queries/getChats.graphql';
// import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import {
  MOCK_ID,
  MOCK_START_UTC,
  MOCK_END_UTC,
  MOCK_URL,
  MOCK_START_EN,
  MOCK_TIME_EN,
} from 'unitTests/sharedMocks';
import {
  BOOKED,
  CANCELLED,
  REQUESTED,
  REJECTED,
  LEARNER,
  NATIVE,
} from '@constants/user';
import UPDATE_CHAT from '@graphql/mutations/updateChat.graphql';

const mockChat = {
  id: MOCK_ID,
  start: MOCK_START_UTC,
  end: MOCK_END_UTC,
  link: MOCK_URL,
};

const CANCEL_CHAT = {
  request: {
    query: UPDATE_CHAT,
    variables: {
      ...mockChat,
      status: CANCELLED,
      cancellationReason: LEARNER,
      cancelledBy: MOCK_ID,
    },
  },
  result: {
    data: {
      chat: mockChat,
    },
  },
};

describe('User is a LEARNER', () => {
  test('ChatCard renders correctly when status is BOOKED', () => {
    const { container } = render(
      <ChatCard
        chat={mockChat}
        status={BOOKED}
        userType={LEARNER}
        userId={MOCK_ID}
      />,
    );

    const textKey = `${LEARNER}.${BOOKED}`;
    const cancelBtn = screen.getByRole('button');
    const link = screen.getByRole('link');
    expect(container).toHaveTextContent(`${textKey}.title`);
    expect(container).toHaveTextContent(MOCK_START_EN);
    expect(container).toHaveTextContent(MOCK_TIME_EN);
    expect(container).toHaveTextContent(`${textKey}.moreInfo`);
    expect(cancelBtn).toHaveTextContent(`${textKey}.cancelCta`);
    expect(link).toHaveAttribute('href', mockChat.link);
  });

  test('ChatCard renders correctly when status is REQUESTED', () => {
    const { container } = render(
      <ChatCard
        chat={mockChat}
        status={REQUESTED}
        userType={LEARNER}
        userId={MOCK_ID}
      />,
    );

    const textKey = `${LEARNER}.${REQUESTED}`;
    const cancelBtn = screen.getByRole('button');
    const link = screen.queryByRole('link');
    expect(container).toHaveTextContent(`${textKey}.title`);
    expect(container).toHaveTextContent(MOCK_START_EN);
    expect(container).toHaveTextContent(MOCK_TIME_EN);
    expect(container).toHaveTextContent(`${textKey}.moreInfo`);
    expect(cancelBtn).toHaveTextContent(`${textKey}.cancelCta`);
    expect(link).not.toBeInTheDocument();
  });

  test('ChatCard renders correctly when status is REJECTED', () => {
    const { container } = render(
      <ChatCard
        chat={mockChat}
        status={REJECTED}
        userType={LEARNER}
        userId={MOCK_ID}
      />,
    );

    const textKey = `${LEARNER}.${REJECTED}`;
    const cancelBtn = screen.queryByRole('button');
    const link = screen.queryByRole('link');
    expect(container).toHaveTextContent(`${textKey}.title`);
    expect(container.firstChild).toHaveClass('unavailable');
    expect(container).toHaveTextContent(MOCK_START_EN);
    expect(container).toHaveTextContent(MOCK_TIME_EN);
    expect(container).toHaveTextContent(`${textKey}.moreInfo`);
    expect(cancelBtn).not.toBeInTheDocument();
    expect(link).not.toBeInTheDocument();
  });

  test('can successfully cancel a chat', () => {
    render(
      <ChatCard
        chat={mockChat}
        status={REQUESTED}
        userType={LEARNER}
        userId={MOCK_ID}
      />,
      {
        mocks: [CANCEL_CHAT],
      },
    );

    const cancelBtn = screen.getByRole('button');
    userEvent.click(cancelBtn);
    // ensure loading is finished
    // await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
  });
});

describe('User is a NATIVE', () => {
  test('ChatCard renders correctly when status is REQUESTED', () => {
    const { container } = render(
      <ChatCard
        chat={mockChat}
        status={REQUESTED}
        userType={NATIVE}
        userId={MOCK_ID}
      />,
      {
        mocks: [CANCEL_CHAT],
      },
    );

    const textKey = `${NATIVE}.${REQUESTED}`;
    const [confirmBtn, cancelBtn] = screen.getAllByRole('button');
    const link = screen.queryByRole('link');
    expect(container).toHaveTextContent(`${textKey}.title`);
    expect(container).toHaveTextContent(MOCK_START_EN);
    expect(container).toHaveTextContent(MOCK_TIME_EN);
    expect(container).not.toHaveTextContent(`${textKey}.moreInfo`);
    expect(confirmBtn).toHaveTextContent(`${textKey}.confirmCta`);
    expect(cancelBtn).toHaveTextContent(`${textKey}.cancelCta`);
    expect(link).not.toBeInTheDocument();
  });
});