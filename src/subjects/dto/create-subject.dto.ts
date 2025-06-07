import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
}               from 'class-validator';
import { Type } from 'class-transformer';


export class CreateSubjectDto {

    @ApiProperty({
        description: 'The unique identifier for the subject (e.g., course code).',
        example: 'INF101',
        minLength: 3,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    id: string;

    @ApiProperty({
        description: 'The name of the subject.',
        example: 'Introduction to Computer Science',
        minLength: 5,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    name: string;

    @ApiProperty({
        description: 'The start date of the subject.',
        example: '2024-08-01T00:00:00.000Z',
        type: Date,
    })
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    startDate: Date;

    @ApiPropertyOptional({
        description: 'The optional end date of the subject.',
        example: '2024-12-15T23:59:59.000Z',
        type: Date,
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;

}
