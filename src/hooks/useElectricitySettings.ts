import { useAppSelector } from "store";
import { settingsSelectors } from "store/reducers/settings/settingsSlice";

export const useElectricitySettings = () => {
  const electricity = useAppSelector(settingsSelectors.electricity);
  const isLoading = useAppSelector(settingsSelectors.isLoading);
  const error = useAppSelector(settingsSelectors.error);

  return {
    electricity,
    isLoading,
    error,
    quotaEnabled: electricity?.electricity_quota_enabled ?? false,
    quotaType: electricity?.electricity_quota_type ?? "money",
    quotaAmount: electricity?.electricity_quota_amount ?? "0",
    quotaDays: electricity?.electricity_quota_days ?? 0,
    tariffRate: electricity?.electricity_tariff_rate ?? "0",
  };
};
