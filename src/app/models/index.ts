// API Response interface
export interface MunicipioApiResponse {
  id: number;
  nomeMunicipio: string;
  siglaEstado: string;
  nomeEstado: string;
}

// City interface for internal use (compatible with existing code)
export interface City {
  id: number;
  name: string;
  state: string;
  // Additional fields from API
  nomeMunicipio?: string;
  siglaEstado?: string;
  nomeEstado?: string;
}

export interface Establishment {
  id: number;
  name: string;
  cityId: number;
  selected?: boolean;
}

export interface Offer {
  id: number;
  productName: string;
  establishmentName: string;
  establishmentId?: number;
  price: number;
  image: string;
  originalPrice?: number;
}

export interface Purchase {
  id: number;
  date: string;
  time: string;
  store: string;
  amount: number;
  category: string;
}

export interface Banner {
  id: number;
  imageUrl: string;
  linkUrl: string;
  title: string;
}
