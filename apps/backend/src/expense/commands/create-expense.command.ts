export class CreateExpenseCommand {
  constructor(
    public readonly amount: number,
    public readonly description: string | undefined,
    public readonly date: string | undefined,
    public readonly categoryId: string,
    public readonly userId: string,
  ) {}
}
