import React from 'react';
import Home from '../../src/app/components/Home';
import readMeContent from './TestReadMe.md';

describe('Home', () => {
  it('should render an App without readMeContent', () => {
    const home = (<Home />);

    const result = shallow(home);
    expect(result).toMatchSnapshot();
  });

  it('should render an App with readMeContent', () => {
    const home = (<Home readMeConte={readMeContent} />);

    const result = shallow(home);
    expect(result).toMatchSnapshot();
  });
});
