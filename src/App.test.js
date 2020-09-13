import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders app development link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/app development/i);
  expect(linkElement).toBeInTheDocument();
});
