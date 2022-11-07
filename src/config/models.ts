export type User = {
  _id: string;
  name: string;
  wishes: Wish[];
  groups: Group[];
  loggedIn?: boolean;
};

export type Group = {
  _id: string;
  name: string;
  members: User[];
};

export type Wish = {
  _id: string;
  name: string;
  description: string;
  url: string;
  groups: Group[];
  comments: Comment[];
  reserved: boolean;
};

export type Comment = {
  _id: string;
  content: string;
  reserved: boolean;
  user: User;
};
