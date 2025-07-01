import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import {
  FetchParentStatesResponse,
  FetchStatesResponse,
} from "@/types/API-types";

export interface StateType {
  stateName: string;
  stateValue: string;
  subHeading: string;
  metaTitle: string;
  metaDescription: string;
  stateImage: File | string;
}

// fetch all States
export const fetchAllStates = async (
  countryId: string,
  isParent: boolean = false,
  parentStateId?: string
): Promise<FetchStatesResponse> => {
  try {
    let needParentStateApi = !!parentStateId ? false : isParent ? true : false;

    const params = new URLSearchParams({
      countryId,
      ...(parentStateId && { parentStateId }),
    });

    const data = await API.get<FetchStatesResponse>({
      slug: `${
        needParentStateApi ? Slug.GET_ALL_PARENT_STATES : Slug.GET_ALL_STATES
      }?${params}`,
    });

    if (!data) {
      throw new Error("Failed to fetch state data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching States:", error);
    throw error;
  }
};

export const fetchParentStates = async (
  stateId: string
): Promise<FetchParentStatesResponse> => {
  try {
    const data = await API.get<FetchParentStatesResponse>({
      slug: "/states/parent-state-by-stateId?stateId=" + stateId,
    });

    if (!data) {
      throw new Error("Failed to fetch state data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching States:", error);
    throw error;
  }
};
