export type User = {
  _id: string;
  name: string;
  loggedIn?: boolean;

  wishes: Wish[];
  groups: Group[];
};

export type Group = {
  _id: string;
  name: string;
  createdBy: string;

  members: User[];
};

export type Wish = {
  _id: string;
  content: string;
  groups: string[];
  reserved: boolean;
  createdBy: string;

  comments: Comment[];
};

export type Comment = {
  _id: string;
  content: string;
  reserved: boolean;
  createdBy: string;
  createdAt: string;
};
