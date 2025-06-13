// types/cab.types.ts
export interface CabDriver {
    id: string;
    name: string;
    rating: number;
    plateNumber: string;
    vehicleModel: string;
    estimatedTime: number;
  }
  
  export interface CabLocation {
    id: string;
    x: number;
    y: number;
  }
  
  export type CabBookingState = 'looking' | 'searching' | 'found';
  