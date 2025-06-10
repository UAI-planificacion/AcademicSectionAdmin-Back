import { Injectable, BadRequestException, OnModuleInit }  from '@nestjs/common';

import * as xlsx                from 'xlsx';
import { PrismaClient, $Enums } from '@prisma/client';
import { v7 as uuidv7 }         from 'uuid';

import {
    PeriodData,
    ProfessorData,
    RoomData,
    Section,
    SubjectData,
    SubjectSection
}                               from '@sections/models/data.model';
import { CreateSectionDto }     from '@sections/dto/create-section.dto';
import { UpdateSectionDto }     from '@sections/dto/update-section.dto';
import { SizeValue }            from '@sections/enums/capacity-size.enum';
import { SpaceType }            from '@sections/enums/space-type.enum';
import { Building }             from '@sections/enums/building.enum';
import { SizeEnum }             from '@sections/enums/size.enum';
import { SectionDto }           from '@sections/dto/section.dto';


@Injectable()
export class SectionsService extends PrismaClient implements OnModuleInit {

    onModuleInit() {
		this.$connect();
	}


    async create( createSectionDto: CreateSectionDto ) {
        try {
            const section = await this.section.create({
                data: {
                    id: uuidv7(),
                    ...createSectionDto,
                },
            });

            return section;
        } catch ( error ) {
            console.error( 'Error creating section:', error );
            throw error;
        }
    }


    async #getSectionData(): Promise<SectionDto[]> {
        const sections = await this.section.findMany({
            where : {
                dayModule: {
                    module: {
                        isActive: true,
                    },
                }
            },
            select: {
                id: true,
                code: true,
                session: true,
                size: true,
                correctedRegistrants: true,
                realRegistrants: true,
                plannedBuilding: true,
                chairsAvailable: true,
                room: {
                    select : {
                        id: true
                    }
                },
                dayModule: {
                    select : {
                        dayCode: true,
                        moduleId: true,
                    }
                },
                professor: {
                    select : {
                        name: true,
                    }
                },
                subjectSections: {
                    select: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                        period: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            }
        });

        return sections.map( section => ({
            id                      : section.id,
            code                    : section.code,
            session                 : section.session,
            size                    : section.size,
            correctedRegistrants    : section.correctedRegistrants,
            realRegistrants         : section.realRegistrants,
            plannedBuilding         : section.plannedBuilding,
            chairsAvailable         : section.chairsAvailable,
            room                    : section.room.id,
            professor               : section.professor?.name ?? 'Sin profesor',
            day                     : Number( section.dayModule.dayCode ),
            moduleId                : section.dayModule.moduleId.toString(),
            subjectName             : section.subjectSections[0].subject.name,
            subjectId               : section.subjectSections[0].subject.id,
            period                  : `${section.subjectSections[0].period.id}-${section.subjectSections[0].period.name}`,
        }));
    }


    async findAll() {
        return await this.#getSectionData();
    }

    async findOne( id: string ) {
        try {
            const section = await this.section.findUnique({
                where: { id },
            });

            return section;
        } catch ( error ) {
            console.error( 'Error finding section:', error );
            throw error;
        }
    }

    async update( id: string, updateSectionDto: UpdateSectionDto ) {
        try {
            const section = await this.section.update({
                where: { id },
                data: updateSectionDto,
            });

            return section;
        } catch ( error ) {
            console.error( 'Error updating section:', error );
            throw error;
        }
    }

    async remove( id: string ) {
        try {
            const section = await this.section.delete({
                where: { id },
            });

            return section;
        } catch ( error ) {
            console.error( 'Error deleting section:', error );
            throw error;
        }
    }

