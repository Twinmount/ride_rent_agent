import { load, StorageKeys } from "@/utils/storage";

export default function useUserId() {
  let userId = load<string>(StorageKeys.USER_ID);
  return userId;
}
