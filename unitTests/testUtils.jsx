import React from 'react';
import { render as defaultRender } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { MockedProvider } from '@apollo/client/testing';
import { ENGLISH } from '@constants/defaultOptions';

export * from '@testing-library/react';

// --------------------------------------------------
// Override the default test render with our own
//
// You can override the router mock like this:
//
// const { baseElement } = render(<MyComponent />, {
//   router: { pathname: '/my-custom-pathname' },
// });
// --------------------------------------------------

const mockRouter = {
  basePath: '/',
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  locale: ENGLISH,
  push: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
  reload: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve()),
  back: jest.fn(() => Promise.resolve(true)),
  beforePopState: jest.fn(() => Promise.resolve(true)),
  isFallback: false,
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
};

function render(ui, { wrapper, router, mocks = [], ...options } = {}) {
  if (!wrapper) {
    // eslint-disable-next-line react/display-name
    wrapper = ({ children }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterContext.Provider value={{ ...mockRouter, ...router }}>
          {children}
        </RouterContext.Provider>
      </MockedProvider>
    );
  }

  return defaultRender(ui, {
    wrapper,
    ...options,
  });
}

// import { render } from '@testing-library/react';
// import { TranslationProvider } from 'my-i18n-lib';

// const AllTheProviders = ({ children }) => {
//   return (
//     <TranslationProvider messages={defaultStrings}>
//       {children}
//     </TranslationProvider>
//   );
// };

// const customRender = (ui, options) =>
//   render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { render };
