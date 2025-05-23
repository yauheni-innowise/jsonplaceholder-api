import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

/**
 * Controller for handling user-related HTTP requests
 */
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users
   * @returns Array of all users
   */
  @ApiOperation({ summary: 'Get all users', description: 'Retrieves a list of all users in the system' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully', type: [User] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Get a user by ID
   * @param id - The user ID to retrieve
   * @returns The requested user
   */
  @ApiOperation({ summary: 'Get user by ID', description: 'Retrieves a specific user by their ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  /**
   * Create a new user
   * @param createUserDto - Data for creating the user
   * @returns The newly created user
   */
  @ApiOperation({ summary: 'Create new user', description: 'Creates a new user in the system' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Update an existing user
   * @param id - The ID of the user to update
   * @param updateUserDto - Data for updating the user
   * @returns The updated user
   */
  @ApiOperation({ summary: 'Update user', description: 'Updates an existing user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete a user
   * @param id - The ID of the user to delete
   */
  @ApiOperation({ summary: 'Delete user', description: 'Removes a user from the system' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }

  /**
   * Smoke test endpoint for testing
   * @returns Test message
   */
  @ApiOperation({ summary: 'Test endpoint', description: 'Simple test endpoint to verify API is working' })
  @ApiResponse({ status: 200, description: 'API is working', schema: { properties: { message: { type: 'string', example: 'Users API is working!' } } } })
  @Get('admin/test')
  async test(): Promise<{ message: string }> {
    return { message: 'Users API is working!' };
  }
}
