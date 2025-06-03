import { Injectable, BadRequestException, OnModuleInit }  from '@nestjs/common';

import * as xlsx                from 'xlsx';
import { PrismaClient, $Enums } from '@prisma/client';

import {
    PeriodData,
    ProfessorData,
    RoomData,
    SubjectData
}                               from '@sections/models/data.model';
import { CreateSectionDto }     from '@sections/dto/create-section.dto';
import { UpdateSectionDto }     from '@sections/dto/update-section.dto';
import { ProcessedSectionDto }  from '@sections/dto/processed-section.dto';
import { SizeValue }            from '@sections/enums/capacity-size.enum';


@Injectable()
export class SectionsService extends PrismaClient implements OnModuleInit {

    onModuleInit() {
		this.$connect();
	}

    create(createSectionDto: CreateSectionDto) {
        return 'This action adds a new section';
    }

    findAll() {
        return `This action returns all sections`;
    }

    findOne(id: number) {
        return `This action returns a #${id} section`;
    }

    update(id: number, updateSectionDto: UpdateSectionDto) {
        return `This action updates a #${id} section`;
    }

    remove(id: number) {
        return `This action removes a #${id} section`;
    }

    /**
     * Process an Excel file containing section data
     * @param file The uploaded Excel file
     * @returns Array of processed section data
     */
    async processExcelFile( file: Express.Multer.File ): Promise<ProcessedSectionDto[]> {
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

    #getCapacity( capacity: number ): $Enums.SizeValue {
        if ( capacity < 30 )    return SizeValue.XS as $Enums.SizeValue;
        if ( capacity < 40 )    return SizeValue.S as $Enums.SizeValue;
        if ( capacity < 50 )    return SizeValue.MS as $Enums.SizeValue;
        if ( capacity < 60 )    return SizeValue.M as $Enums.SizeValue;
        if ( capacity < 100 )   return SizeValue.L as $Enums.SizeValue;
        if ( capacity >= 100 )  return SizeValue.LABPCA as $Enums.SizeValue;

        return SizeValue.AUDITORIO as $Enums.SizeValue;
    }


    async #getNewEntitiesToCreate<
        TInputEntity extends Record<string, any>, // Entidad de entrada genérica
        TDbModel extends { // Tipo del cliente del modelo de Prisma
            findMany: (args: any) => Promise<any[]>;
            createMany: (args: any) => Promise<any>;
        },
        TUniqueKey extends keyof TInputEntity // Clave única en la entidad de entrada
    >(
        entities: TInputEntity[],
        uniqueKey: TUniqueKey, // La clave única en la entidad de entrada (ej. 'name', 'id')
        prismaModel: TDbModel, // El cliente del modelo de Prisma (ej. this.prisma.room)
        dbSearchKey: string, // El nombre de la columna en la DB para la búsqueda (ej. 'name', 'id')
        mapper: (entity: TInputEntity) => any // Mapper
    ): Promise<any> { // Retorna el tipo exacto para 'data' de createMany
        const uniqueKeysInExcel = entities.map(e => e[uniqueKey]) as Array<string | number | boolean>;

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

        const existingDbKeys = new Set(existingDbEntities.map(e => e[dbSearchKey]));

        // Filtra las entidades que no existen en la DB y las mapea al formato de creación
        return entities
            .filter(entity => !existingDbKeys.has(entity[uniqueKey]))
            .map(mapper);
    }

    /**
     * Process raw data from Excel file
     * @param rawData Raw data from Excel file
     * @returns Processed section data
     */
    async #processRawData( rawData: ExcelSectionRow[] ): Promise<ProcessedSectionDto[]> {
        if ( !rawData || rawData.length === 0 ) {
            throw new BadRequestException( 'Excel file is empty or has no valid data' );
        }

        const uniqueRoomsMap       = new Map<string, RoomData>();
        const uniqueProfessorsMap  = new Map<string, ProfessorData>();
        const uniqueSubjectsMap    = new Map<string, SubjectData>();
        const uniquePeriodsMap     = new Map<string, PeriodData>();