    /**
     * Process an Excel file containing section data
     * @param file The uploaded Excel file
     * @returns Array of processed section data
     */
    async processExcelFile( file: Express.Multer.File ) {
        if ( !file ) {
            throw new BadRequestException( 'No file uploaded' );
        }

        const fileExtension = file.originalname.split('.').pop()?.toLowerCase() || '';

        if ( !['xlsx', 'xls'].includes( fileExtension )) {
            throw new BadRequestException( 'Invalid file format. Only Excel files (.xlsx, .xls) are allowed.' );
        }

        try {
            const workbook = xlsx.read( file.buffer, {
                type        : 'buffer',
                cellDates   : false,
                cellNF      : false,
                cellStyles  : false
            });

            if ( !workbook.SheetNames || workbook.SheetNames.length === 0 ) {
                throw new BadRequestException( 'Excel file has no sheets' );
            }

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            if ( !worksheet ) {
                throw new BadRequestException( 'Could not read worksheet' );
            }

            const rawData       = xlsx.utils.sheet_to_json<ExcelSectionRow>( worksheet );
            const processedData = await this.#processRawData( rawData );

            return processedData;
        } catch ( error ) {
            console.error( 'Error processing Excel file:', error );
            throw new BadRequestException(`Error processing Excel file: ${error.message}`);
        }
    }


