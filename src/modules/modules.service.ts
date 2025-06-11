import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { CreateModuleDto } from '@modules/dto/create-module.dto';
import { UpdateModuleDto } from '@modules/dto/update-module.dto';


@Injectable()
export class ModulesService extends PrismaClient implements OnModuleInit {

    onModuleInit() {
		this.$connect();
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

            return this.module.findUnique({
                where: { id: module.id },
                include: {
                    dayModules: true,
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
                order       : true,
                dayModules  : {
                    select: {
                        dayId: true,
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
                id      : `${rest.id}${rest.difference? `-${rest.difference}` : ''}`,
                name    : `M${rest.code}:${dayModule.dayId}${rest.difference? `-${rest.difference}` : ''}`,
                dayId   : dayModule.dayId
            }));
        });
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
            }

            return module;
        } catch ( error ) {
            console.error( 'Error updating module:', error );
            throw error;
        }
    }


    async remove( id: number ) {
        try {
            const module = await this.module.delete({
                where: { id },
            });

            return module;
        } catch ( error ) {
            console.error( 'Error deleting module:', error );
            throw error;
        }
    }

}
