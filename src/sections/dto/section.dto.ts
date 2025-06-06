import { $Enums } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class SectionDto {
    @ApiProperty({
        description: 'The unique identifier of the section.',
        example: 'clx15746g000008l3f1z9h8y7',
    })
    id: string;
    @ApiProperty({
        description: 'The code of the section.',
        example: 101,
    })
    code: number;
    @ApiProperty({
        description: 'The session of the section.',
        example: 'A1',
        nullable: true,
    })
    session: string | null;
    @ApiProperty({
        description: 'The size of the section.',
        example: 'MEDIUM',
        enum: $Enums.SizeValue,
        nullable: true,
    })
    size: $Enums.SizeValue | null;
    @ApiProperty({
        description: 'The number of corrected registrants for the section.',
        example: 25,
        nullable: true,
    })
    correctedRegistrants: number | null;
    @ApiProperty({
        description: 'The number of real registrants for the section.',
        example: 30,
        nullable: true,
    })
    realRegistrants: number | null;
    @ApiProperty({
        description: 'The planned building for the section.',
        example: 'Main Building',
        nullable: true,
    })
    plannedBuilding: string | null;
    @ApiProperty({
        description: 'The number of chairs available for the section.',
        example: 30,
        nullable: true,
    })
    chairsAvailable: number | null;
    @ApiProperty({
        description: 'The room where the section is held.',
        example: 'Room 101',
    })
    room: string;
    @ApiProperty({
        description: 'The professor teaching the section.',
        example: 'Dr. Smith',
    })
    professor: string;
    @ApiProperty({
        description: 'The ID of the day module for the section.',
        example: 1,
    })
    dayModuleId: number;
    @ApiProperty({
        description: 'The name of the subject for the section.',
        example: 'Introduction to Programming',
    })
    subjectName: string;
    @ApiProperty({
        description: 'The ID of the subject for the section.',
        example: 'CS101',
    })
    subjectId: string;
    @ApiProperty({
        description: 'The name of the period for the section.',
        example: 'Fall 2024',
    })
    periodName: string;
    @ApiProperty({
        description: 'The ID of the period for the section.',
        example: 'PER-001',
    })
    periodId: string;
}
