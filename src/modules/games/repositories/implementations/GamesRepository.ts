import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder()
      .andWhere('LOWER(title) LIKE :title', { title: `%${param.toLowerCase()}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query('SELECT COUNT(*) FROM games'); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return await this.repository
      .createQueryBuilder('games')
      .leftJoin('games.users', 'users')
      .select([
        'first_name',
        'last_name',
        'email'
      ])
      .where('games.id = :id', { id: id })
      .getRawMany();
  }
}
