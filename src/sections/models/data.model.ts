import { $Enums } from "@prisma/client";

export interface RoomData {
    name: string;
    capacity: number;
    building: string;
    sizeValue: $Enums.SizeValue;
    spaceType: $Enums.RoomType;
}


export interface ProfessorData {
    id: string;
    name: string;
}


export interface SubjectData {
    id: string;
    name: string;
    startDate: Date;
}


export interface PeriodData {
    id: string;
    name: string;
}


export interface SectionData {
    id: string;
    code: number;
    session: string;
    size: string;
    talla: string;
    correctedRegistrants: number;
    realRegistrants: number;
    plannedBuilding: string;
    chairsAvailable: number;
    // roomId: string;
    // dayModuleId: number;
    // professorId: string;
}