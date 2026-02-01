import { Controller, Get, Post, Patch, Param, Delete, Query, UseGuards,Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from "@nestjs/swagger"
import { ContactsService } from "./contacts.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { CreateContactDto } from "./dto/create-contact.dto"
import { UpdateContactDto } from "./dto/update-contact.dto"

@ApiTags('Contacts')
@ApiBearerAuth()
@Controller("contacts")
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create contact', description: 'Create a new contact' })
  @ApiBody({ type: CreateContactDto })
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() body: CreateContactDto) {
    const { firstName, lastName, ...rest } = body;
    const name = `${firstName} ${lastName}`.trim();
    return this.contactsService.create({ name, ...rest });
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts', description: 'Get paginated list of contacts' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Items per page' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'created_at', description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'DESC', description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Contacts retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy: string = 'created_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    // Convert sortOrder to lowercase for service compatibility
    const sortOrderLower = sortOrder.toLowerCase() as 'asc' | 'desc';
    return this.contactsService.findAll(+page, +limit, sortBy, sortOrderLower);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID', description: 'Get a specific contact by ID' })
  @ApiParam({ name: 'id', example: 1, description: 'Contact ID' })
  @ApiResponse({ status: 200, description: 'Contact retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: 'Update contact', description: 'Update an existing contact' })
  @ApiParam({ name: 'id', example: 1, description: 'Contact ID' })
  @ApiBody({ type: UpdateContactDto })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() body: UpdateContactDto,
  ) {
    const { firstName, lastName, ...rest } = body;
    const name = firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : undefined;
    const updateData: any = { ...rest };
    if (name !== undefined && name !== '') updateData.name = name;
    return this.contactsService.update(+id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact', description: 'Delete a contact by ID' })
  @ApiParam({ name: 'id', example: 1, description: 'Contact ID' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }
}
