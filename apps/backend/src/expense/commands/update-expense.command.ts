export class UpdateExpenseCommand {
  constructor(
    public readonly id: string,
    public readonly amount: number | undefined,
    public readonly description: string | undefined,
    public readonly date: string | undefined,
    public readonly categoryId: string | undefined,
    public readonly userId: string,
  ) {}
}
