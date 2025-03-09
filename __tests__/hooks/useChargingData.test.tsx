import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useChargingData from '@/hooks/useChargingData';
import { DateTime } from 'luxon';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // Disable retries for tests
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>
);

describe('useChargingData', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches data correctly', async () => {
    const mockResponse = {
      chargingStates: [
        { date: '2024-09-02T07:00:12.072Z', chargingLevel: 42 },
        { date: '2024-09-02T08:00:02.836Z', chargingLevel: 50 },
      ],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response),
    );

    const { result } = renderHook(() => useChargingData(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
  });

  it('formats the date into a valid date', async () => {
    const mockResponse = {
      chargingStates: [
        { date: '2024-09-02T07:00:12.072Z', chargingLevel: 42 },
        { date: '2024-09-02T08:00:02.836Z', chargingLevel: 50 },
      ],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response),
    );

    const { result } = renderHook(() => useChargingData(), { wrapper });

    result.current.data?.forEach((entry) => {
      expect(entry).toHaveProperty('date');
      expect(DateTime.fromISO(entry.date).isValid).toBe(true);
    });
  });

  it('handles API errors gracefully', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network Error')));

    const { result } = renderHook(() => useChargingData(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error('Network Error'));
  });

  it('handles invalid API responses', async () => {
    const responseWithoutChargingStates = {};
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(responseWithoutChargingStates),
      } as Response),
    );

    const { result } = renderHook(() => useChargingData(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Invalid data format');
  });
});
