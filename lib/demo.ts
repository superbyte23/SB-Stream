import type { Media, Season, Title } from "./types";

interface DemoSeed {
  id: number;
  title: string;
  year: string;
  rating: number;
  hue: number;
  overview: string;
  /** TMDB poster path (optional; null falls back to gradient artwork). */
  posterPath?: string | null;
}

const movieSeeds: DemoSeed[] = [
  {
    id: 693134,
    title: "Dune: Part Two",
    year: "2024",
    rating: 8.2,
    hue: 28,
    overview:
      "Paul Atreides unites with the Fremen to wage war against the conspirators who destroyed his family. As he wrestles with prophecy and power, he must choose between the love of his life and the fate of the universe.",
    posterPath: "/oWmJawFYADRki7kL0zd1U7RuaS.jpg",
  },
  {
    id: 872585,
    title: "Oppenheimer",
    year: "2023",
    rating: 8.1,
    hue: 40,
    overview:
      "The story of J. Robert Oppenheimer, the physicist who led the Manhattan Project and helped usher the world into the atomic age — and then spent the rest of his life reckoning with it.",
    posterPath: "/fJxHuGzQ5W9mYdC4I5P3u8K3sy.jpg",
  },
  {
    id: 157336,
    title: "Interstellar",
    year: "2014",
    rating: 8.4,
    hue: 210,
    overview:
      "With Earth's crops failing, a former pilot leads a crew through a wormhole in search of a new home for humanity. Every hour on the other side costs years back on Earth.",
    posterPath: "/nBNZadXjKsn6GED7uA6VzsQfFm.jpg",
  },
  {
    id: 27205,
    title: "Inception",
    year: "2010",
    rating: 8.4,
    hue: 190,
    overview:
      "A specialist in corporate espionage enters dreams to steal secrets. His final job asks for the impossible: plant an idea in a target's mind without leaving a trace.",
    posterPath: "/ZO2uUBRn5C5uxd0r2Dyx.jpg",
  },
  {
    id: 155,
    title: "The Dark Knight",
    year: "2008",
    rating: 8.5,
    hue: 220,
    overview:
      "Batman faces the Joker, a criminal mastermind determined to prove that even the most principled man can be dragged down to his level. Gotham may never recover.",
    posterPath: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    id: 496243,
    title: "Parasite",
    year: "2019",
    rating: 8.5,
    hue: 95,
    overview:
      "A struggling family gradually infiltrates the household of a wealthy Seoul couple. Their arrangement works perfectly — until a hidden part of the house is discovered.",
    posterPath: "/7IiCPDWPfVwfYgGvXSSUBMA4ZQ.jpg",
  },
  {
    id: 545611,
    title: "Everything Everywhere All at Once",
    year: "2022",
    rating: 7.8,
    hue: 300,
    overview:
      "An exhausted laundromat owner discovers she can access the memories and skills of her alternate selves. To save every version of reality, she has to embrace the mess of being alive.",
    posterPath: "/8gjxpeRMJJhH1Z4c5y7GZGQ58I.jpg",
  },
  {
    id: 569094,
    title: "Spider-Man: Across the Spider-Verse",
    year: "2023",
    rating: 8.4,
    hue: 265,
    overview:
      "Miles Morales is pulled into a multiverse-spanning confrontation over what a hero is allowed to sacrifice. The more spider-people he meets, the less certain the rules become.",
    posterPath: "/kt3Gj3e2CDhmmq3IapxQ1zkv5R.jpg",
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    year: "1994",
    rating: 8.7,
    hue: 35,
    overview:
      "Wrongly convicted and sentenced to life, a quiet banker builds a friendship that carries him through decades inside Shawshank — and quietly plans a way out.",
    posterPath: "/6hB8JUEUkqC1cVhPH9q0U14o6I.jpg",
  },
  {
    id: 603,
    title: "The Matrix",
    year: "1999",
    rating: 8.2,
    hue: 130,
    overview:
      "A hacker learns that the world he knows is a simulation built to keep humanity docile. Offered a choice between comfort and truth, he takes the red pill.",
    posterPath: "/f89UO6r6QowT57IsodwJ4oBf8Q.jpg",
  },
  {
    id: 680,
    title: "Pulp Fiction",
    year: "1994",
    rating: 8.5,
    hue: 350,
    overview:
      "Hitmen, a boxer, a gangster's wife and a pair of diner robbers collide in a tangle of Los Angeles crime stories told out of order and full of strange grace.",
    posterPath: "/ii85Qpx20Sqhau8X113j3PsPS.jpg",
  },
  {
    id: 76600,
    title: "Avatar: The Way of Water",
    year: "2022",
    rating: 7.6,
    hue: 185,
    overview:
      "Jake Sully and his family leave the forest for a new home among the reef clans of Pandora. When an old enemy returns, they must learn a different way to fight.",
    posterPath: "/9P5QLJ5dxPqA1iu9Ym0u8N2ELE9.jpg",
  },
  {
    id: 361743,
    title: "Top Gun: Maverick",
    year: "2022",
    rating: 8.2,
    hue: 205,
    overview:
      "After decades in the cockpit, Maverick returns to train a detachment of graduates for a mission with almost no margin for error. Some lessons can only be flown.",
    posterPath: "/t9FKQRST2sBfF53XTMIj33i6D.jpg",
  },
  {
    id: 346698,
    title: "Barbie",
    year: "2023",
    rating: 7.0,
    hue: 330,
    overview:
      "Barbie's perfect life in Barbieland is interrupted by thoughts of mortality. Her search for answers takes her into the human world — and into a fight over what she is for.",
    posterPath: "/f3Dc7S2sRG3CVF47Ht9MINdPpX.jpg",
  },
];

