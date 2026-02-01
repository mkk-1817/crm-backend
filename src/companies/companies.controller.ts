import { Controller, Get, Post, Patch, Param, Delete, Query, UseGuards, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from "@nestjs/swagger"
import  { CompaniesService } from "./companies.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { CreateCompanyDto } from "./dto/create-company.dto"
import { UpdateCompanyDto } from "./dto/update-company.dto"

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  
  @Post()
  @ApiOperation({ summary: 'Create company', description: 'Create a new company' })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() body: CreateCompanyDto) {
    return this.companiesService.create(body)
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies', description: 'Get paginated list of companies' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Items per page' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'created_at', description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'DESC', description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy: string = 'created_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    // Convert sortOrder to lowercase for service compatibility
    const sortOrderLower = sortOrder.toLowerCase() as 'asc' | 'desc';
    return this.companiesService.findAll(+page, +limit, sortBy, sortOrderLower);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID', description: 'Get a specific company by ID' })
  @ApiParam({ name: 'id', example: 1, description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'Company retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: 'Update company', description: 'Update an existing company' })
  @ApiParam({ name: 'id', example: 1, description: 'Company ID' })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() body: UpdateCompanyDto,
  ) {
    return this.companiesService.update(+id, body)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete company', description: 'Delete a company by ID' })
  @ApiParam({ name: 'id', example: 1, description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'Company deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }
}
