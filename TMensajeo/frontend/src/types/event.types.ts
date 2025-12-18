export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  image?: string;
  businessId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  business?: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  image?: string;
  businessId: string;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  isActive?: boolean;
}

export interface EventFilters {
  businessId?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
}
