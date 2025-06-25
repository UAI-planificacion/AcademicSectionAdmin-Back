import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { CreateModuleDto } from '@modules/dto/create-module.dto';
import { UpdateModuleDto } from '@modules/dto/update-module.dto';


@Injectable()
export class ModulesService extends PrismaClient implements OnModuleInit {

    onModuleInit() {
		this.$connect();
	}


    #convertHourToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }


    async #calculateAndSetOrder(dayIds: number[]): Promise<void> {
        for (const dayId of dayIds) {
            // 1. Obtener todos los DayModules (y sus módulos asociados) para el día actual.
            const dayModules = await this.dayModule.findMany({
                where: { dayId: dayId },
                include: { module: true }, // Incluir el módulo para acceder a startHour y endHour
            });

            // 2. Ordenar los módulos por startHour y luego por endHour.
            const sortedModules = dayModules.sort((a, b) => {
                const timeA = this.#convertHourToMinutes(a.module.startHour);
                const timeB = this.#convertHourToMinutes(b.module.startHour);
                if (timeA !== timeB) {
                    return timeA - timeB;
                }
                const endTimeA = this.#convertHourToMinutes(a.module.endHour);
                const endTimeB = this.#convertHourToMinutes(b.module.endHour);
                return endTimeA - endTimeB;
            });

            // 3. Actualizar el campo 'order' para cada DayModule en la base de datos.
            for (let i = 0; i < sortedModules.length; i++) {
                await this.dayModule.update({
                    where: { id: sortedModules[i].id },
                    data: { order: i } // Asignar el orden secuencial
                });
            }
        }
    }


    async create( createModuleDto: CreateModuleDto ) {
        try {
            const { dayIds, ...data } = createModuleDto;
            const module = await this.module.create({ data });

            await this.dayModule.createMany({
                data: dayIds.map(dayId => ({
                    moduleId: module.id,
                    dayId,
                })),
            });

            await this.#calculateAndSetOrder( dayIds );

            return this.module.findUnique({
                where: { id: module.id },
                include: {
                    dayModules: {
                        orderBy: {
                            order: 'asc'
                        }
                    }
                },
            });
        } catch ( error ) {
            console.error( 'Error creating module:', error );
            throw error;
        }
    }


    async #filterModules() {
        const modules = await this.module.findMany({
            select: {
                id          : true,
                startHour   : true,
                endHour     : true,
                difference  : true,
                code        : true,
                isActive    : true,
                dayModules  : {
                    select: {
                        dayId   : true,
                        id      : true,
                        order   : true
                    },
                    orderBy: {
                        dayId: 'asc',
                    }
                }
            }
        });

        return modules.flatMap( module => {
            const { dayModules, ...rest } = module;

            return dayModules.map( dayModule => ({
                ...rest,
                id          : `${rest.id}${rest.difference? `-${rest.difference}` : ''}`,
                name        : `M${rest.code}:${dayModule.dayId}${rest.difference? `-${rest.difference}` : ''}`,
                dayId       : dayModule.dayId,
                dayModuleId : dayModule.id,
                order       : dayModule.order
            }));
        });
    }


    async findAllModules() {
        const modules = await this.module.findMany({
            select: {
                id          : true,
                code        : true,
                difference  : true,
                startHour   : true,
                endHour     : true,
                isActive    : true,
                createdAt   : true,
                updatedAt   : true,
                dayModules  : {
                    select: {
                        dayId: true
                    }
                }
            }
        });

        return modules.map( module => ({
            id          : module.id,
            code        : module.code,
            difference  : module.difference,
            startHour   : module.startHour,
            endHour     : module.endHour,
            isActive    : module.isActive,
            createdAt   : module.createdAt,
            updatedAt   : module.updatedAt,
            name        : `M${module.code}`,
            days        : module.dayModules.map( dayModule => dayModule.dayId ),
        }));
    }


    async findAll() {
        return await this.#filterModules();
    }


    async findOne( id: number ) {
        return {}
        // return ( await this.#filterModules()).find( module => module.id === id );
    }


    async update( id: number, updateModuleDto: UpdateModuleDto ) {
        try {
            const { dayIds, ...data } = updateModuleDto;

            // Obtener el módulo existente para conocer sus asociaciones de día actuales.
            const existingModule = await this.module.findUnique({
                where: { id },
                include: { dayModules: true }
            });

            if (!existingModule) {
                // Manejar el caso si el módulo no se encuentra.
                throw new Error(`Module with ID ${id} not found.`);
            }

            // Identificar los IDs de días afectados: tanto los antiguos como los nuevos.
            const affectedDayIds: Set<number> = new Set();
            existingModule.dayModules.map(dm => dm.dayId).forEach(dayId => affectedDayIds.add(dayId));

            const module = await this.module.update({
                where: { id },
                data,
            });

            if ( dayIds ) {
                await this.dayModule.deleteMany({
                    where: { moduleId: id },
                });

                await this.dayModule.createMany({
                    data: dayIds.map(dayId => ({
                        moduleId: id,
                        dayId,
                    })),
                });

                // Añadir los nuevos IDs de días al conjunto de días afectados.
                dayIds.forEach(dayId => affectedDayIds.add(dayId));
            }

            // Recalcular y establecer el orden para todos los días afectados.
            if (affectedDayIds.size > 0) {
                await this.#calculateAndSetOrder(Array.from(affectedDayIds));
            }

            return module;
        } catch ( error ) {
            console.error( 'Error updating module:', error );
            throw error;
        }
    }


    // async remove( id: number ) {
    //     try {
    //         const module = await this.module.delete({
    //             where: { id },
    //         });

    //         return module;
    //     } catch ( error ) {
    //         console.error( 'Error deleting module:', error );
    //         throw error;
    //     }
    // }

    async remove(id: number) {
        try {
            // Obtener los IDs de los días asociados al módulo antes de eliminarlo.
            const existingDayModules = await this.dayModule.findMany({
                where: { moduleId: id },
                select: { dayId: true }
            });
            const affectedDayIds = existingDayModules.map(dm => dm.dayId);

            // Eliminar el módulo (lo que en cascada eliminará sus DayModules).
            const module = await this.module.delete({
                where: { id },
            });

            // Recalcular el orden para los días que fueron afectados por la eliminación.
            if (affectedDayIds.length > 0) {
                await this.#calculateAndSetOrder(affectedDayIds);
            }

            return module;
        } catch (error) {
            console.error('Error deleting module:', error);
            throw error;
        }
    }

}
