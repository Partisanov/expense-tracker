export class GetExpenseByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
