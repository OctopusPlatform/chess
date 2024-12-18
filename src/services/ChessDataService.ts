import GuidConverter from './GuidConverter';

class ChessDataService {
  static async fetchPlayers(year: Number, category: string, type: string, gender: string) {
    try {
      let dataKey = GuidConverter.convertToGuid(`${year}_${category}_${type}_${gender}`);
      const response = await fetch(`/chess/results/${dataKey}.json`);
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
