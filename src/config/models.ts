export type User = {
  _id: string;
  name: string;
  loggedIn?: boolean;
  createdBy: string;
  code?: string;

  wishes: Wish[];
  groups: Group[];
};

export type Group = {
  _id: string;
  name: string;
  createdBy: string;

  members: (User & { lastActivity?: Wish | Comment })[];
};

export type Wish = {
  _id: string;
  content: string;
  groups: string[];
  reserved: boolean;
  user: string;
  createdBy: string;
  createdAt: string;

  comments: Comment[];
};

export type Comment = {
  _id: string;
  content: string;
  reserved: boolean;
  createdBy: string;
  createdAt: string;
};