        for ( const row of rawData ) {
            // Rooms
            const roomName = row.Sala?.trim();

            if ( roomName && !uniqueRoomsMap.has( roomName )) {
                const buildingMatch = roomName.match( /-([A-Z])$/ );
                const building      = buildingMatch ? buildingMatch[1].toUpperCase() : 'A';
                uniqueRoomsMap.set( roomName, {
                    name        : roomName,
                    building    : building,
                    capacity    : Number(row.Capacidad),
                    sizeValue   : this.#getCapacity(Number(row.Capacidad)),
                });
            }

            // Professors
            const professorId = row.ProfesorId;
            if ( professorId && !uniqueProfessorsMap.has( professorId ) ) {
                uniqueProfessorsMap.set( professorId, {
                    id      : professorId.toString(),
                    name    : row.PROF.trim(),
                });
            }

            // Subjects
            const subjectCode = row.Sigla?.trim();
            if ( subjectCode && !uniqueSubjectsMap.has( subjectCode ) ) {
                uniqueSubjectsMap.set( subjectCode, {
                    name        : row.NombreAsignatura?.trim(),
                    code        : subjectCode,
                    startDate   : row.FechaInicio,
                    periodId    : '',
                });
            }

            // Periods
            const periodName = row.TipoPeriodo?.trim();
            if ( periodName && !uniquePeriodsMap.has( periodName ) ) {
                uniquePeriodsMap.set( periodName, { name: periodName });
            }
        }

        const newRoomsToCreate = await this.#getNewEntitiesToCreate(
            Array.from(uniqueRoomsMap.values()),
            'name',
            this.room,
            'name',
            ( rData: RoomData ) => ({
                name        : rData.name,
                building    : rData.building,
                capacity    : rData.capacity,
                sizeId      : rData.sizeValue,
            })
        );

        console.log('🚀 ~ file: sections.service.ts:211 ~ newRoomsToCreate:', newRoomsToCreate)


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

        console.log('🚀 ~ file: sections.service.ts:231 ~ newProfessorsToCreate:', newProfessorsToCreate)

        if ( newProfessorsToCreate.length > 0 ) {
            await this.professor.createMany({ data: newProfessorsToCreate, skipDuplicates: true });
        }

        // Procesar e insertar Academic Periods
        const newPeriodsToCreate = await this.#getNewEntitiesToCreate(
            Array.from( uniquePeriodsMap.values() ),
            'name',
            this.period,
            'name',
            ( pData: PeriodData ) => ({
                name: pData.name
            })
        );

        console.log('🚀 ~ file: sections.service.ts:265 ~ newPeriodsToCreate:', newPeriodsToCreate)

        if ( newPeriodsToCreate.length > 0 ) {
            await this.period.createMany({ data: newPeriodsToCreate, skipDuplicates: true });
        }

        const currentYear       = new Date().getFullYear();
        const startOfYear       = new Date( currentYear, 0, 1 );
        const startOfNextYear   = new Date( currentYear + 1, 0, 1 );

        const periods = await this.period.findMany({
            select: {
                id      : true,
                name    : true,
            },
            where: {
                createdAt: {
                    gte : startOfYear,
                    lt  : startOfNextYear
                }
            }
        });

        console.log('🚀 ~ file: sections.service.ts:265 ~ periods:', periods)


        const newSubjectsToCreate = await this.#getNewEntitiesToCreate(
            Array.from(uniqueSubjectsMap.values()),
            'code',
            this.subject,
            'code',
            (sData: SubjectData) => ({
                name        : sData.name,
                code        : sData.code,
                startDate   : sData.startDate,
                periodId    : periods.find( p => p.name === sData.name )?.id,
            })
        );

        if ( newSubjectsToCreate.length > 0 ) {
            await this.subject.createMany({ data: newSubjectsToCreate, skipDuplicates: true });
        }

        return []
    }
}
