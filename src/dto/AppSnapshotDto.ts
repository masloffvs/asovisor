import { AppDto } from "@/dto/AppDto";

export interface StoryOfPosition {
  snapAt: string;
  index: number;
}

export interface StatesAsoPage {
  snapAt: string;
  details: AppDto;
}

export interface AppSnapshotDto {
  appId: number;
  term: string;
  country: string;
  lastIndex: string;
  actualIndex: number;
  lastHashOfState: string;

  storyOfPositions: StoryOfPosition[];
  statesAsoPages: StatesAsoPage[];
}
