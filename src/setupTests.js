/**
 * NOTE: Jest has memory leak problems which surface when frontend tests scale to a large number.
 * https://github.com/facebook/jest/issues/1893
 *
 * Solution: Re-use one JSDOM instance, and exclude babel-polyfill.
 * https://github.com/facebook/jest/issues/1893#issuecomment-275080618
 */

import 'raf/polyfill';
import 'jest-enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