    #getCapacity( capacity: number, sizes: {
        id          : $Enums.SizeValue;
        min         : number | null;
        max         : number | null;
        lessThan    : number | null;
        greaterThan : number | null;
    }[] ): $Enums.SizeValue {
        for ( const size of sizes ) {
            if ( size.min && capacity < size.min ) return size.id;
            if ( size.max && capacity > size.max ) return size.id;
            if ( size.lessThan && capacity < size.lessThan ) return size.id;
            if ( size.greaterThan && capacity > size.greaterThan ) return size.id;
        }

        return SizeValue.XL;
    }


    #getSize( size: string, capacity: number ): $Enums.SizeValue {
        return {
            [SizeEnum.CORE]         : SizeValue.XS  as $Enums.SizeValue,
            [SizeEnum.GARAGE]       : SizeValue.S   as $Enums.SizeValue,
            [SizeEnum.DIS]          : SizeValue.XL  as $Enums.SizeValue,
            [SizeEnum.AUDITORIO]    : SizeValue.XL  as $Enums.SizeValue,
            [SizeEnum.LABPAC]       : SizeValue.XL  as $Enums.SizeValue,
            [SizeEnum.LABPCB]       : SizeValue.L   as $Enums.SizeValue,
            [SizeEnum.LABPCC]       : capacity === 60 ? SizeValue.L : SizeValue.S as $Enums.SizeValue,
            [SizeEnum.LABPCE]       : SizeValue.MS  as $Enums.SizeValue,
            [SizeEnum.LABRED]       : SizeValue.M   as $Enums.SizeValue,
            [SizeEnum.M]            : SizeValue.M   as $Enums.SizeValue,
            [SizeEnum.MS]           : SizeValue.MS  as $Enums.SizeValue,
            [SizeEnum.L]            : SizeValue.L   as $Enums.SizeValue,
            [SizeEnum.SE]           : SizeValue.S   as $Enums.SizeValue,
            [SizeEnum.S]            : SizeValue.S   as $Enums.SizeValue,
            [SizeEnum.XS]           : SizeValue.XS  as $Enums.SizeValue,
        }[size] || SizeValue.L;
    }

    #getSpaceType( name: string, size: string ): $Enums.RoomType {
        // Comunication
        const communications = [
            '223-D',
            'LAB.110-D'
        ];

        if (
            communications.includes( name ) ||
            size === 'LAB.RED'
        ) return SpaceType.COMMUNIC as $Enums.RoomType;

        // DIS
        if ( name === 'LAB.103-D' || size === SpaceType.DIS ) return SpaceType.DIS as $Enums.RoomType;

        // Laboratorio
        const space = [
            'Lab. Bioingeniería',
            'Lab. Ingenieria y Ciencias',
            'Lab. Física',
            'Lab. Informática',
            'Lab. Procesos Industriales'
        ];

        if ( space.includes( name )) return SpaceType.LAB as $Enums.RoomType;
        // Laboratorio PC
        else if ( name.toUpperCase().includes( 'LAB' )) return SpaceType.LABPC as $Enums.RoomType;

        // Auditorio
        if ( size === SpaceType.AUDITORIO ) return SpaceType.AUDITORIO as $Enums.RoomType;

        // Garage
        if ( size === SpaceType.GARAGE ) return SpaceType.GARAGE as $Enums.RoomType;

        // Core
        if ( size === SpaceType.CORE ) return SpaceType.CORE as $Enums.RoomType;

        return SpaceType.ROOM as $Enums.RoomType;
    }


    #getBuilding( name: string ): Building {
        const space = [
            'GARAGE EXTRAPROG.',
            'Lab. Bioingeniería',
            'Lab. Ingenieria y Ciencias',
            'Lab. Física',
            'Lab. Informática',
            'Lab. Procesos Industriales'
        ];

        const buildingList = [
            Building.B,
            Building.F,
            Building.F,
            Building.F,
            Building.F,
            Building.E
        ];

        if ( space.includes( name )) return buildingList[ space.indexOf( name )];

        return ( name.split( '-' )[1]?.[0]?.toUpperCase() as Building ) || Building.Z;
    }


    async #getNewEntitiesToCreate<
        TInputEntity extends Record<string, any>,
        TDbModel extends {
            findMany    : ( args: any ) => Promise<any[]>;
            createMany  : ( args: any ) => Promise<any>;
        },
        TUniqueKey extends keyof TInputEntity
    >(
        entities    : TInputEntity[],
        uniqueKey   : TUniqueKey,
        prismaModel : TDbModel,
        dbSearchKey : string,
        mapper: ( entity: TInputEntity ) => any
    ): Promise<any> {
        const uniqueKeysInExcel = entities.map( e => e[ uniqueKey ]) as Array<string | number | boolean>;
        const existingDbEntities = await prismaModel.findMany({
            where: {
                [dbSearchKey]: {
                    in: uniqueKeysInExcel,
                },
            },
            select: {
                [dbSearchKey]: true,
            },
        });

        const existingDbKeys = new Set( existingDbEntities.map( e => e[ dbSearchKey ]));

        return entities
            .filter( entity => !existingDbKeys.has( entity[ uniqueKey ]))
            .map( mapper );
    }

    /**
     * Process raw data from Excel file
     * @param rawData Raw data from Excel file
     * @returns Processed section data
     */
    async #processRawData( rawData: ExcelSectionRow[] ) {
        if ( !rawData || rawData.length === 0 ) {
            throw new BadRequestException( 'Excel file is empty or has no valid data' );
        }

        const dayModules = await this.dayModule.findMany({});

        if ( !dayModules || dayModules.length === 0 ) {
            throw new BadRequestException( 'No day modules found' );
        }

        const uniqueRoomsMap       = new Map<string, RoomData>();
        const uniqueProfessorsMap  = new Map<string, ProfessorData>();
        const uniqueSubjectsMap    = new Map<string, SubjectData>();
        const uniquePeriodsMap     = new Map<string, PeriodData>();

        const sectionList   : Section[] = [];
        const ssecList      : SubjectSection[] = [];

        const sizes = await this.size.findMany({
            select: {
                id          : true,
                min         : true,
                max         : true,
                lessThan    : true,
                greaterThan : true,
            }
        });

        for ( const row of rawData ) {
            // Rooms
            const roomName = row.Sala?.trim();

            if ( roomName && !uniqueRoomsMap.has( roomName )) {
                uniqueRoomsMap.set( roomName, {
                    id        : roomName,
                    building    : this.#getBuilding( roomName ),
                    capacity    : row.Capacidad,
                    sizeValue   : this.#getCapacity( row.Capacidad, sizes ),
                    spaceType   : this.#getSpaceType( roomName, row.Talla ),
                });
            }

            // Professors
            const professorId = row.ProfesorId;
            if ( professorId && !uniqueProfessorsMap.has( professorId )) {
                uniqueProfessorsMap.set( professorId, {
                    id      : professorId.toString(),
                    name    : row.PROF.trim(),
                });
            }

            // Subjects
            const subjectCode = row.Sigla?.trim();
            if ( subjectCode && !uniqueSubjectsMap.has( subjectCode )) {
                uniqueSubjectsMap.set( subjectCode, {
                    id          : subjectCode,
                    name        : row.NombreAsignatura?.trim(),
                    startDate   : new Date(row.FechaInicio),
                });
            }

            // Periods
            const periodName = `${row.PeriodoAcademicoId}-${row.TipoPeriodo?.trim()}`;
            if ( periodName && !uniquePeriodsMap.has( periodName )) {
                uniquePeriodsMap.set( periodName, {
                    id : row.PeriodoAcademicoId.toString(),
                    name: row.TipoPeriodo?.trim()
                });
            }

            // Sections
            const sectionId = uuidv7();
            sectionList.push({
                id                      : sectionId,
                code                    : row['Sec.'],
                session                 : row.Tipo,
                size                    : this.#getSize( row.Size, row.Capacidad ),
                correctedRegistrants    : row.Inscritos,
                realRegistrants         : row.InscritosOriginal,
                plannedBuilding         : row.Edificio,
                chairsAvailable         : row.SillasDisp,
                roomId                  : row.Sala,
                dayModuleId             : dayModules.find( dm => Number(dm.dayCode) === row.Dia && dm.moduleId === row.Modulo )?.id || 1,
                professorId             : row.ProfesorId?.toString() || null,
            });

            // SSEC
            ssecList.push({
                sectionId,
                subjectId: row.Sigla?.trim(),
                periodId: row.PeriodoAcademicoId.toString(),
            })
        }

        const newRoomsToCreate = await this.#getNewEntitiesToCreate(
            Array.from( uniqueRoomsMap.values() ),
            'id',
            this.room,
            'id',
            ( rData: RoomData ) => ({
                id          : rData.id,
                building    : rData.building,
                capacity    : rData.capacity,
                sizeId      : rData.sizeValue,
                type        : rData.spaceType,
            })
        );

        if ( newRoomsToCreate.length > 0 ) {
            await this.room.createMany({ data: newRoomsToCreate, skipDuplicates: true });
        }

        const newProfessorsToCreate = await this.#getNewEntitiesToCreate(
            Array.from( uniqueProfessorsMap.values() ),
            'id',
            this.professor,
            'id',
            ( pData: ProfessorData ) => ({
                id      : pData.id,
                name    : pData.name,
            })
        );

        if ( newProfessorsToCreate.length > 0 ) {
            await this.professor.createMany({ data: newProfessorsToCreate, skipDuplicates: true });
        }

        const newPeriodsToCreate = await this.#getNewEntitiesToCreate(
            Array.from( uniquePeriodsMap.values() ),
            'id',
            this.period,
            'id',
            ( pData: PeriodData ) => ({
                id      : pData.id,
                name    : pData.name,
            })
        );

        if ( newPeriodsToCreate.length > 0 ) {
            await this.period.createMany({ data: newPeriodsToCreate, skipDuplicates: true });
        }

        const newSubjectsToCreate = await this.#getNewEntitiesToCreate(
            Array.from( uniqueSubjectsMap.values() ),
            'id',
            this.subject,
            'id',
            (sData: SubjectData) => ({
                id          : sData.id,
                name        : sData.name,
                startDate   : sData.startDate,
            })
        );

        if ( newSubjectsToCreate.length > 0 ) {
            await this.subject.createMany({ data: newSubjectsToCreate, skipDuplicates: true });
        }

        if ( sectionList.length > 0 ) {
            const inserted = await this.section.createMany({ data: sectionList, skipDuplicates: true });

            if ( inserted.count === 0 ) {
                throw new BadRequestException( 'No sections were inserted' );
            }

            if ( ssecList.length > 0 ) {
                await this.subjectSection.createMany({ data: ssecList });
            }
        }

        return this.#getSectionData();
    }
}
