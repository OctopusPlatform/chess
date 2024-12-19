import GuidConverter from './GuidConverter';

export enum CategoryEnum {
  All = 0,
  U20,
  U18,
  U16,
  U14,
  U12,
  U10,
  U08,
}

export enum TypeEnum {
  Classical = 0,
  Rapid,
  Blitz,
}

export enum GenderEnum {
  Open = 0,
  Women,
}

export interface PlayerDto {
  id: string | null;
  name: string | null;
  fideName: string | null;
  fed: string | null;
  yob: number | null;
  gender: GenderEnum | null;
  results: PlayerResultDto[];
}

export interface PlayerResultDto {
  rank: number;
  year: number;
  category: CategoryEnum;
  type: TypeEnum;
  gender: GenderEnum;
}

class ChessDataService {
  static async fetchPlayer(id: string): Promise<PlayerDto> {
    const response = await fetch(`/players/${id}.json`);
    if (!response.ok) throw new Error('Failed to fetch player data');
    return await response.json();
  }

  static async fetchPlayers(year: Number, category: string, type: string, gender: string) {
    try {
      let dataKey = GuidConverter.convertToGuid(`${year}_${category}_${type}_${gender}`);
      const response = await fetch(`/results/${dataKey}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch results for ${year} ${category} ${type} ${gender}`);
      }
      const results = await response.json();
      return results;
    } catch (error) {
      console.error("Error fetching results:", error);
      return [];
    }
  }
}

export default ChessDataService;