import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { noop } from 'lodash';
import AccordionHeader from './accordionHeader';

describe('AccordionHeader', () => {
  describe('when is selected', () => {
    it('should render correctly', () => {
      const rendered = renderer.create(
        <AccordionHeader isOpen onClick={noop} ariaId="button-01" ariaControls="panel-01">
          <div>this is the header</div>
        </AccordionHeader>,
      );
      expect(rendered.toJSON()).toMatchSnapshot();
    });
  });

  describe('when is not selected', () => {
    it('should render correctly', () => {
      const rendered = renderer.create(
        <AccordionHeader isOpen={false} onClick={noop} ariaId="button-01" ariaControls="panel-01">
          <div>this is the header</div>
        </AccordionHeader>,
      );
      expect(rendered.toJSON()).toMatchSnapshot();
    });
  });

  describe('when clicking', () => {
    it('should call "onClick"', () => {
      const onClick = jest.fn();

      const wrapper = shallow(
        <AccordionHeader isOpen onClick={onClick} ariaId="button-01" ariaControls="panel-01">
          <div>this is the header</div>
        </AccordionHeader>,
      );

      wrapper.find('.accordionHeader').simulate('click');
      expect(onClick).toHaveBeenCalled();
    });
  });
});
