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
  return appRequest.get<typeof GetProfile.Res>(GetProfile.Route);
};

export const getLandlordsProfile = async () => {
  return appRequest.get<typeof GetLandlordProfile.Res>(
    GetLandlordProfile.Route
  );
};

export const getAllEmergency = async () => {
  return appRequest.get<typeof GetAllEmergencies.Res>(GetAllEmergencies.Route);
};
