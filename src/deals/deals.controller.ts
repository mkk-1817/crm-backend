import { Controller, Get, Post, Patch, Param, Delete, Query, UseGuards, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from "@nestjs/swagger"
import  { DealsService } from "./deals.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { CreateDealDto } from "./dto/create-deal.dto"
import { UpdateDealDto } from "./dto/update-deal.dto"

@ApiTags('Deals')
@ApiBearerAuth()
@Controller("deals")
@UseGuards(JwtAuthGuard)
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @ApiOperation({ summary: 'Create deal', description: 'Create a new deal' })
  @ApiBody({ type: CreateDealDto })
  @ApiResponse({ status: 201, description: 'Deal created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() body: CreateDealDto) {
    return await this.dealsService.create(body)
  }

  @Get()
  @ApiOperation({ summary: 'Get all deals', description: 'Get paginated list of deals' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Items per page' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'created_at', description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'DESC', description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Deals retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy: string = 'created_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    // Convert sortOrder to lowercase for service compatibility
    const sortOrderLower = sortOrder.toLowerCase() as 'asc' | 'desc';
    return this.dealsService.findAll(+page, +limit, sortBy, sortOrderLower);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deal by ID', description: 'Get a specific deal by ID' })
  @ApiParam({ name: 'id', example: 1, description: 'Deal ID' })
  @ApiResponse({ status: 200, description: 'Deal retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.dealsService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: 'Update deal', description: 'Update an existing deal' })
  @ApiParam({ name: 'id', example: 1, description: 'Deal ID' })
  @ApiBody({ type: UpdateDealDto })
  @ApiResponse({ status: 200, description: 'Deal updated successfully' })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() body: UpdateDealDto,
  ) {
    return this.dealsService.update(+id, body)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete deal', description: 'Delete a deal by ID' })
  @ApiParam({ name: 'id', example: 1, description: 'Deal ID' })
  @ApiResponse({ status: 200, description: 'Deal deleted successfully' })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.dealsService.remove(+id);
  }
}
