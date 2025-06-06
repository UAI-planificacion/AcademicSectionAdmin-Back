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
            const { dayCodes, ...data } = createModuleDto;
            const module = await this.module.create({ data });

            await this.dayModule.createMany({
                data: dayCodes.map(dayCode => ({
                    moduleId: module.id,
                    dayCode,
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


    findAll() {
        return this.module.findMany({
            include: {
                dayModules: true,
            },
        });
    }


    findOne( id: number ) {
        return this.module.findUnique({
            where: { id },
            include: {
                dayModules: true,
            },
        });
    }


    async update( id: number, updateModuleDto: UpdateModuleDto ) {
        try {
            const { dayCodes, ...data } = updateModuleDto;

            const module = await this.module.update({
                where: { id },
                data,
            });

            if ( dayCodes ) {
                await this.dayModule.deleteMany({
                    where: { moduleId: id },
                });

                await this.dayModule.createMany({
                    data: dayCodes.map(dayCode => ({
                        moduleId: id,
                        dayCode,
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
