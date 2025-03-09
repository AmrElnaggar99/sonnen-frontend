import { ChargingStateAPIResponse } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';

const fetchChargingData = async () => {
  try {
    const response = await fetch('/api/chargingData');
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
    const data = (await response.json()) as ChargingStateAPIResponse;

    if (!data.chargingStates) {
      throw new Error("Invalid data format: Missing 'chargingStates'");
    }
    const userTimeZone = DateTime.local().zoneName;
    const formattedData = data.chargingStates.map((entry) => ({
      date: DateTime.fromISO(entry.date, { zone: 'utc' }).setZone(userTimeZone).toString(),
      chargingLevel: entry.chargingLevel,
    }));

    return formattedData;
  } catch (error) {
    console.error('Error fetching charging data:', error);
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};

const useChargingData = () => {
  return useQuery({
    queryKey: ['chargingData'],
    queryFn: fetchChargingData,
    staleTime: 1000 * 60, // 1 minute
  });
};

export default useChargingData;
