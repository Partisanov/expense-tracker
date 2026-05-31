export class UpdateCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly color: string | undefined,
    public readonly icon: string | undefined,
    public readonly userId: string,
  ) {}
}
