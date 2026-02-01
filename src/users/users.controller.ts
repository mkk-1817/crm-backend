import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Body } from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger"
import { UsersService } from "./users.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user', description: 'Create a new user account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'StrongPassword123!' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
      },
      required: ['email', 'password', 'firstName', 'lastName'],
    },
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() body: { email: string; password: string; firstName: string; lastName: string }) {
    const { email, password, firstName, lastName } = body;
    const name = `${firstName} ${lastName}`.trim();
    return this.usersService.create({ email, password, name });
  }

  @Get()
  @ApiOperation({ summary: 'List users', description: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID', description: 'Retrieve a specific user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: 'Update user', description: 'Update a user account' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'updated@example.com' },
        firstName: { type: 'string', example: 'Jane' },
        lastName: { type: 'string', example: 'Smith' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() body: { email?: string; firstName?: string; lastName?: string }) {
    const { email, firstName, lastName } = body;
    const name = firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : undefined;
    const updateData: any = {};
    if (email !== undefined) updateData.email = email;
    if (name !== undefined && name !== '') updateData.name = name;
    return this.usersService.update(+id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', description: 'Delete a user account by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
