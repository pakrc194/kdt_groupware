const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const myInfo = JSON.parse(localStorage.getItem("MyInfo"));

// export async function fetcher(
//   url,
//   { method = "GET", headers = {
//       Authorization: `Bearer ${myInfo?.token}`
//   }, body } = {},
// ) {
//   const response = await fetch(`${BASE_URL}${url}`, {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//       ...headers,
//     },
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(errorText || "API Error");
//   }

//   return response.json();
// }
export async function fetcher(
  url,
  { method = "GET", headers = {}, body } = {}
) {
  const isFormData = body instanceof FormData;

  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      // FormData면 Content-Type을 설정하지 않는다 (브라우저가 자동으로 boundary 포함해서 설정)
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body
      ? (isFormData ? body : JSON.stringify(body))
      : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API Error");
  }

  // 업로드 API가 json이 아닐 수도 있으니 안전하게 분기(선택)
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}