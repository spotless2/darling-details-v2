import api from "./api";

interface ProductQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  categoryId?: string | number;
}

const getProducts = async (params: ProductQueryParams = {}) => {
  const queryParams = new URLSearchParams();

  // Add pagination parameters
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());

  // Add other filter parameters if they exist
  if (params.name) queryParams.append("name", params.name);
  if (params.minPrice) queryParams.append("minPrice", params.minPrice.toString());
  if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice.toString());
  if (params.inStock !== undefined) queryParams.append("inStock", params.inStock.toString());
  if (params.categoryId) queryParams.append("categoryId", params.categoryId.toString());

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  return api.get(`/products${queryString}`);
};

const deleteProduct = async (id: string | number) => {
  return api.delete(`/products/${id}`);
};

export const productService = {
  getProducts,
  deleteProduct,
};