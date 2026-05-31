import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpenseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    amount: number;
    description?: string;
    date?: Date;
    categoryId: string;
    userId: string;
  }) {
    return this.prisma.expense.create({
      data: {
        amount: data.amount,
        description: data.description,
        date: data.date ?? new Date(),
        categoryId: data.categoryId,
        userId: data.userId,
      },
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true },
        },
      },
    });
  }

  async findByUserId(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.prisma.expense.findMany({
      where: { userId },
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true },
        },
      },
      orderBy: { date: 'desc' },
      skip,
      take: limit,
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.expense.count({ where: { userId } });
  }

  async findById(id: string) {
    return this.prisma.expense.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      amount?: number;
      description?: string;
      date?: Date;
      categoryId?: string;
    },
  ) {
    return this.prisma.expense.update({
      where: { id },
      data,
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.expense.delete({ where: { id } });
  }

  async getMonthTotal(userId: string): Promise<number> {
    const startOfMonth = this.startOfMonthUTC();

    const result = await this.prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        date: { gte: startOfMonth },
      },
    });

    return Number(result._sum.amount ?? 0);
  }

  async getTodayTotal(userId: string): Promise<number> {
    const startOfDay = this.startOfDayUTC();

    const result = await this.prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        date: { gte: startOfDay },
      },
    });

    return Number(result._sum.amount ?? 0);
  }

  async getTopCategory(userId: string): Promise<{
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
    total: number;
  } | null> {
    const startOfMonth = this.startOfMonthUTC();

    const result = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        date: { gte: startOfMonth },
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 1,
    });

    if (!result.length || !result[0]._sum.amount) {
      return null;
    }

    const category = await this.prisma.category.findUnique({
      where: { id: result[0].categoryId },
      select: { id: true, name: true, color: true, icon: true },
    });

    if (!category) return null;

    return {
      ...category,
      total: Number(result[0]._sum.amount),
    };
  }

  private startOfDayUTC(): Date {
    const now = new Date();
    return new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
    );
  }

  private startOfMonthUTC(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  }
}
