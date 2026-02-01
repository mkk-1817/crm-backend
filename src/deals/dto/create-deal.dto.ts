import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDealDto {
  @ApiProperty({
    description: 'Deal title',
    example: 'Enterprise Software License',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Deal description',
    example: '50-seat license for enterprise CRM software',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Deal value in dollars',
    example: 50000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiProperty({
    description: 'Deal stage',
    example: 'negotiation',
    enum: ['lead', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
    default: 'lead',
    required: false,
  })
  @IsString()
  @IsOptional()
  stage?: string;

  @ApiProperty({
    description: 'Associated company ID',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  companyId?: number;

  @ApiProperty({
    description: 'Array of associated contact IDs',
    example: [1, 2],
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  contactIds?: number[];
}
