export type User = {
  name: string;
  wishes: Wish[];
  groups: Group[];
};

export type Group = {
  name: string;
  members: User;
};

export type Wish = {
  name: string;
  description: string;
  url: string;
  groups: Group[];
  comments: Comment;
  reserved: boolean;
};

export type Comment = {
  content: string;
  reserved: boolean;
  user: User;
};