const tvSeeds: DemoSeed[] = [
  {
    id: 1396,
    title: "Breaking Bad",
    year: "2008",
    rating: 8.9,
    hue: 100,
    overview:
      "A high school chemistry teacher diagnosed with cancer turns to manufacturing meth to secure his family's future. The business changes him more than the diagnosis does.",
  },
  {
    id: 1399,
    title: "Game of Thrones",
    year: "2011",
    rating: 8.4,
    hue: 210,
    overview:
      "Noble families vie for a continent's throne while an ancient threat stirs beyond the Wall. Every alliance has a price, and winter is coming.",
  },
  {
    id: 66732,
    title: "Stranger Things",
    year: "2016",
    rating: 8.6,
    hue: 350,
    overview:
      "When a boy vanishes in a small Indiana town, his friends uncover a secret government experiment and a door to somewhere else. Growing up was already hard enough.",
  },
  {
    id: 100088,
    title: "The Last of Us",
    year: "2023",
    rating: 8.8,
    hue: 80,
    overview:
      "Twenty years after a fungal outbreak collapses society, a hardened smuggler is hired to move a teenage girl across the country. She may be the key to everything.",
  },
  {
    id: 95396,
    title: "Severance",
    year: "2022",
    rating: 8.4,
    hue: 195,
    overview:
      "Employees at Lumon undergo a procedure that separates their work memories from their personal lives. Then the boundary starts to leak.",
  },
  {
    id: 126308,
    title: "Shogun",
    year: "2024",
    rating: 8.7,
    hue: 30,
    overview:
      "An English navigator arrives in feudal Japan and is drawn into a struggle between rival lords. Survival depends on learning a language no one is willing to teach him.",
  },
  {
    id: 76331,
    title: "Succession",
    year: "2018",
    rating: 8.3,
    hue: 45,
    overview:
      "The aging patriarch of a global media empire refuses to name an heir. His children circle the throne while the family slowly turns on itself.",
  },
  {
    id: 136315,
    title: "The Bear",
    year: "2022",
    rating: 8.4,
    hue: 15,
    overview:
      "A young chef returns home to run his late brother's chaotic sandwich shop. The kitchen becomes a place to rebuild — if it doesn't break everyone first.",
  },
  {
    id: 94605,
    title: "Arcane",
    year: "2021",
    rating: 8.7,
    hue: 270,
    overview:
      "Two sisters end up on opposite sides of a conflict between a gleaming city and its forgotten underbelly. Magic, politics and family collide in a hand-painted world.",
  },
  {
    id: 60059,
    title: "Better Call Saul",
    year: "2015",
    rating: 8.6,
    hue: 50,
    overview:
      "The transformation of Jimmy McGill, a small-time lawyer with a gift for trouble, into the man who will one day become Saul Goodman.",
  },
  {
    id: 87108,
    title: "Chernobyl",
    year: "2019",
    rating: 8.6,
    hue: 120,
    overview:
      "The 1986 nuclear disaster, told through the people who lived through it and the investigators who tried to understand what happened — and who was responsible.",
  },
  {
    id: 94997,
    title: "House of the Dragon",
    year: "2022",
    rating: 8.2,
    hue: 350,
    overview:
      "Two centuries before Game of Thrones, the Targaryen dynasty is at the height of its power. A succession dispute puts dragon against dragon.",
  },
  {
    id: 76479,
    title: "The Boys",
    year: "2019",
    rating: 8.4,
    hue: 0,
    overview:
      "In a world where superheroes are corporate products, a team of ordinary people sets out to expose the corruption behind the capes.",
  },
  {
    id: 46648,
    title: "True Detective",
    year: "2014",
    rating: 8.3,
    hue: 180,
    overview:
      "Two detectives revisit a case that spanned seventeen years, uncovering a conspiracy that reaches far beyond the bayou.",
  },
];

