import { ApiProperty } from '@nestjs/swagger';

import { IsString, } from 'class-validator';

import { BasicSectionDto } from '@sections/dto/basic-section.dto';


export class CreateSectionDto extends BasicSectionDto {

    @ApiProperty({
        description: 'ID of the period assigned to the section.',
        example: '200221-Periodo 1',
    })
    @IsString({ message: 'Period ID must be a string.' })
    periodId: string;


    @ApiProperty({
        description: 'ID of the subject assigned to the section.',
        example: 'ABC-123',
    })
    @IsString({ message: 'Subject ID must be a string.' })
    subjectId: string;

}
