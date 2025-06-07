import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { PrismaException }  from '@app/config/prisma-catch';
import { CreateSpaceDto }   from '@spaces/dto/create-space.dto';
import { UpdateSpaceDto }   from '@spaces/dto/update-space.dto';


@Injectable()
export class SpacesService extends PrismaClient implements OnModuleInit {
    onModuleInit() {
        this.$connect();
    }

    async create(createSpaceDto: CreateSpaceDto) {
        try {
            const space = await this.room.create({
                data: createSpaceDto
            });
            return space;
        } catch (error) {
            throw PrismaException.catch( error );
        }
    }

    findAll() {
        return this.room.findMany({});
    }

    findOne(id: string) {
        return this.room.findUnique({ where: { id } });
    }

    async update(id: string, updateSpaceDto: UpdateSpaceDto) {
        try {
            const space = await this.room.update({
                where: { id },
                data: updateSpaceDto
            });
            return space;
        } catch (error) {
            throw PrismaException.catch( error );
        }
    }

    async remove(id: string) {
        try {
            const space = await this.room.delete({ where: { id } });
            return space;
        } catch (error) {
            throw PrismaException.catch( error );
        }
    }
}
