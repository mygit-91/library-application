export interface Categories {
  categoryId: string;
  categoryName: string;
}

export interface GetCategoriesListRequest {
  searchTopic: string;
  searchText: string;
}

export interface GetCategoriesListResponse {
  status: number;
  message: string;
  data: Categories[];
}

export interface AddCategoriesRequest {
  categoryName: string;
}

export interface AddCategoriesResponse {
  status: number;
  message: string;
  data: Categories[];
}

export interface UpdateCategoriesRequest {
  categoryId: string;
  categoryName: string;
}

export interface UpdateCategoriesResponse {
  status: number;
  message: string;
  data: {};
}

export interface DeleteCategoriesResponse {
  status: number;
  message: string;
  data: {};
}
