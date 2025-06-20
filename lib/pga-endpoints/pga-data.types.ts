export type Tournament = {
  beautyImage: string;
  id: string;
  tournamentName: string;
  tournamentLogo: string;
  tournamentLocation: string;
  tournamentStatus: string;
  displayDate: string;
  courses: {
    id: string;
    courseName: string;
  }[];
};

export type Field = {
  players: Player[];
};

export type Leaderboard = {
  id: string;
  players: {
    leaderboardSortOrder: number;
    player: Player;
    scoringData: {
      teeTime: string | null;
      total: string;
      thru: string;
      score: string;
      position: string;
    };
  }[];
};

type Player = {
  id: string;
  firstName: string;
  lastName: string;
};
