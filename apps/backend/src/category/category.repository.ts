import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    color?: string;
    icon?: string;
    userId: string;
  }): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async findByUserId(userId: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: { name?: string; color?: string; icon?: string },
  ): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }
}
