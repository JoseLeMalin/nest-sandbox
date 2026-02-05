export class CreateVoteDto {
  readonly user_id!: number;
  readonly vote_type!: "upvote" | "downvote";
  readonly target_id!: number;
  readonly target_type!: string;
}
