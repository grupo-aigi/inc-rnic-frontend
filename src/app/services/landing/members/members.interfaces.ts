export interface GlobalMembersDistribution {
  national: { name: string; institutions: string[]; count: number }[];
  international: {
    name: string;
    institutions: string[];
    count: number;
  }[];
}

export interface MembersDistribution {
  id?: number;
  type: 'NATIONAL' | 'INTERNATIONAL';
  content: Content;
}

export interface NewMemberDistribution {
  type: 'NATIONAL' | 'INTERNATIONAL';
  name: string;
  institution: {
    name: string;
    count: number;
  };
}

export interface Content {
  name: string;
  institutions: Institution[];
}

export interface Institution {
  name: string;
  count: number;
}
