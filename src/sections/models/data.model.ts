import { $Enums } from "@prisma/client";

export interface RoomData {
    name: string;
    capacity: number;
    building: string;
    sizeValue: $Enums.SizeValue;
}


export interface ProfessorData {
    id: string;
    name: string;
}


export interface SubjectData {
    name: string;
    code: string;
    startDate: string;
    periodId: string;
}


export interface PeriodData {
    name: string;
}