import React from 'react';
import renderer from 'react-test-renderer';
import { noop } from 'lodash';
import Accordion from './accordion';

describe('Accordion', () => {
  describe('when is selected', () => {
    it('should render correctly', () => {
      const rendered = renderer.create(
        <Accordion
          header="this is the header"
          content="this is the content"
          isOpen
          onSelected={noop}
          ariaId="component-01"
        />,
      );
      expect(rendered.toJSON()).toMatchSnapshot();
    });
  });

  describe('when is not selected', () => {
    it('should render correctly', () => {
      const rendered = renderer.create(
        <Accordion
          header="this is the header"
          content="this is the content"
          isOpen={false}
          onSelected={noop}
          ariaId="component-01"
        />,
      );
      expect(rendered.toJSON()).toMatchSnapshot();
    });
  });
});
