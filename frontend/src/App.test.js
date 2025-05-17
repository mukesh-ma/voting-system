import { render, screen } from '@testing-library/react';
import App from './App';

test('renders voting buttons and results', () => {
  render(<App />);

  // Check if voting buttons are in the document
  const button1 = screen.getByText(/candidate 1/i);
  const button2 = screen.getByText(/candidate 2/i);
  const button3 = screen.getByText(/candidate 3/i);

  // Assert that all buttons are rendered
  expect(button1).toBeInTheDocument();
  expect(button2).toBeInTheDocument();
  expect(button3).toBeInTheDocument();
});
