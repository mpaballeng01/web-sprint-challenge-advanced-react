// Write your tests here
// test('sanity', () => {
//   expect(true).toBe(false)
// })
// frontend/components/App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppFunctional from './AppFunctional';

test('sanity check', () => {
  expect(true).toBe(true);
});

test('renders grid and buttons', () => {
  render(<AppFunctional />);
  
  // Check for grid
  const squares = screen.getAllByRole('gridcell');
  expect(squares).toHaveLength(9);
  
  // Check for control buttons
  expect(screen.getByText('LEFT')).toBeInTheDocument();
  expect(screen.getByText('UP')).toBeInTheDocument();
  expect(screen.getByText('RIGHT')).toBeInTheDocument();
  expect(screen.getByText('DOWN')).toBeInTheDocument();
  expect(screen.getByText('reset')).toBeInTheDocument();
});

test('updates coordinates on move', () => {
  render(<AppFunctional />);
  
  // Check initial coordinates
  expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();

  // Move right and check updated coordinates
  fireEvent.click(screen.getByText('RIGHT'));
  expect(screen.getByText(/coordinates \(3, 2\)/i)).toBeInTheDocument();

  // Move down and check updated coordinates
  fireEvent.click(screen.getByText('DOWN'));
  expect(screen.getByText(/coordinates \(3, 3\)/i)).toBeInTheDocument();
});

test('updates step count on move', () => {
  render(<AppFunctional />);
  
  // Check initial step count
  expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();

  // Move and check step count
  fireEvent.click(screen.getByText('LEFT'));
  expect(screen.getByText(/you moved 1 time/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText('UP'));
  expect(screen.getByText(/you moved 2 times/i)).toBeInTheDocument();
});

test('reset button restores initial state', () => {
  render(<AppFunctional />);
  
  // Move to change state
  fireEvent.click(screen.getByText('RIGHT'));
  fireEvent.click(screen.getByText('DOWN'));

  // Click reset and check initial state restored
  fireEvent.click(screen.getByText('reset'));
  expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
  expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();
});

test('input value changes when typed in', () => {
  render(<AppFunctional />);
  
  const input = screen.getByPlaceholderText('type email');
  fireEvent.change(input, { target: { value: 'test@example.com' } });
  expect(input).toHaveValue('test@example.com');
});