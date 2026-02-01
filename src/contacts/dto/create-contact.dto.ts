import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    description: 'Contact first name',
    example: 'Jane',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Contact last name',
    example: 'Smith',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Contact email address',
    example: 'jane.smith@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1 (555) 987-6543',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Contact job position',
    example: 'Sales Manager',
    required: false,
  })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiProperty({
    description: 'Associated company ID',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  companyId?: number;

  @ApiProperty({
    description: 'Additional notes about the contact',
    example: 'Key decision maker for enterprise deals',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
