export type Data = {
  me: User;
  users: User[];
};

export type User = {
  _id: string;
  name: string;
  loggedIn?: boolean;
  createdBy: string;
  code?: string;
  language: string;

  wishes: Wish[];
  groups: Group[];
};

export type Group = {
  _id: string;
  name: string;
  createdBy: string;

  members: (User & { lastActivity?: Wish | Comment })[];
  assignment: Record<string, string>;
};

export type Wish = {
  _id: string;
  content: string;
  groups: string[];
  reservedBy: string;
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
