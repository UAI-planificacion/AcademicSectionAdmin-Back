import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
    MinLength,
} from 'class-validator';

export enum BuildingDto {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    Z = 'Z',
}

export enum RoomTypeDto {
    ROOM = 'ROOM',
    AUDITORIO = 'AUDITORIO',
    COMMUNIC = 'COMMUNIC',
    LAB = 'LAB',
    LABPC = 'LABPC',
    DIS = 'DIS',
    GARAGE = 'GARAGE',
    CORE = 'CORE',
}

export enum SizeValueDto {
    XS = 'XS',
    S = 'S',
    MS = 'MS',
    M = 'M',
    L = 'L',
    XL = 'XL',
}

export class CreateSpaceDto {
    @ApiProperty({
        description: 'The unique identifier for the space/room.',
        example: 'A101',
        minLength: 2,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    id: string;

    @ApiProperty({
        description: 'The building where the space is located.',
        enum: BuildingDto,
        example: BuildingDto.A,
    })
    @IsNotEmpty()
    @IsEnum(BuildingDto)
    building: BuildingDto;

    @ApiProperty({
        description: 'The capacity of the space (number of people).',
        example: 30,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    capacity: number;

    @ApiProperty({
        description: 'The type of the space.',
        enum: RoomTypeDto,
        example: RoomTypeDto.ROOM,
    })
    @IsNotEmpty()
    @IsEnum(RoomTypeDto)
    type: RoomTypeDto;

    @ApiProperty({
        description: 'The size identifier for the space, relating to its characteristics (e.g., XS, S, M).',
        enum: SizeValueDto,
        example: SizeValueDto.M,
    })
    @IsNotEmpty()
    @IsEnum(SizeValueDto)
    sizeId: SizeValueDto;
}

