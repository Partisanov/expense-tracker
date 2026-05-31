export class CreateCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly color: string | undefined,
    public readonly icon: string | undefined,
    public readonly userId: string,
  ) {}
}
