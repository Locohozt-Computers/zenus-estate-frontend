import appRequest, {
  GetAllEmergencies,
  GetLandlordProfile,
  GetProfile,
} from "api";

// export const getUserProfile = (id: number) => async () => {
//   return appRequest.get<typeof GetProfile.Res>(
//     GetProfile.Route.replace(":id", id.toString())
//   );
// };

// sample
// export const getProduct = async ({ queryKey }) => {
//   const [_, prodId] = queryKey
//   const { data } = await axios.get(`/api/v1/products/${prodId}`)
//   return data
// }

export const getUserProfile = async () => {
  const res = await appRequest.get<typeof GetProfile.Res>(GetProfile.Route);
  return res.data.data;
};

export const getLandlordsProfile = async () => {
  const res = await appRequest.get<typeof GetLandlordProfile.Res>(
    GetLandlordProfile.Route
  );
  return res.data.data;
};

export const getAllEmergency = async () => {
  const res = await appRequest.get<typeof GetAllEmergencies.Res>(
    GetAllEmergencies.Route
  );
  return res.data.data;
};
