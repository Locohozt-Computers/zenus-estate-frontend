import appRequest, {
  GetAllNotifications,
  GetMarkAllNotificationAsRead,
  PostReadNotification,
} from "api";

export const getAllNotifications = async () => {
  const res = await appRequest.get<typeof GetAllNotifications.Res>(
    GetAllNotifications.Route
  );
  return res.data.data;
};
getAllNotifications.key = "getAllNotifications";

export const markNotificationAsRead = async (
  data: typeof PostReadNotification.Body
) => {
  const res = await appRequest.post<typeof PostReadNotification.Res>(
    PostReadNotification.Route,
    data
  );
  return res.data.data;
};
markNotificationAsRead.key = "markNotificationAsRead";

export const markAllNotificationAsRead = async () => {
  const res = await appRequest.get<typeof GetMarkAllNotificationAsRead.Res>(
    GetMarkAllNotificationAsRead.Route
  );
  return res.data;
};
markAllNotificationAsRead.key = "markAllNotificationAsRead";
