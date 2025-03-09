export interface ChargingState {
    date: string;
    chargingLevel: number;
    internalEventId?: number;
}
  
export interface ChargingStateAPIResponse {
    chargingStates?: ChargingState[];
}