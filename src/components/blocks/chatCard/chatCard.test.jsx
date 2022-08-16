import React from 'react';
import { render, renderWithUser, screen } from 'testUtils';
import ChatCard from './chatCard';
// import GET_AVAILABILITY from '@graphql/queries/getChats.graphql';
// import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import {
  MOCK_ID,
  MOCK_CHAT,
  MOCK_START_EN,
  MOCK_TIME_EN,
} from 'unitTests/sharedMocks';
import {
  CHAT_STATUS_BOOKED,
  CHAT_STATUS_CANCELLED,
  CHAT_STATUS_REQUESTED,
  CHAT_STATUS_REJECTED,
  USER_TYPE_LEARNER,
  USER_TYPE_NATIVE,
} from '@api/firebase/constants';
import UPDATE_CHAT from '@graphql/mutations/updateChat.graphql';

const CANCEL_CHAT = {
  request: {
    query: UPDATE_CHAT,
    variables: {
      ...MOCK_CHAT,
      status: CHAT_STATUS_CANCELLED,
      cancellationReason: USER_TYPE_LEARNER,
      cancelledBy: MOCK_ID,
    },
  },
  result: {
    data: {
      chat: MOCK_CHAT,
    },
  },
};

describe('User is a LEARNER', () => {
  test('ChatCard renders correctly when status is BOOKED', () => {
    const { container } = render(
      <ChatCard
        chat={MOCK_CHAT}
        status={CHAT_STATUS_BOOKED}
        userType={USER_TYPE_LEARNER}
        userId={MOCK_ID}
      />,
    );

    const textKey = `${USER_TYPE_LEARNER}.${CHAT_STATUS_BOOKED}`;
    const cancelBtn = screen.getByRole('button');
    const link = screen.getByRole('link');
    expect(container).toHaveTextContent(`${textKey}.title`);
    expect(container).toHaveTextContent(MOCK_START_EN);
    expect(container).toHaveTextContent(MOCK_TIME_EN);
    expect(container).toHaveTextContent(`${textKey}.moreInfo`);
    expect(cancelBtn).toHaveTextContent(`${textKey}.cancelCta`);
    expect(link).toHaveAttribute('href', MOCK_CHAT.link);
  });

  test('ChatCard renders correctly when status is REQUESTED', () => {
    const { container } = render(
      <ChatCard
        chat={MOCK_CHAT}
        status={CHAT_STATUS_REQUESTED}
        userType={USER_TYPE_LEARNER}
        userId={MOCK_ID}
      />,
    );

    const textKey = `${USER_TYPE_LEARNER}.${CHAT_STATUS_REQUESTED}`;
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
        chat={MOCK_CHAT}
        status={CHAT_STATUS_REJECTED}
        userType={USER_TYPE_LEARNER}
        userId={MOCK_ID}
      />,
    );

    const textKey = `${USER_TYPE_LEARNER}.${CHAT_STATUS_REJECTED}`;
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

  test('can successfully cancel a chat', async () => {
    const { user } = renderWithUser(
      <ChatCard
        chat={MOCK_CHAT}
        status={CHAT_STATUS_REQUESTED}
        userType={USER_TYPE_LEARNER}
        userId={MOCK_ID}
      />,
      {
        mocks: [CANCEL_CHAT],
      },
    );

    const cancelBtn = screen.getByRole('button');
    await user.click(cancelBtn);
    // ensure loading is finished
    // await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
  });
});

describe('User is a NATIVE', () => {
  test('ChatCard renders correctly when status is REQUESTED', () => {
    const { container } = render(
      <ChatCard
        chat={MOCK_CHAT}
        status={CHAT_STATUS_REQUESTED}
        userType={USER_TYPE_NATIVE}
        userId={MOCK_ID}
      />,
      {
        mocks: [CANCEL_CHAT],
      },
    );

    const textKey = `${USER_TYPE_NATIVE}.${CHAT_STATUS_REQUESTED}`;
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
