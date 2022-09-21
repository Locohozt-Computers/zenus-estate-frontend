import appRequest, { GetSearchBlockOrName } from "api";

export const searchTenantsEmail = async (
  params: typeof GetSearchBlockOrName.Params
) => {
  const res = await appRequest.get<typeof GetSearchBlockOrName.Res>(
    GetSearchBlockOrName.Route.replace(
      ":search_block_name",
      (params?.search_block_name as string) || ""
    )
  );
  return res.data.data;
};
searchTenantsEmail.key = "searchTenantsEmail";