function seedToMedia(seed: DemoSeed, type: Media["type"]): Media {
  return {
    id: seed.id,
    type,
    title: seed.title,
    overview: seed.overview,
    year: seed.year,
    rating: seed.rating,
    posterPath: seed.posterPath ?? null,
    backdropPath: null,
    hue: seed.hue,
  };
}

export const demoMovies: Media[] = movieSeeds.map((seed) =>
  seedToMedia(seed, "movie"),
);

export const demoTv: Media[] = tvSeeds.map((seed) => seedToMedia(seed, "tv"));

export const demoAll: Media[] = [...demoMovies, ...demoTv];

export const demoTrending: Media[] = [
  demoMovies[0],
  demoTv[0],
  demoMovies[1],
  demoTv[1],
  demoMovies[2],
  demoTv[2],
  demoMovies[3],
  demoTv[3],
  demoMovies[4],
  demoTv[4],
  demoMovies[5],
  demoTv[5],
];

export function findDemoTitle(type: Media["type"], id: number): Media | null {
  return (type === "movie" ? demoMovies : demoTv).find((item) => item.id === id) ?? null;
}

export function demoSearch(query: string): Media[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return demoAll.filter(
    (item) =>
      item.title.toLowerCase().includes(needle) ||
      item.overview.toLowerCase().includes(needle),
  );
}

const demoTvSeasonCounts: Record<number, number> = {
  1396: 5,
  1399: 8,
  66732: 5,
  100088: 2,
  95396: 2,
  126308: 1,
  76331: 4,
  136315: 4,
  94605: 2,
  60059: 6,
  87108: 1,
  94997: 2,
  76479: 4,
  46648: 4,
};

const DEMO_EPISODES_PER_SEASON = 8;

function demoSeasonCount(id: number): number {
  return demoTvSeasonCounts[id] ?? 1;
}

export function demoTitleDetails(media: Media): Title {
  const seasons = media.type === "tv" ? demoSeasonCount(media.id) : null;
  return {
    ...media,
    tagline: "",
    votes: Math.round(media.rating * 4200),
    genres: [],
    runtime: media.type === "movie" ? 128 : null,
    seasons,
    episodes: seasons ? seasons * DEMO_EPISODES_PER_SEASON : null,
    status: "Released",
    cast: [],
    trailerKey: null,
    recommendations: (media.type === "movie" ? demoMovies : demoTv)
      .filter((item) => item.id !== media.id)
      .slice(0, 12),
  };
}

export function demoSeason(media: Media, seasonNumber: number): Season | null {
  if (seasonNumber < 1 || seasonNumber > demoSeasonCount(media.id)) return null;

  return {
    seasonNumber,
    name: `Season ${seasonNumber}`,
    overview: media.overview,
    episodes: Array.from({ length: DEMO_EPISODES_PER_SEASON }, (_, index) => ({
      seasonNumber,
      episodeNumber: index + 1,
      name: `Episode ${index + 1}`,
      overview:
        "Episode details become available when a TMDB API key is configured for this deployment.",
      stillPath: null,
      airDate: "",
      runtime: 48,
    })),
  };
}
