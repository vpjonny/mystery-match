export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  location: { lat: number; lng: number };
  preferences: {
    ageMin: number;
    ageMax: number;
    maxDistance: number; // km
    gender: 'male' | 'female' | 'all';
  };
  gender: 'male' | 'female' | 'other';
  createdAt: string;
}

export interface MysteryMatch {
  id: string;
  matchedUserId: string;
  matchedUser: UserProfile;
  revealLevel: 0 | 1 | 2 | 3; // 0=blurred, 1=semi-blur, 2=clear photo, 3=full profile
  interactions: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'mutual';
  expiresAt: string;
  createdAt: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  Chat: { matchId: string; userName: string };
  ProfileSetup: undefined;
};

export type MainTabParamList = {
  Match: undefined;
  Matches: undefined;
  Profile: undefined;
};
