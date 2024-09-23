import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Notify from './Notify';

describe('Notify Component', () => {
  test('renders notifications', () => {
    // Render the component with an empty notification list
    render(
      <MemoryRouter>
        <Notify notifications={[]} />
      </MemoryRouter>
    );

    // Check if a placeholder text is in the document
    expect(screen.getByText(/No notifications/i)).toBeInTheDocument();
  });

  test('renders a notification and removes it when clicked', () => {
    // Mock the notification removal action
    const notifications = [{ id: 1, message: 'Test Notification' }];
    const removeNotificationMock = jest.fn();

    // Render the Notify component with a notification
    render(
      <MemoryRouter>
        <Notify notifications={notifications} removeNotification={removeNotificationMock} />
      </MemoryRouter>
    );

    // Check if the notification is in the document
    expect(screen.getByText(/Test Notification/i)).toBeInTheDocument();

    // Simulate clicking the remove button
    const removeButton = screen.getByText(/Remove/i);
    removeButton.click();

    // Check if the mock function was called
    expect(removeNotificationMock).toHaveBeenCalledWith(1);
  });
});
