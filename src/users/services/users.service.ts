import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

/**
 * Service responsible for user-related operations
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find all users in the system
   * @returns Array of all users
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Find a user by their ID
   * @param id - The user ID to search for
   * @returns The found user or throws NotFoundException
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  /**
   * Create a new user
   * @param createUserDto - Data for creating the user
   * @returns The newly created user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  /**
   * Update an existing user
   * @param id - The ID of the user to update
   * @param updateUserDto - Data for updating the user
   * @returns The updated user
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    // Merge the update data with the existing user
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    
    return this.userRepository.save(updatedUser);
  }

  /**
   * Delete a user by their ID
   * @param id - The ID of the user to delete
   * @returns Void
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
