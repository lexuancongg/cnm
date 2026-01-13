import { AuthorVm } from '../models/Brand';
import apiClientService from '@commonServices/ApiClientService';

const baseUrl = 'http://localhost:8000/api/backoffice/authors';

export async function getBrands(): Promise<AuthorVm[]> {
  return (await apiClientService.get(baseUrl)).json();
}

export async function getPageableBrands(pageNo: number, pageSize: number) {
  const url = `${baseUrl}/paging?pageNo=${pageNo}&pageSize=${pageSize}`;
  return (await apiClientService.get(url)).json();
}

export async function createBrand(brand: AuthorVm) {
  return await apiClientService.post(baseUrl, JSON.stringify(brand));
}
export async function getBrand(id: number) {
  const url = `${baseUrl}/${id}`;
  return (await apiClientService.get(url)).json();
}

export async function deleteBrand(id: number) {
  const url = `${baseUrl}/${id}`;
  const response = await apiClientService.delete(url);
  if (response.ok) return response;
  else return await response.json();
}

export async function editBrand(id: number, authorVm: AuthorVm) {
  const url = `${baseUrl}/${id}`;
  const response = await apiClientService.put(url, JSON.stringify(authorVm));
  if(response.ok){
    return response
  }
  throw  response
}
