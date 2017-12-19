import { getMockUrlProp } from './helpers/utils';
import { mount } from 'enzyme';
import HomePage from '../index';


describe('Home page', () => {

  let homePage = null;
  beforeAll((done) => {
    homePage = mount(<HomePage url={getMockUrlProp('/')} />);
    done();
  });

  test('Should mount and render successfully', (done) => {
    expect(homePage).toMatchSnapshot();
    done();
  });
});
