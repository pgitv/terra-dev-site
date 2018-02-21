import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import App from '../../src/app/App';
import mockNavigation from './mock-navigation';
import mockRouteConfig from './mock-route-config';

const rootPath = '/site';
//
// const renderWithRouter = (Component, props) => {
//   const config = makeRouteConfig(
//       <Route path='/'
//         render={() => React.createElement(Component, props)}
//       />
//   );

//   // Now make a request against the route matching this route.
//   return getFarceResult({ // promise
//     url: "/",
//     routeConfig: config,
//     render: createRender({})
//   }).then(result => renderer.create(result.element));
// };

// // routeConfig: PropTypes.object.isRequired,
// // navigation: PropTypes.object.isRequired,
// // rootPath: PropTypes.string.isRequired,
//
describe('App', () => {
  it('should render an App with the default props', () => {
    const app = (
      <Router>
        <App routeConfig={{}} navigation={{}} rootPath={rootPath} />
      </Router>
    );

    const result = mount(app);
    expect(result).toMatchSnapshot();
  });
//
//   // it('should render an App with the default props', () => {
//   //   const app = (<App routeConfig={mockRouteConfig} navigaiton={mockNavigation} rootPath={rootPath} />);
//   //
//   //   const result = shallow(app);
//   //   expect(result).toMatchSnapshot();
//   // });
});
