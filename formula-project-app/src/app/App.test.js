import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard tabs', () => {
  render(<App />);
  const dashboardTab = screen.getByText(/📊 Dashboard/i);
  expect(dashboardTab).toBeInTheDocument();
});
