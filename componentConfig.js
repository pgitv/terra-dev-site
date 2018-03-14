import React from 'react';
import Markdown from 'terra-markdown';
import BuildingASite from './docs/BuildingASite.md';
import AppConfig from './docs/AppConfig.md';
import ComponentConfig from './docs/ComponentConfig.md';
import NavigationConfig from './docs/NavigationConfig.md';

const renderComponent = props => (
  Component => (
    () => (React.createElement(Component, { ...props }))
  )
);

const navConfig = {
  'getting-started': {
    name: 'Building A Site',
    path: '/building-a-site',
    component: renderComponent({ src: BuildingASite })(Markdown),
  },
  config: {
    name: 'Configuration',
    path: '/config',
    docs: [
      {
        name: 'Application Configuration',
        path: '/app-config',
        component: renderComponent({ src: AppConfig })(Markdown),
      },
      {
        name: 'Component Configuration',
        path: '/component-config',
        component: renderComponent({ src: ComponentConfig })(Markdown),
      },
      {
        name: 'Navigation Configuration',
        path: '/navigation-config',
        component: renderComponent({ src: NavigationConfig })(Markdown),
      },
    ],
  },
  webpack: {
    name: 'Webpack',
    path: '/webpack',
    docs: [
      {
        name: 'Configuration',
        path: '/webpack-configs',
        // component: null,
      },
      {
        name: 'I18n Plugin',
        path: '/i18n-plugin',
        // component: null,
      },
      {
        name: 'Theming Plugin',
        path: '/theming-plugin',
        // component: null,
      },
    ],
  },
  templates: {
    name: 'Templates',
    path: '/templates',
    docs: [{
      name: 'Index Page Template',
      path: '/index-page-template',
      // component: null,
    }],
  },
};

export default navConfig;
