import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimezoneSelector from './TimezoneSelector';
import { TimezoneDisplay } from '@/types';

// Mock timezones for testing
const mockTimezones: TimezoneDisplay[] = [
  {
    id: 'America/New_York',
    name: 'Eastern Time',
    offset: -300,
    abbreviation: 'EST',
    isBusiness: true,
  },
  {
    id: 'America/Chicago',
    name: 'Central Time',
    offset: -360,
    abbreviation: 'CST',
    isBusiness: true,
  },
  {
    id: 'America/Denver',
    name: 'Mountain Time',
    offset: -420,
    abbreviation: 'MST',
    isBusiness: true,
  },
  {
    id: 'America/Los_Angeles',
    name: 'Pacific Time',
    offset: -480,
    abbreviation: 'PST',
    isBusiness: true,
  },
];

describe('TimezoneSelector', () => {
  const mockProps = {
    availableTimezones: mockTimezones,
    selectedTimezones: [],
    onTimezoneToggle: vi.fn(),
    onSelectAll: vi.fn(),
    onDeselectAll: vi.fn(),
    getSelectAllState: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with title and search input', () => {
    mockProps.getSelectAllState.mockReturnValue(false);

    render(<TimezoneSelector {...mockProps} />);

    expect(screen.getByText('Select Timezones')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search timezones...')).toBeTruthy();
  });

  it('renders all available timezones when no search query', () => {
    mockProps.getSelectAllState.mockReturnValue(false);

    render(<TimezoneSelector {...mockProps} />);

    expect(screen.getByText('Eastern Time')).toBeTruthy();
    expect(screen.getByText('Central Time')).toBeTruthy();
    expect(screen.getByText('Mountain Time')).toBeTruthy();
    expect(screen.getByText('Pacific Time')).toBeTruthy();
  });

  it('filters timezones based on search query', async () => {
    const user = userEvent.setup();
    mockProps.getSelectAllState.mockReturnValue(false);

    render(<TimezoneSelector {...mockProps} />);

    const searchInput = screen.getByPlaceholderText('Search timezones...');
    await user.type(searchInput, 'Pacific');

    expect(screen.getByText('Pacific Time')).toBeTruthy();
    expect(screen.queryByText('Eastern Time')).toBeNull();
    expect(screen.queryByText('Central Time')).toBeNull();
    expect(screen.queryByText('Mountain Time')).toBeNull();
  });

  it('shows "Select All" checkbox with count', () => {
    mockProps.getSelectAllState.mockReturnValue(false);

    render(<TimezoneSelector {...mockProps} />);

    expect(screen.getByText('Select All (4)')).toBeTruthy();
    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    expect(selectAllCheckbox).toBeTruthy();
    expect((selectAllCheckbox as HTMLInputElement).checked).toBe(false);
  });

  it('shows indeterminate state when some timezones are selected', () => {
    mockProps.getSelectAllState.mockReturnValue(null); // indeterminate

    render(<TimezoneSelector {...mockProps} />);

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    expect(selectAllCheckbox).toHaveProperty('indeterminate', true);
  });

  it('shows checked state when all timezones are selected', () => {
    mockProps.getSelectAllState.mockReturnValue(true);

    render(<TimezoneSelector {...mockProps} />);

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    expect((selectAllCheckbox as HTMLInputElement).checked).toBe(true);
  });

  it('calls onSelectAll when clicking unchecked select all checkbox', () => {
    mockProps.getSelectAllState.mockReturnValue(false);

    render(<TimezoneSelector {...mockProps} />);

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    fireEvent.click(selectAllCheckbox);

    expect(mockProps.onSelectAll).toHaveBeenCalledWith(mockTimezones);
    expect(mockProps.onDeselectAll).not.toHaveBeenCalled();
  });

  it('calls onDeselectAll when clicking checked select all checkbox', () => {
    mockProps.getSelectAllState.mockReturnValue(true);

    render(<TimezoneSelector {...mockProps} />);

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    fireEvent.click(selectAllCheckbox);

    expect(mockProps.onDeselectAll).toHaveBeenCalledWith(mockTimezones);
    expect(mockProps.onSelectAll).not.toHaveBeenCalled();
  });

  it('calls onSelectAll when clicking indeterminate select all checkbox', () => {
    mockProps.getSelectAllState.mockReturnValue(null);

    render(<TimezoneSelector {...mockProps} />);

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    fireEvent.click(selectAllCheckbox);

    expect(mockProps.onSelectAll).toHaveBeenCalledWith(mockTimezones);
    expect(mockProps.onDeselectAll).not.toHaveBeenCalled();
  });

  it('respects filtered timezones in select all operations', async () => {
    const user = userEvent.setup();
    mockProps.getSelectAllState.mockReturnValue(false);

    render(<TimezoneSelector {...mockProps} />);

    // Search for Pacific timezones
    const searchInput = screen.getByPlaceholderText('Search timezones...');
    await user.type(searchInput, 'Pacific');

    // Mock getSelectAllState to return the filtered result
    mockProps.getSelectAllState.mockReturnValue(false);

    // Re-render to get updated filtered timezones
    // Note: In a real scenario, getSelectAllState would be called with filtered results
    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    fireEvent.click(selectAllCheckbox);

    // Should call with filtered timezones (only Pacific in this case)
    expect(mockProps.onSelectAll).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'Pacific Time' }),
    ]);
  });

  it('disables select all checkbox when no timezones are available', () => {
    const emptyProps = {
      ...mockProps,
      availableTimezones: [],
      getSelectAllState: vi.fn().mockReturnValue(false),
    };

    render(<TimezoneSelector {...emptyProps} />);

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    expect((selectAllCheckbox as HTMLInputElement).disabled).toBe(true);
  });

  it('calls onTimezoneToggle when individual timezone checkbox is clicked', () => {
    mockProps.getSelectAllState.mockReturnValue(false);

    render(<TimezoneSelector {...mockProps} />);

    const easternCheckbox = screen.getByRole('checkbox', { name: /eastern time/i });
    fireEvent.click(easternCheckbox);

    expect(mockProps.onTimezoneToggle).toHaveBeenCalledWith(mockTimezones[0]);
  });
});