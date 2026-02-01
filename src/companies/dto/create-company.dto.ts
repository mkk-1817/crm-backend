import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Company name',
    example: 'Acme Corporation',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Company industry',
    example: 'Technology',
    required: false,
  })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({
    description: 'Company website URL',
    example: 'https://www.acme.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({
    description: 'Company phone number',
    example: '+1 (555) 123-4567',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Company email address',
    example: 'contact@acme.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Company address',
    example: '123 Business St, San Francisco, CA 94105',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Company description',
    example: 'Leading provider of enterprise software solutions',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
