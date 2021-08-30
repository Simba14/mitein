import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import AccordionContent from './accordionContent';

describe('AccordionContent', () => {
  it('should render correctly', () => {
    const rendered = renderer.create(
      <AccordionContent isOpen ariaId="panel-01" ariaLabelledBy="button-01">
        <div>this is the content</div>
      </AccordionContent>,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  describe('when is open', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <AccordionContent isOpen ariaId="panel-01" ariaLabelledBy="button-01">
          <div>this is the content</div>
        </AccordionContent>,
      );
    });

    it('should show the container', () => {
      expect(wrapper.find('.accordionContent')).toHaveLength(1);
    });

    it('should show the content', () => {
      expect(wrapper.hasClass('isOpen')).toEqual(true);
    });
  });

  describe('when is not open', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <AccordionContent isOpen={false} ariaId="panel-01" ariaLabelledBy="button-01">
          <div>this is the content</div>
        </AccordionContent>,
      );
    });

    it('should not show the content', () => {
      expect(wrapper.hasClass('isOpen')).toEqual(false);
    });
  });
});
