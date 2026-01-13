// apiClientService.ts
interface RequestOptions {
  method: string;
  credentials: 'include';
  redirect: 'manual';
  headers: Record<string, string>;
  body?: any;
}

const sendRequest = async (
  method: string,
  endpoint: string,
  data: any = null,
  contentType: string | null = null
): Promise<Response> => {
  const defaultContentType = 'application/json; charset=UTF-8';

  const requestOptions: RequestOptions = {
    method: method.toUpperCase(),
    credentials: 'include', // gửi cookie/session
    redirect: 'manual',     // tránh auto redirect
    headers: {
      'Content-Type': contentType ?? defaultContentType,
    },
  };

  // Nếu có data
  if (data) {
    if (data instanceof FormData) {
      delete requestOptions.headers['Content-Type']; // browser tự set
      requestOptions.body = data;
    } else if (typeof data === 'object') {
      requestOptions.body = JSON.stringify(data);
    } else {
      requestOptions.body = data;
    }
  }

  try {
    const response = await fetch(endpoint, requestOptions);

    // Workaround: tự redirect nếu CORS
    if (response.type === 'cors' && response.redirected) {
      window.location.href = response.url;
    }

    return response;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Wrapper cho dễ xài
const apiClientService = {
  get: (endpoint: string) => sendRequest('GET', endpoint),
  post: (endpoint: string, data: any = null, contentType: string | null = null) =>
    sendRequest('POST', endpoint, data, contentType),
  put: (endpoint: string, data: any = null, contentType: string | null = null) =>
    sendRequest('PUT', endpoint, data, contentType),
  delete: (endpoint: string) => sendRequest('DELETE', endpoint),
};

export default apiClientService;
